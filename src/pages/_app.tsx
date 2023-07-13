import '@/styles/globals.css';

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Lato, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import React, { ReactElement, useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';

import LoginModal from '@/components/auth/LoginModal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useLoading } from '@/hooks/useRouterLoading';
import Layout from '@/layout/Layout';
import { NextPageWithLayout } from '@/types/layout';

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
}

const notoSans = Noto_Sans_KR({
  preload: false,
  weight: ['400', '500', '700'],
});

const lato = Lato({
  preload: false,
  weight: ['400', '700'],
  variable: '--lato',
});

const prettyNight = localFont({
  src: '../../public/fonts/Cafe24Oneprettynight-v2.0.woff2',
  weight: '400',
  variable: '--prettyNight',
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { nowLoading } = useLoading();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  if (!hydrated) return null;

  const getLayout =
    Component.getLayout || ((page: ReactElement) => <Layout>{page}</Layout>);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <RecoilRoot>
          <main
            className={`${notoSans.className} ${lato.variable} ${prettyNight.variable} h-full`}
          >
            {nowLoading && <LoadingSpinner />}
            {getLayout(<Component {...pageProps} />)}
            <LoginModal />
          </main>
        </RecoilRoot>
      </Hydrate>
    </QueryClientProvider>
  );
}
