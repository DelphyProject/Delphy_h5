const path = require('path');
const { getLoader } = require('react-app-rewired');
const tsImportPluginFactory = require('ts-import-plugin');
const rewireLess = require('react-app-rewire-less');
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

  Object.assign(config.resolve.alias, {
    '@': path.join(__dirname, 'src'),
  });

  // 混合APP打包配置
  if (env === 'production' && IS_CORDOVA_APP === 'true') {
    // 设置资源目录默认为`.`
    config.output.publicPath = './';
    // 在html中注入isCordovaApp参数
    for (const p of config.plugins) {
      if (p.constructor.name !== 'HtmlWebpackPlugin') continue;
      p.options.isCordovaApp = true;
      break;
    }
  }

  // 设置APP打包资源路径或者CDN地址
  if (env === 'production' && PUBLIC_URL) {
    config.output.publicPath = PUBLIC_URL;
  }

  config = rewireLess.withLoaderOptions({
    modifyVars: {
      // 'primary-color': '#00C1DE',
    },
    javascriptEnabled: true,
  })(config, env);
  config = rewireVendorSplitting(config, env);
  config = rewireReactHotLoader(config, env);

  if (env === 'production', process.argv.includes('--report')) {
    config = rewireBundleAnalyzer(config, env);
  }
  return config;
}
