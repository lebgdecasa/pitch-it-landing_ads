import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import DemoRequest from '@/models/DemoRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await dbConnect();
    
    const { name, email, company, interest, language } = req.body;
    
    // Validate required inputs
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    
    if (!interest) {
      return res.status(400).json({ success: false, error: 'Interest information is required' });
    }
    
    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    // Create new demo request
    const demoRequest = new DemoRequest({
      name,
      email,
      company: company || '',
      interest,
      language: language || 'en',
      status: 'pending',
      source: 'website'
    });
    
    await demoRequest.save();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Demo request successfully submitted!' 
    });
    
  } catch (error) {
    console.error('Demo request API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error. Please try again later.' 
    });
  }
}
