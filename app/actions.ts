'use server'

import { auth } from '@/auth'
import { getDb } from '../lib/mongodb'
import { revalidatePath } from 'next/cache'
import { analyzeThought, generateEmbedding, analyzePatterns } from '../lib/ai'
import { ObjectId } from 'mongodb'
import { Thought, Pattern, Insight } from '../lib/types'

function serializeDoc(doc: unknown): any {
  if (!doc) return null;

  if (Array.isArray(doc)) {
    return doc.map(serializeDoc);
  }

  if (doc instanceof ObjectId || (typeof doc === 'object' && (doc as any)?._bsontype === 'ObjectID')) {
    return (doc as any).toString();
  }

  if (doc instanceof Date) {
    return doc.toISOString();
  }

  if (typeof doc === 'object' && doc !== null) {
    const newDoc: Record<string, any> = {};
    const obj = doc as Record<string, any>;
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

async function requireUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const db = await getDb();
  const user = await db.collection('users').findOne({ email: session.user.email });
  if (!user) return null;
  return { db, user };
}

export async function analyzeInput(content: string) {
  try {
    if (!content || !content.trim()) return null;
    const analysis = await analyzeThought(content);
    if (!analysis) return null;
    return JSON.parse(JSON.stringify(analysis));
  } catch (error) {
    console.error("Error in analyzeInput:", error);
    return null;
  }
}

export async function saveThought(
  content: string,
  importance: 'TODAY' | 'WEEK' | 'LATER' | 'NOT_IMPORTANT',
  processedContent?: string,
  tags: string[] = []
) {
  const ctx = await requireUser();
  if (!ctx) throw new Error('Unauthorized');
  const { db, user } = ctx;

  if (!content || !content.trim()) throw new Error('Content required');

  let reviewDate: Date | null;
  switch (importance) {
    case 'TODAY':
      reviewDate = new Date();
      break;
    case 'WEEK':
      reviewDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      break;
    case 'LATER':
      reviewDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      break;
    case 'NOT_IMPORTANT':
      reviewDate = null;
      break;
    default:
      reviewDate = new Date();
  }

  const [embedding, recentThoughts] = await Promise.all([
    generateEmbedding(content).then(res => res || []),
    db.collection<Thought>('thoughts')
      .find({ userId: user._id as ObjectId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()
  ]);

  const foundPatterns = await analyzePatterns(
    content,
    recentThoughts.map((t) => ({ content: t.content, date: t.createdAt }))
  );

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
    userId: user._id as ObjectId,
    masteryScore: 0,
  });

  const newThoughtId = newThoughtResult.insertedId;

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
        createdAt: new Date(),
      });

      await db.collection<Insight>('insights').insertOne({
        content: p.description,
        type: p.type as 'RECURRENCE' | 'CONTRADICTION' | 'CONNECTION',
        patternId: patternResult.insertedId,
        createdAt: new Date(),
        isViewed: false,
      });
    }));
  }

  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function getPendingCount() {
  try {
    const ctx = await requireUser();
    if (!ctx) return 0;
    const { db, user } = ctx;

    return await db.collection<Thought>('thoughts').countDocuments({
      userId: user._id as ObjectId,
      isArchived: false,
      isReviewed: false,
      reviewDate: { $lte: new Date() },
    });
  } catch (error) {
    console.error("Error in getPendingCount:", error);
    return 0;
  }
}

export async function getRecallItems() {
  try {
    const ctx = await requireUser();
    if (!ctx) return [];
    const { db, user } = ctx;

    const items = await db.collection<Thought>('thoughts')
      .find({
        userId: user._id as ObjectId,
        isArchived: false,
        reviewDate: { $lte: new Date() },
      })
      .sort({ masteryScore: 1, reviewDate: 1 })
      .limit(5)
      .toArray();

    const enrichedItems = await Promise.all(items.map(async (item) => {
      const patterns = await db.collection<Pattern>('patterns')
        .find({
          userId: user._id as ObjectId,
          relatedThoughtIds: item._id as ObjectId,
        })
        .toArray();

      const patternsWithInsights = await Promise.all(patterns.map(async (p) => {
        const insights = await db.collection<Insight>('insights').find({ patternId: p._id as ObjectId }).toArray();
        return { ...p, insights };
      }));

      return { ...item, patterns: patternsWithInsights };
    }));

    return serializeDoc(enrichedItems) as (Thought & { patterns: (Pattern & { insights: Insight[] })[] })[];
  } catch (error) {
    console.error("Error in getRecallItems:", error);
    return [];
  }
}

export async function processRecallItem(id: string, action: 'KEEP' | 'DONE' | 'SNOOZE' | 'INTEGRATED') {
  try {
    const ctx = await requireUser();
    if (!ctx) return { success: false, error: 'Unauthorized' };
    const { db, user } = ctx;

    if (!ObjectId.isValid(id)) return { success: false, error: 'Invalid id' };
    const objectId = new ObjectId(id);

    const thought = await db.collection<Thought>('thoughts').findOne({
      _id: objectId,
      userId: user._id as ObjectId,
    });
    if (!thought) return { success: false, error: 'Not found' };

    if (action === 'DONE' || action === 'INTEGRATED') {
      const increment = action === 'INTEGRATED' ? 20 : 10;
      const currentScore = thought.masteryScore || 0;
      const newScore = Math.min(100, currentScore + increment);
      const isFullyIntegrated = newScore >= 100;

      await db.collection<Thought>('thoughts').updateOne(
        { _id: objectId, userId: user._id as ObjectId },
        {
          $set: {
            masteryScore: newScore,
            isArchived: isFullyIntegrated,
            isReviewed: true,
            reviewDate: isFullyIntegrated ? null : new Date(Date.now() + (currentScore / 10 + 2) * 24 * 60 * 60 * 1000),
          },
        }
      );
    } else if (action === 'KEEP') {
      await db.collection<Thought>('thoughts').updateOne(
        { _id: objectId, userId: user._id as ObjectId },
        { $set: { reviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) } }
      );
    } else if (action === 'SNOOZE') {
      await db.collection<Thought>('thoughts').updateOne(
        { _id: objectId, userId: user._id as ObjectId },
        { $set: { reviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) } }
      );
    }

    revalidatePath('/recall');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error in processRecallItem:", error);
    return { success: false, error: 'Failed to process item' };
  }
}

export async function getRecentPatterns() {
  try {
    const ctx = await requireUser();
    if (!ctx) return [];
    const { db, user } = ctx;

    const patterns = await db.collection<Pattern>('patterns')
      .find({ userId: user._id as ObjectId })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();

    const patternsWithInsights = await Promise.all(patterns.map(async (p) => {
      const insights = await db.collection<Insight>('insights').find({ patternId: p._id as ObjectId }).toArray();
      return { ...p, insights };
    }));

    return serializeDoc(patternsWithInsights) as (Pattern & { insights: Insight[] })[];
  } catch (error) {
    console.error("Error in getRecentPatterns:", error);
    return [];
  }
}

export async function getMentalLoad(): Promise<{ load: number; status: 'LOW' | 'OPTIMAL' | 'HIGH' | 'CRITICAL' | 'UNKNOWN' | 'ERROR'; count: number }> {
  try {
    const ctx = await requireUser();
    if (!ctx) return { load: 0, status: 'UNKNOWN', count: 0 };
    const { db, user } = ctx;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayThoughts = await db.collection<Thought>('thoughts')
      .find({
        userId: user._id as ObjectId,
        createdAt: { $gte: startOfDay },
      })
      .toArray();

    let loadScore = 0;
    todayThoughts.forEach(t => {
      loadScore += 10;
      if (t.importance === 'TODAY') loadScore += 15;
      if (t.importance === 'WEEK') loadScore += 5;
    });

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
    const ctx = await requireUser();
    if (!ctx) return { thoughts: [], patterns: [] };
    const { db, user } = ctx;

    const [thoughts, patterns] = await Promise.all([
      db.collection<Thought>('thoughts')
        .find({ userId: user._id as ObjectId, isArchived: false })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray(),
      db.collection<Pattern>('patterns')
        .find({ userId: user._id as ObjectId })
        .toArray()
    ]);

    return serializeDoc({ thoughts, patterns }) as { thoughts: Thought[]; patterns: Pattern[] };
  } catch (error) {
    console.error("Critical Error in getNeuralMapData:", error);
    return { thoughts: [], patterns: [] };
  }
}

export async function resolveContradiction(patternId: string, resolution: string) {
  try {
    const ctx = await requireUser();
    if (!ctx) return { success: false, error: 'Unauthorized' };
    const { db, user } = ctx;

    if (!ObjectId.isValid(patternId)) return { success: false, error: 'Invalid id' };
    const objectId = new ObjectId(patternId);

    const pattern = await db.collection<Pattern>('patterns').findOne({
      _id: objectId,
      userId: user._id as ObjectId,
    });
    if (!pattern) return { success: false, error: 'Not found' };

    await Promise.all([
      db.collection('patterns').updateOne({ _id: objectId, userId: user._id as ObjectId }, { $set: { resolved: true, resolution } }),
      db.collection('insights').updateMany({ patternId: objectId }, { $set: { isViewed: true } }),
    ]);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error in resolveContradiction:", error);
    return { success: false };
  }
}

export async function getDashboardStats() {
  try {
    const ctx = await requireUser();
    if (!ctx) return null;
    const { db, user } = ctx;

    const userId = user._id as ObjectId;

    const [totalThoughts, archivedThoughts, avgMasteryResult] = await Promise.all([
      db.collection<Thought>('thoughts').countDocuments({ userId, isArchived: false }),
      db.collection<Thought>('thoughts').countDocuments({ userId, isArchived: true }),
      db.collection<Thought>('thoughts').aggregate([
        { $match: { userId } },
        { $group: { _id: null, avg: { $avg: '$masteryScore' } } },
      ]).toArray(),
    ]);

    const avgMastery = Math.round(avgMasteryResult[0]?.avg ?? 0);

    // Streak: count consecutive days ending today that have at least 1 thought
    const recentDates = await db.collection<Thought>('thoughts')
      .aggregate([
        { $match: { userId } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
        { $sort: { _id: -1 } },
        { $limit: 365 },
      ])
      .toArray();

    const dateSet = new Set(recentDates.map((d: any) => d._id as string));

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (dateSet.has(key)) {
        streak++;
      } else {
        break;
      }
    }

    return { totalThoughts, archivedThoughts, avgMastery, streak };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return null;
  }
}

export async function getAllThoughts(limit = 50, skip = 0) {
  try {
    const ctx = await requireUser();
    if (!ctx) return [];
    const { db, user } = ctx;

    const thoughts = await db.collection<Thought>('thoughts')
      .find({ userId: user._id as ObjectId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return serializeDoc(thoughts) as Thought[];
  } catch (error) {
    console.error("Error in getAllThoughts:", error);
    return [];
  }
}

export async function deleteThought(id: string) {
  try {
    const ctx = await requireUser();
    if (!ctx) return { success: false, error: 'Unauthorized' };
    const { db, user } = ctx;

    if (!ObjectId.isValid(id)) return { success: false, error: 'Invalid id' };
    const objectId = new ObjectId(id);

    await db.collection<Thought>('thoughts').deleteOne({
      _id: objectId,
      userId: user._id as ObjectId,
    });

    revalidatePath('/thoughts');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error in deleteThought:", error);
    return { success: false };
  }
}
