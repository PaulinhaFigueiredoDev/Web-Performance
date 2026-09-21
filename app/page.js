import CountryBar from '@/components/CountryBar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import ProductSection from '@/components/ProductSection';
import { featuredProducts } from '@/data/featured-products';
import { getProducts } from '@/lib/products';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <CountryBar />
        <ProductSection
          id="best-sellers-section"
          title="Best Sellers"
          products={featuredProducts}
        />
        <ProductSection
          id="all-products-section"
          title="All Products"
          products={products}
        />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
