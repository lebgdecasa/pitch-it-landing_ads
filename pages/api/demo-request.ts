import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import DemoRequest from '@/models/DemoRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const {
      name,
      email,
      company,
      role,
      fundingStage,
      teamSize,
      interest,
      language,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content
    } = req.body;

    // Validation
    if (!name || !email || !role || !interest) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: name, email, role, interest'
      });
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    // Create demo request with all fields
    const demoRequest = new DemoRequest({
      name,
      email,
      company: company || '',
      role,
      fundingStage,
      teamSize,
      interest,
      language: language || 'en',
      status: 'pending',
      source: 'website',
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content
    });

    await demoRequest.save();

    return res.status(200).json({
      success: true,
      message: 'Demo request successfully submitted!',
      leadScore: demoRequest.leadScore
    });

  } catch (error) {
    console.error('Demo request API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
}
