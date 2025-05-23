import mongoose, { Schema, Document } from 'mongoose';

export interface IDemoRequest extends Document {
  name: string;
  email: string;
  company?: string;
  role: 'founder' | 'investor' | 'other';
  fundingStage?: string;
  teamSize?: string;
  interest: string;
  language: string;
  createdAt: Date;
  status: 'pending' | 'contacted' | 'completed';
  source: string;
  // UTM parameters
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  // Lead scoring
  leadScore?: number;
}

const DemoRequestSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  company: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['founder', 'investor', 'other']
  },
  fundingStage: {
    type: String,
    enum: ['pre-seed', 'seed', 'series-a', 'series-b+']
  },
  teamSize: {
    type: String,
    enum: ['1-5', '6-20', '21-50', '50+']
  },
  interest: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'fr'],
    default: 'en'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed'],
    default: 'pending'
  },
  source: {
    type: String,
    default: 'website'
  },
  // UTM tracking fields
  utm_source: {
    type: String,
    trim: true
  },
  utm_medium: {
    type: String,
    trim: true
  },
  utm_campaign: {
    type: String,
    trim: true
  },
  utm_term: {
    type: String,
    trim: true
  },
  utm_content: {
    type: String,
    trim: true
  },
  leadScore: {
    type: Number,
    default: 0
  }
});

// Calculate lead score before saving
DemoRequestSchema.pre('save', function(next) {
  let score = 0;

  // Role scoring
  if (this.role === 'founder') score += 20;
  if (this.role === 'investor') score += 30;

  // Funding stage scoring (for founders)
  if (this.fundingStage === 'seed') score += 10;
  if (this.fundingStage === 'series-a') score += 15;
  if (this.fundingStage === 'series-b+') score += 20;

  // Team size scoring
  if (this.teamSize === '6-20') score += 5;
  if (this.teamSize === '21-50') score += 10;
  if (this.teamSize === '50+') score += 15;

  // Company provided
  if (this.company) score += 5;

  // Interest length (engagement indicator)
  if (this.interest.length > 100) score += 5;
  if (this.interest.length > 200) score += 5;

  this.leadScore = score;
  next();
});

export default mongoose.models.DemoRequest || mongoose.model<IDemoRequest>('DemoRequest', DemoRequestSchema);
