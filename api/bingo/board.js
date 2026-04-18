import { getUserFromToken } from '../../lib/supabase-client.js';
import { getActiveBoard, annotateBoard, getUserProgress, nextResetISO } from '../../lib/bingo-service.js';

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
  if (!storeId || !VALID_STORES.includes(storeId)) {
    return res.status(400).json({ error: `storeId must be one of: ${VALID_STORES.join(', ')}` });
  }

  try {
    const [board, progress] = await Promise.all([
      getActiveBoard(storeId),
      getUserProgress(user.id, storeId),
    ]);

    return res.status(200).json({
      board:    annotateBoard(board, user.id),
      progress,
      resetAt:  nextResetISO(),
    });
  } catch (err) {
    console.error('Board fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to load board' });
  }
}
