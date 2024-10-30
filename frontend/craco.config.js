const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const sassRule = webpackConfig.module.rules.find(
        (rule) => rule.test && rule.test.toString().includes('scss|sass')
      );

      if (sassRule) {
        sassRule.use.push({
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.resolve(__dirname, './src/styles/abstracts/_variables.scss'),
              path.resolve(__dirname, './src/styles/abstracts/_mixins.scss'),
            ],
          },
        });
      }

      return webpackConfig;
    },
  },
};