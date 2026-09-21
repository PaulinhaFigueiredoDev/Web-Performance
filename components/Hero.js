import { getImageProps } from 'next/image';

export default function Hero() {
  const common = {
    alt: '',
    sizes: '100vw',
    fetchPriority: 'high',
    loading: 'eager',
    quality: 60
  };
  const { props: { srcSet: mobileSrcSet } } = getImageProps({
    ...common,
    src: '/images/Hero_Mobile.jpg',
    width: 864,
    height: 864
  });
  const { props: { srcSet: tabletSrcSet } } = getImageProps({
    ...common,
    src: '/images/Hero_Tablet.jpg',
    width: 1440,
    height: 1155
  });
  const { props: { srcSet: desktopSrcSet, ...desktopProps } } = getImageProps({
    ...common,
    src: '/images/Hero_Desktop.jpg',
    width: 2160,
    height: 1005
  });

  return (
    <section className="hero" aria-labelledby="hero-title">
      <link
        rel="preload"
        as="image"
        media="(max-width: 576px)"
        imageSrcSet={mobileSrcSet}
        imageSizes="100vw"
      />
      <link
        rel="preload"
        as="image"
        media="(min-width: 577px) and (max-width: 960px)"
        imageSrcSet={tabletSrcSet}
        imageSizes="100vw"
      />
      <link
        rel="preload"
        as="image"
        media="(min-width: 961px)"
        imageSrcSet={desktopSrcSet}
        imageSizes="100vw"
      />
      <picture>
        <source media="(max-width: 576px)" srcSet={mobileSrcSet} />
        <source media="(max-width: 960px)" srcSet={tabletSrcSet} />
        <img
          {...desktopProps}
          alt=""
          className="hero-image"
          srcSet={desktopSrcSet}
        />
      </picture>

      <div className="hero-content">
        <div className="container">
          <h1 id="hero-title">Discover our line of VR Headsets</h1>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium.
          </p>
          <a className="hero-button" href="#best-sellers-section">
            View Headsets
          </a>
        </div>
      </div>
    </section>
  );
}
