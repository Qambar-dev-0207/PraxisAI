'use server'

import { auth } from '@/auth'
import { getDb } from '../lib/mongodb'
import { revalidatePath } from 'next/cache'
import { analyzeThought, generateEmbedding, analyzePatterns } from '../lib/ai'
import { ObjectId } from 'mongodb'
import { Thought, Pattern, Insight } from '../lib/types'

// Helper to sanitize Mongo docs recursively
function serializeDoc(doc: unknown): unknown {
  if (!doc) return null;

  if (Array.isArray(doc)) {
    return doc.map(serializeDoc);
  }

  if (doc instanceof ObjectId || (typeof doc === 'object' && (doc as { _bsontype?: string })?._bsontype === 'ObjectID')) {
    return doc.toString();
  }

  if (doc instanceof Date) {
    return doc;
  }

  if (typeof doc === 'object' && doc !== null) {
    const newDoc: Record<string, unknown> = {};
    const obj = doc as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (key === '_id') {
        newDoc.id = serializeDoc(value);
      } else {
        newDoc[key] = serializeDoc(value);
      }
    }
    return newDoc;
  }

  return doc;
}

export async function analyzeInput(content: string) {
  return await analyzeThought(content)
}

export async function saveThought(
  content: string, 
  importance: 'TODAY' | 'WEEK' | 'LATER' | 'NOT_IMPORTANT', 
  processedContent?: string, 
  tags: string[] = []
) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");
    
    const db = await getDb();
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    let reviewDate: Date | null = new Date()

    switch (importance) {
      case 'TODAY':
        reviewDate = new Date()
        break
      case 'WEEK':
        // 3 days later
        reviewDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        break
      case 'LATER':
        // 7 days later
        reviewDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'NOT_IMPORTANT':
        reviewDate = null
        break
      default:
        reviewDate = new Date()
    }

    // 1 & 2. Generate Embedding and Fetch Context in parallel
    const [embedding, recentThoughts] = await Promise.all([
      generateEmbedding(content).then(res => res || []),
      db.collection<Thought>('thoughts')
        .find({ userId: user._id as ObjectId })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray()
    ]);

    // 3. Analyze Patterns
    const foundPatterns = await analyzePatterns(
      content, 
      recentThoughts.map((t) => ({ content: t.content, date: t.createdAt }))
    )

    // 4. Save Thought
    const newThoughtResult = await db.collection<Thought>('thoughts').insertOne({
      content,
      processedContent: processedContent || content,
      importance,
      tags,
      reviewDate,
      embedding,
      isArchived: importance === 'NOT_IMPORTANT',
      isReviewed: false,
      createdAt: new Date(),
      userId: user._id as ObjectId
    })

    const newThoughtId = newThoughtResult.insertedId;

    // 5. Save Patterns & Insights concurrently
    if (foundPatterns && foundPatterns.length > 0) {
      await Promise.all(foundPatterns.map(async (p: any) => {
          const patternResult = await db.collection<Pattern>('patterns').insertOne({
              title: p.title,
              description: p.description,
              confidence: p.confidence || 0.8,
              relatedThoughtIds: [newThoughtId, ...recentThoughts.slice(0, 5).map((t) => t._id as ObjectId)],
              suggestedAction: p.suggestedAction || null,
              userId: user._id as ObjectId,
              type: p.type as 'RECURRENCE' | 'CONTRADICTION' | 'CONNECTION',
              createdAt: new Date()
          });

          await db.collection<Insight>('insights').insertOne({
              content: p.description,
              type: p.type as 'RECURRENCE' | 'CONTRADICTION' | 'CONNECTION',
              patternId: patternResult.insertedId,
              createdAt: new Date(),
              isViewed: false
          });
      }));
    }

    revalidatePath('/')
    revalidatePath('/dashboard')
  } catch (error) {
    console.error("Error in saveThought:", error);
    throw error;
  }
}

export async function getPendingCount() {

  try {

    const session = await auth();

    if (!session?.user?.email) return 0;

    

    const db = await getDb();

    const user = await db.collection('users').findOne({ email: session.user.email });

    if (!user) return 0;



    const count = await db.collection<Thought>('thoughts').countDocuments({

        userId: user._id as ObjectId,

        isArchived: false,

        isReviewed: false,

        reviewDate: { $lte: new Date() }

    });

    

    return count

  } catch (error) {

    console.error("Error in getPendingCount:", error);

    return 0;

  }

}





export async function getRecallItems() {



  try {



    const session = await auth();



    if (!session?.user?.email) return [];



    



    const db = await getDb();



    const user = await db.collection('users').findOne({ email: session.user.email });



    if (!user) return [];







    const items = await db.collection<Thought>('thoughts')
      .find({
        userId: user._id as ObjectId,
        isArchived: false,
        isReviewed: false,
        reviewDate: { $lte: new Date() }
      })
      .sort({ masteryScore: 1, reviewDate: 1 }) // Prioritize low mastery
      .limit(5) // Increased limit slightly for better session
      .toArray();







    // Enrich with patterns and insights
    const enrichedItems = await Promise.all(items.map(async (item) => {
      // Find patterns that reference this thought ID
      const patterns = await db.collection<Pattern>('patterns')
          .find({ 
              userId: user._id as ObjectId,
              relatedThoughtIds: item._id as ObjectId
          })
          .toArray();

      // For each pattern, get its insights in parallel
      const patternsWithInsights = await Promise.all(patterns.map(async (p) => {
          const insights = await db.collection<Insight>('insights').find({ patternId: p._id as ObjectId }).toArray();
          return { ...p, insights };
      }));

      return { ...item, patterns: patternsWithInsights };
    }))







    return serializeDoc(enrichedItems) as (Thought & { patterns: (Pattern & { insights: Insight[] })[] })[]



  } catch (error) {



    console.error("Error in getRecallItems:", error);



    return [];



  }



}







    



    export async function processRecallItem(id: string, action: 'KEEP' | 'DONE' | 'SNOOZE' | 'INTEGRATED') {

      const db = await getDb();
      const objectId = new ObjectId(id);

      if (action === 'DONE' || action === 'INTEGRATED') {
        const increment = action === 'INTEGRATED' ? 20 : 10;
        const thought = await db.collection<Thought>('thoughts').findOne({ _id: objectId });
        const currentScore = thought?.masteryScore || 0;
        const newScore = Math.min(100, currentScore + increment);
        const isFullyIntegrated = newScore >= 100;

        await db.collection<Thought>('thoughts').updateOne(
            { _id: objectId },
            { 
              $set: { 
                masteryScore: newScore,
                isArchived: isFullyIntegrated, 
                isReviewed: true,
                reviewDate: isFullyIntegrated ? null : new Date(Date.now() + (currentScore / 10 + 2) * 24 * 60 * 60 * 1000) 
              } 
            }
        );
      } else if (action === 'KEEP') {
        await db.collection<Thought>('thoughts').updateOne(
            { _id: objectId },
            { $set: { reviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) } }
        );
      } else if (action === 'SNOOZE') {
        await db.collection<Thought>('thoughts').updateOne(
            { _id: objectId },
            { $set: { reviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) } }
        );
      }

  

  revalidatePath('/recall')

  revalidatePath('/')

}



export async function getRecentPatterns() {



  try {



    const session = await auth();



    if (!session?.user?.email) return [];



    



    const db = await getDb();



    const user = await db.collection('users').findOne({ email: session.user.email });



    if (!user) return [];







    const patterns = await db.collection<Pattern>('patterns')



      .find({ userId: user._id as ObjectId })



      .sort({ createdAt: -1 })



      .limit(3)



      .toArray();







    // Enrich with insights



    const patternsWithInsights = await Promise.all(patterns.map(async (p) => {



        const insights = await db.collection<Insight>('insights').find({ patternId: p._id as ObjectId }).toArray();



        return { ...p, insights };



    }));







    return serializeDoc(patternsWithInsights) as (Pattern & { insights: Insight[] })[]



  } catch (error) {



    console.error("Error in getRecentPatterns:", error);



    return [];



  }



}



export async function getMentalLoad(): Promise<{ load: number; status: 'LOW' | 'OPTIMAL' | 'HIGH' | 'CRITICAL' | 'UNKNOWN' | 'ERROR'; count: number }> {
  try {
    const session = await auth();
    if (!session?.user?.email) return { load: 0, status: 'UNKNOWN', count: 0 };

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) return { load: 0, status: 'UNKNOWN', count: 0 };

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayThoughts = await db.collection<Thought>('thoughts')
      .find({
        userId: user._id as ObjectId,
        createdAt: { $gte: startOfDay }
      })
      .toArray();

    // Calculate load: count + weight by importance
    let loadScore = 0;
    todayThoughts.forEach(t => {
      loadScore += 10; // base weight
      if (t.importance === 'TODAY') loadScore += 15;
      if (t.importance === 'WEEK') loadScore += 5;
    });

    // Normalize to 0-100 (assuming 100 is "high")
    const normalizedLoad = Math.min(100, loadScore);
    
    let status: 'LOW' | 'OPTIMAL' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (normalizedLoad > 85) status = 'CRITICAL';
    else if (normalizedLoad > 60) status = 'HIGH';
    else if (normalizedLoad > 30) status = 'OPTIMAL';

    return { load: normalizedLoad, status, count: todayThoughts.length };
  } catch (error) {
    console.error("Error in getMentalLoad:", error);
    return { load: 0, status: 'ERROR', count: 0 };
  }
}

export async function getNeuralMapData() {
  try {
    const session = await auth();
    if (!session?.user?.email) return { thoughts: [], patterns: [] };

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) return { thoughts: [], patterns: [] };

    const thoughts = await db.collection<Thought>('thoughts')
      .find({ userId: user._id as ObjectId, isArchived: false })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const patterns = await db.collection<Pattern>('patterns')
      .find({ userId: user._id as ObjectId })
      .toArray();

    return serializeDoc({ thoughts, patterns }) as { thoughts: Thought[], patterns: Pattern[] };
  } catch (error) {
    console.error("Error in getNeuralMapData:", error);
    return { thoughts: [], patterns: [] };
  }
}

export async function resolveContradiction(patternId: string, resolution: string) {
  try {
    const db = await getDb();
    const objectId = new ObjectId(patternId);

    // Archive the pattern and its related insights
    await Promise.all([
      db.collection('patterns').updateOne({ _id: objectId }, { $set: { resolved: true, resolution } }),
      db.collection('insights').updateMany({ patternId: objectId }, { $set: { isViewed: true } })
    ]);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error in resolveContradiction:", error);
    return { success: false };
  }
}





      
