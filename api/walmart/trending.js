import { getTrending } from '../../lib/walmart-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const products = await getTrending();
    return res.status(200).json({ products, count: products.length });
  } catch (err) {
    console.error('Walmart trending error:', err.message);
    return res.status(502).json({ error: 'Failed to fetch trending products', detail: err.message });
  }
}
