import { getProduct } from '../../../lib/walmart-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { itemId } = req.query;
  if (!itemId) {
    return res.status(400).json({ error: 'itemId is required' });
  }

  try {
    const product = await getProduct(itemId);
    return res.status(200).json({ product });
  } catch (err) {
    console.error('Walmart product fetch error:', err.message);
    return res.status(502).json({ error: 'Failed to fetch product', detail: err.message });
  }
}
