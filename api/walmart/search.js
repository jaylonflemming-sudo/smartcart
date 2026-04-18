import { searchProducts } from '../../lib/walmart-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;
  if (!query?.trim()) {
    return res.status(400).json({ error: 'query parameter is required' });
  }

  try {
    const products = await searchProducts(query.trim());
    return res.status(200).json({ products, count: products.length });
  } catch (err) {
    console.error('Walmart search error:', err.message);
    return res.status(502).json({ error: 'Failed to fetch Walmart products', detail: err.message });
  }
}
