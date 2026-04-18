const BASE_URL = 'https://api.kroger.com/v1';

// Module-level token cache — persists across requests on same Fluid Compute instance
let cachedToken = null;
let tokenExpiry  = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const clientId     = process.env.KROGER_CLIENT_ID;
  const clientSecret = process.env.KROGER_CLIENT_SECRET;
  const credentials  = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${BASE_URL}/connect/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization':  `Basic ${credentials}`,
      'Content-Type':   'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=product.compact',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Kroger auth ${res.status}: ${text}`);
  }

  const data  = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // refresh 60 s early
  return cachedToken;
}

function normalizeProduct(item) {
  const first    = item.items?.[0] ?? {};
  const regular  = first.price?.regular  ?? null;
  const promo    = first.price?.promo    ?? null;

  // Pick best front-facing medium image
  const image = item.images
    ?.find(i => i.perspective === 'front')
    ?.sizes?.find(s => s.size === 'medium')?.url
    ?? item.images?.[0]?.sizes?.[0]?.url
    ?? null;

  return {
    productId: item.productId,
    name:      item.description,
    price:     regular != null ? parseFloat(regular) : null,
    salePrice: promo   != null ? parseFloat(promo)   : null,
    size:      first.size ?? null,
    imageUrl:  image,
    upc:       item.upc ?? null,
  };
}

export async function searchProducts(query, limit = 10) {
  const token = await getToken();

  const url = new URL(`${BASE_URL}/products`);
  url.searchParams.set('filter.term',        query);
  url.searchParams.set('filter.limit',       String(limit));
  url.searchParams.set('filter.fulfillment', 'ais'); // in-store

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept':        'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Kroger products ${res.status}: ${text}`);
  }

  const data = await res.json();
  return (data.data ?? []).map(normalizeProduct);
}
