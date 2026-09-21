'use client';

import Script from 'next/script';

const consentOptions = {
  notice_banner_type: 'simple',
  consent_type: 'express',
  palette: 'light',
  language: 'en',
  page_load_consent_levels: ['strictly-necessary'],
  notice_banner_reject_button_hide: false,
  preferences_center_close_button_hide: false,
  page_refresh_confirmation_buttons: false,
  website_name: 'Performance Course'
};

export default function ThirdPartyScripts({ enabled }) {
  if (!enabled) {
    return null;
  }

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PKK35GL5');`}
      </Script>
      <Script
        src="https://www.freeprivacypolicy.com/public/cookie-consent/4.1.0/cookie-consent.js"
        strategy="afterInteractive"
        onLoad={() => window.cookieconsent?.run(consentOptions)}
      />
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PKK35GL5"
          height="0"
          width="0"
          className="analytics-frame"
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
