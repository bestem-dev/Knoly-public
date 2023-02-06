const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development"
})

module.exports = withPWA({
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //       config.node = {
  //           net: 'empty',
  //           tls: 'empty',
  //           dns: 'empty'
  //       };
  //   }
  //   return config;
  // },
  images: {
    domains: ['storage.googleapis.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
  optimizeFonts: false,
  // productionBrowserSourceMaps: true,
});
