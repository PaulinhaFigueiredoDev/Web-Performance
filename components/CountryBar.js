'use client';

import { useEffect, useState } from 'react';

export default function CountryBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      className={`country-bar${isVisible ? '' : ' pending'}`}
      aria-label="Delivery tax information"
      aria-live="polite"
      aria-hidden={!isVisible}
    >
      <p>
        Orders to <strong>France</strong> are subject to <strong>20%</strong> VAT
      </p>
    </section>
  );
}
