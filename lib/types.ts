import { ObjectId } from 'mongodb';

export interface Thought {
  _id?: ObjectId;
  id?: string;
  content: string;
  processedContent: string;
  importance: 'TODAY' | 'WEEK' | 'LATER' | 'NOT_IMPORTANT';
  tags: string[];
  reviewDate: Date | null;
  embedding: number[];
  isArchived: boolean;
  isReviewed: boolean;
  createdAt: Date;
  userId: ObjectId;
  masteryScore?: number; // 0 to 100, tracking integration level
  patterns?: Pattern[];
}

export interface Pattern {
  _id?: ObjectId;
  id?: string;
  title: string;
  description: string;
  type: 'RECURRENCE' | 'CONTRADICTION' | 'CONNECTION';
  confidence: number;
  relatedThoughtIds: ObjectId[];
  suggestedAction: string | null;
  userId: ObjectId;
  createdAt: Date;
  insights?: Insight[];
}

export interface Insight {
  _id?: ObjectId;
  id?: string;
  content: string;
  type: 'RECURRENCE' | 'CONTRADICTION' | 'CONNECTION';
  patternId: ObjectId;
  createdAt: Date;
  isViewed: boolean;
}

export interface AIAnalysis {
  processedContent: string;
  suggestedImportance: 'TODAY' | 'WEEK' | 'LATER' | 'NOT_IMPORTANT';
  tags: string[];
  linguisticPrecision?: string; // Feedback on clarity/conciseness
  perspectiveShifts?: {
      label: string; // e.g., "The Stoic View"
      content: string; // e.g., "Focus only on what you can control..."
  }[];
}
