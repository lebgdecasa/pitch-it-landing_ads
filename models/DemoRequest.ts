import mongoose, { Schema, Document } from 'mongoose';

export interface IDemoRequest extends Document {
  name: string;
  email: string;
  company?: string;
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
  }
});

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.DemoRequest || mongoose.model<IDemoRequest>('DemoRequest', DemoRequestSchema);
