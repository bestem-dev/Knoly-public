import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import theme from '@src/theme';
import createEmotionCache from '@src/createEmotionCache';


export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" sizes="57x57" href="/assets/images/icons/apple-icon-57x57.png"/>
          <link rel="apple-touch-icon" sizes="60x60" href="/assets/images/icons/apple-icon-60x60.png"/>
          <link rel="apple-touch-icon" sizes="72x72" href="/assets/images/icons/apple-icon-72x72.png"/>
          <link rel="apple-touch-icon" sizes="76x76" href="/assets/images/icons/apple-icon-76x76.png"/>
          <link rel="apple-touch-icon" sizes="114x114" href="/assets/images/icons/apple-icon-114x114.png"/>
          <link rel="apple-touch-icon" sizes="120x120" href="/assets/images/icons/apple-icon-120x120.png"/>
          <link rel="apple-touch-icon" sizes="144x144" href="/assets/images/icons/apple-icon-144x144.png"/>
          <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/icons/apple-icon-152x152.png"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icons/apple-icon-180x180.png"/>
          <link rel="icon" type="image/png" sizes="192x192"  href="/assets/images/icons/android-icon-192x192.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icons/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="96x96" href="/assets/images/icons/favicon-96x96.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icons/favicon-16x16.png"/>
          <link rel="manifest" href="/manifest.json"/>
          <meta name="msapplication-TileColor" content="#0f172a"/>
          <meta name="msapplication-TileImage" content="/assets/images/icons/ms-icon-144x144.png"/>
          <meta name="theme-color" content="#40ffb5"/>
          <link rel="shortcut icon" href="/assets/images/icons/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>
          <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
          {/* <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          /> */}
          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};