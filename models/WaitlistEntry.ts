import mongoose, { Schema, Document } from 'mongoose';

export interface IWaitlistEntry extends Document {
  email: string;
  language: string;
  createdAt: Date;
  source: string;
}

const WaitlistEntrySchema: Schema = new Schema({
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
  }
});

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.WaitlistEntry || mongoose.model<IWaitlistEntry>('WaitlistEntry', WaitlistEntrySchema);
