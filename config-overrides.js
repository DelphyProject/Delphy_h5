const path = require('path');
const { getLoader } = require('react-app-rewired');
const tsImportPluginFactory = require('ts-import-plugin');
const rewireLess = require('react-app-rewire-less');
const rewireCssModules = require('react-app-rewire-css-modules');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const rewireBundleAnalyzer = require('react-app-rewire-bundle-analyzer');
const rewireVendorSplitting = require('react-app-rewire-vendor-splitting');

module.exports = function override(config, env) {
  const { IS_CORDOVA_APP, PUBLIC_URL } = process.env;

  const tsLoader = getLoader(
    config.module.rules,
    rule =>
    rule.loader &&
    typeof rule.loader === 'string' &&
    rule.loader.includes('ts-loader')
  );

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory({
          libraryDirectory: 'es',
          libraryName: 'antd-mobile',
          style: 'css',
        }),
      ],
    }),
  };


  config = rewireCssModules(config, env);

  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true,
  })(config, env);

  config = rewireVendorSplitting(config, env);
  config = rewireReactHotLoader(config, env);

  if (env === 'production', process.argv.includes('--report')) {
    config = rewireBundleAnalyzer(config, env);
  }

  return config;
}
