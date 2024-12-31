// craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find((rule) => Array.isArray(rule.oneOf));

      if (oneOfRule) {
        // special handling list
        const fileLoaderRule = oneOfRule.oneOf.find(
          (rule) =>
            rule.loader &&
            rule.loader.includes('file-loader') &&
            rule.test &&
            rule.test.toString().includes('svg')
        );

        if (fileLoaderRule) {
          fileLoaderRule.exclude = [
            ...(fileLoaderRule.exclude || []),
            path.resolve(__dirname, 'src/assets/skills'),
          ];
        }

        // svgr processing
        oneOfRule.oneOf.unshift({
          test: /\.svg$/,
          include: path.resolve(__dirname, 'src/assets/skills'),
          use: [
            {
              loader: require.resolve('@svgr/webpack'),
              options: {
                svgo: false, // switch
              },
            },
          ],
        });
      }

      return webpackConfig;
    },
  },
};