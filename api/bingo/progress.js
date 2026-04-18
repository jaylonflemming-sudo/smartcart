import { getUserFromToken } from '../../lib/supabase-client.js';
import { getUserProgress, getUserReward } from '../../lib/bingo-service.js';

const VALID_STORES = ['wegmans', 'aldi', 'traderjoes', 'weis'];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  let user;
  try {
    user = await getUserFromToken(token);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { storeId } = req.query;

  try {
    if (storeId) {
      if (!VALID_STORES.includes(storeId)) {
        return res.status(400).json({ error: `storeId must be one of: ${VALID_STORES.join(', ')}` });
      }
      const [progress, reward] = await Promise.all([
        getUserProgress(user.id, storeId),
        getUserReward(user.id),
      ]);
      return res.status(200).json({ progress, reward });
    }

    // All stores at once
    const [storeProgress, reward] = await Promise.all([
      Promise.all(VALID_STORES.map(async sid => ({
        storeId: sid,
        progress: await getUserProgress(user.id, sid),
      }))),
      getUserReward(user.id),
    ]);

    return res.status(200).json({ stores: storeProgress, reward });
  } catch (err) {
    console.error('Progress fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch progress' });
  }
}
