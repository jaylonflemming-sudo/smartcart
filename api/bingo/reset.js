import { resetAllBoards } from '../../lib/bingo-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify this is from Vercel Cron (or an authorized manual trigger)
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Weekly bingo board reset started:', new Date().toISOString());
    const results = await resetAllBoards();
    console.log('Weekly bingo board reset complete:', results);

    return res.status(200).json({
      success:  true,
      resetAt:  new Date().toISOString(),
      results,
    });
  } catch (err) {
    console.error('Board reset error:', err.message);
    return res.status(500).json({ error: 'Board reset failed', detail: err.message });
  }
}
