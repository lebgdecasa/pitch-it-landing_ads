import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import WaitlistEntry from '@/models/WaitlistEntry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await dbConnect();
    
    const { email, language } = req.body;
    
    // Validate input
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    
    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    // Check if email already exists
    const existingEntry = await WaitlistEntry.findOne({ email });
    if (existingEntry) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email already registered. Thank you for your interest!' 
      });
    }
    
    // Create new waitlist entry
    const waitlistEntry = new WaitlistEntry({
      email,
      language: language || 'en',
      source: 'website'
    });
    
    await waitlistEntry.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully added to waitlist!' 
    });
    
  } catch (error) {
    console.error('Waitlist API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error. Please try again later.' 
    });
  }
}
