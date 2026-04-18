import { getUserFromToken } from '../../lib/supabase-client.js';
import { claimItem, applyCompletionReward, getUserReward } from '../../lib/bingo-service.js';

const VALID_UNITS = ['each', 'per lb', 'per oz', 'per gallon', 'per pint', 'per qt', 'per dozen'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  let user;
  try {
    user = await getUserFromToken(token);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { boardItemId, price, unit, photoUrl } = req.body ?? {};

  if (!boardItemId || typeof boardItemId !== 'string') {
    return res.status(400).json({ error: 'boardItemId is required' });
  }
  const parsedPrice = parseFloat(price);
  if (!price || isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 9999.99) {
    return res.status(400).json({ error: 'price must be a positive number (max 9999.99)' });
  }
  if (!unit || !VALID_UNITS.includes(unit)) {
    return res.status(400).json({ error: `unit must be one of: ${VALID_UNITS.join(', ')}` });
  }

  try {
    const result = await claimItem(boardItemId, user.id, {
      price:    parsedPrice,
      unit,
      photoUrl: photoUrl ?? null,
    });

    if (!result.success) {
      return res.status(409).json({ error: result.reason });
    }

    // Apply completion reward if board is done
    let reward = null;
    if (result.completed) {
      reward = await applyCompletionReward(user.id);
      if (!reward) {
        // Already rewarded this month — fetch existing
        reward = await getUserReward(user.id);
      }
    }

    return res.status(200).json({
      success:   true,
      claim:     result.claim,
      flagged:   result.flagged,
      completed: result.completed,
      reward,
    });
  } catch (err) {
    console.error('Claim error:', err.message);
    return res.status(500).json({ error: 'Failed to submit claim' });
  }
}
