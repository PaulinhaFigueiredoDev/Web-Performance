function formatPrice(value) {
  return `US$ ${Number(value).toFixed(2)}`;
}

export default function ProductCard({ product }) {
  const titleId = `product-${product.id}-title`;

  return (
    <article
      className={`product${product.isNew ? ' new' : ''}`}
      aria-labelledby={titleId}
      data-testid="product-card"
    >
      <div className="product-picture">
        <img
          src={product.image}
          alt={product.imageAlt || product.title}
          loading="lazy"
          width="250"
          height="250"
        />
      </div>
      <div className="product-info">
        <p className="categories">{product.category}</p>
        <h3 className="title" id={titleId}>{product.title}</h3>
        <p className="price">
          <span className={product.originalPrice ? 'discounted-price' : undefined}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </p>
        <button type="button" aria-label={`Add to bag: ${product.title}`}>
          Add to bag
        </button>
      </div>
    </article>
  );
}
