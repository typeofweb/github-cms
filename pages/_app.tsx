import Ms from 'ms';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';

import { Auth } from '../components/Auth';

import type { AppType } from 'next/dist/shared/lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Ms('7 days'),
      staleTime: Ms('24 hours'),
    },
  },
});

if (typeof window !== 'undefined') {
  const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });
  persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
    buster: '',
    maxAge: Ms('7 days'),
  }).catch(console.error);
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0, viewport-fit=cover" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
