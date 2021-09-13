import { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0, viewport-fit=cover" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
