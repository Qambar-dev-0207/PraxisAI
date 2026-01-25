'use server'

import { auth } from '@/auth'
import { getDb } from '../lib/mongodb'
import { revalidatePath } from 'next/cache'
import { analyzeThought, generateEmbedding, analyzePatterns } from '../lib/ai'
import { ObjectId } from 'mongodb'

// Helper to sanitize Mongo docs recursively
function serializeDoc(doc: any): any {
  if (!doc) return null;

  if (Array.isArray(doc)) {
    return doc.map(serializeDoc);
  }

  if (doc instanceof ObjectId || (doc?._bsontype === 'ObjectID')) {
    return doc.toString();
  }

  if (doc instanceof Date) {
    return doc;
  }

  if (typeof doc === 'object') {
    const newDoc: any = {};
    for (const key of Object.keys(doc)) {
      const value = doc[key];
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
  importance: string, 
  processedContent?: string, 
  tags: string[] = []
) {
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

  // 1. Generate Embedding
  const embedding = await generateEmbedding(content) || []

  // 2. Fetch Context (Last 50 thoughts)
  const recentThoughts = await db.collection('thoughts')
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  // 3. Analyze Patterns
  const foundPatterns = await analyzePatterns(
    content, 
    recentThoughts.map((t: any) => ({ content: t.content, date: t.createdAt }))
  )

  // 4. Save Thought
  const newThoughtResult = await db.collection('thoughts').insertOne({
    content,
    processedContent: processedContent || content,
    importance,
    tags,
    reviewDate,
    embedding,
    isArchived: importance === 'NOT_IMPORTANT',
    isReviewed: false,
    createdAt: new Date(),
    userId: user._id
  })

  const newThoughtId = newThoughtResult.insertedId;

  // 5. Save Patterns & Insights
  if (foundPatterns && foundPatterns.length > 0) {
    for (const p of foundPatterns) {
        // Create the pattern
        const patternResult = await db.collection('patterns').insertOne({
            title: p.title,
            description: p.description,
            confidence: p.confidence || 0.8,
            relatedThoughtIds: [newThoughtId, ...recentThoughts.slice(0, 5).map((t: any) => t._id)],
            suggestedAction: p.suggestedAction || null,
            userId: user._id,
            createdAt: new Date()
        });

        // Create the insight
        await db.collection('insights').insertOne({
            content: p.description,
            type: p.type,
            patternId: patternResult.insertedId,
            createdAt: new Date(),
            isViewed: false
        });
    }
  }

  revalidatePath('/')
  revalidatePath('/dashboard')
}

export async function getPendingCount() {
  const session = await auth();
  if (!session?.user?.email) return 0;
  
  const db = await getDb();
  const user = await db.collection('users').findOne({ email: session.user.email });
  if (!user) return 0;

  const count = await db.collection('thoughts').countDocuments({
      userId: user._id,
      isArchived: false,
      isReviewed: false,
      reviewDate: { $lte: new Date() }
  });
  
  return count
}

export async function getRecallItems() {
  const session = await auth();
  if (!session?.user?.email) return [];
  
  const db = await getDb();
  const user = await db.collection('users').findOne({ email: session.user.email });
  if (!user) return [];

  const items = await db.collection('thoughts')
    .find({
      userId: user._id,
      isArchived: false,
      isReviewed: false,
      reviewDate: { $lte: new Date() }
    })
    .sort({ reviewDate: 1 })
    .limit(3)
    .toArray();

  // Enrich with patterns and insights
  const enrichedItems = await Promise.all(items.map(async (item: any) => {
    // Find patterns that reference this thought ID
    const patterns = await db.collection('patterns')
        .find({ 
            userId: user._id,
            relatedThoughtIds: item._id 
        })
        .toArray();
    
    // For each pattern, get its insights
    const patternsWithInsights = await Promise.all(patterns.map(async (p: any) => {
        const insights = await db.collection('insights').find({ patternId: p._id }).toArray();
        return { ...p, insights };
    }));

    return { ...item, patterns: patternsWithInsights };
  }))

  return serializeDoc(enrichedItems)
}

export async function processRecallItem(id: string, action: 'KEEP' | 'DONE' | 'SNOOZE') {
  const db = await getDb();
  const objectId = new ObjectId(id);

  if (action === 'DONE') {
    await db.collection('thoughts').updateOne(
        { _id: objectId },
        { $set: { isArchived: true, isReviewed: true } }
    );
  } else if (action === 'KEEP') {
    await db.collection('thoughts').updateOne(
        { _id: objectId },
        { $set: { reviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) } }
    );
  } else if (action === 'SNOOZE') {
    await db.collection('thoughts').updateOne(
        { _id: objectId },
        { $set: { reviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) } }
    );
  }
  
  revalidatePath('/recall')
  revalidatePath('/')
}

export async function getRecentPatterns() {
  const session = await auth();
  if (!session?.user?.email) return [];
  
  const db = await getDb();
  const user = await db.collection('users').findOne({ email: session.user.email });
  if (!user) return [];

  const patterns = await db.collection('patterns')
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray();

  // Enrich with insights
  const patternsWithInsights = await Promise.all(patterns.map(async (p: any) => {
      const insights = await db.collection('insights').find({ patternId: p._id }).toArray();
      return { ...p, insights };
  }));

  return serializeDoc(patternsWithInsights)
}