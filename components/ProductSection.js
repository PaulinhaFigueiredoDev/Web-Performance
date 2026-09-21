import ProductCard from './ProductCard';

export default function ProductSection({ id, title, products }) {
  const titleId = `${id}-title`;

  return (
    <section className="best-sellers" id={id} aria-labelledby={titleId}>
      <h2 className="section-title" id={titleId}>{title}</h2>
      <hr aria-hidden="true" />
      <div className="product-slider">
        <div className="container">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
