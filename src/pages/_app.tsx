import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { SessionProvider } from "next-auth/react"
// import { WagmiConfig, createClient } from 'wagmi'
// import { getDefaultProvider } from 'ethers'
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import '@src/styles/nprogress.css'; //styles of nprogress
import '@src/styles/QRScanner.css'
import theme from '@src/theme';
import createEmotionCache from '@src/createEmotionCache';
import { withTRPC } from '@trpc/next';
import { AppRouter } from './api/trpc/[trpc]';
import { getCurrentURL } from '@src/utils/urls';
import ErrorBoundary from '@components/ErrorBoundary';
import { UserProvider } from '@src/utils/UserProvider';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session?: any;
}

// const client = createClient({
//   autoConnect: true,
//   provider: getDefaultProvider(),
// })
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// Add events for the loading bar
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());  

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <React.Fragment>
      <Head>
        <title>Knoly</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ErrorBoundary>
        {/* <WagmiConfig client={client}> */}
          <SessionProvider session={props.session}>
            <CacheProvider value={emotionCache}>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <UserProvider>
                  <Component {...pageProps} />
                </UserProvider>
              </ThemeProvider>
            </CacheProvider>
          </SessionProvider>
        {/* </WagmiConfig> */}
      </ErrorBoundary>
    </React.Fragment>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = getCurrentURL() + "/api/trpc"
    return {
      url,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);