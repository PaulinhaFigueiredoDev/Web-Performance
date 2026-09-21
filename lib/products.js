import fixtureProducts from '@/data/products.fixture.json';

const PRODUCTS_URL = 'https://fakestoreapi.com/products';

function normalizeProduct(product) {
  return {
    id: product.id,
    category: product.category,
    title: product.title,
    price: Number(product.price),
    image: product.image,
    imageAlt: product.imageAlt || product.title
  };
}

export async function getProducts() {
  if (process.env.E2E_USE_FIXTURES === 'true') {
    return fixtureProducts;
  }

  try {
    const response = await fetch(PRODUCTS_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Product API returned ${response.status}`);
    }

    const products = await response.json();
    return products.map(normalizeProduct);
  } catch (error) {
    console.error('Failed to load products. Using local fallback.', error);
    return fixtureProducts;
  }
}
