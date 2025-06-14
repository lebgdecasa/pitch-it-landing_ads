import mongoose, { Schema, Document } from 'mongoose';

export interface IWaitlistEntry extends Document {
  firstName: string;
  lastName: string;
  email: string;
  language: string;
  createdAt: Date;
  source: string;
  // UTM parameters
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const WaitlistEntrySchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
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
export default mongoose.models.WaitlistEntry || mongoose.model<IWaitlistEntry>('WaitlistEntry', WaitlistEntrySchema);
