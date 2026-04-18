import { searchProducts } from '../../lib/kroger-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

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
    console.error('Kroger search error:', err.message);
    return res.status(502).json({ error: 'Failed to fetch Kroger products', detail: err.message });
  }
}
