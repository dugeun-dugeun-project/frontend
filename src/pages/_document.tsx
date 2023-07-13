import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

import { GA_TRACKING_ID } from '@/lib/gtag';

export default function Document() {
  return (
    <Html lang='ko'>
      <Head>
        <link rel='icon' href='/favicon.svg' />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy='afterInteractive'
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id='gtag-init'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <div id='portal' />
        <NextScript />
      </body>
    </Html>
  );
}
