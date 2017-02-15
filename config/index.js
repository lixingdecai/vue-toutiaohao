// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

const cdnPath = '//olbge0v0r.bkt.clouddn.com/vue.toutiaohao.com/';
// const mpTestApi = 'https://test-mp.meiyou.com/';
// const mpApi = 'https://mp.meiyou.com/';
// const ssoTestApi = 'https://test-sso.meiyou.com/sso/';

module.exports = {
  build: {
    // env: require('./prod.env'),
    // index: path.resolve(__dirname, '../dist/index.html'),
    // assetsRoot: path.resolve(__dirname, '../dist'),
    // assetsSubDirectory: 'static',
    // assetsPublicPath: '/',
    // productionSourceMap: true,
    // // Gzip off by default as many popular static hosts such as
    // // Surge or Netlify already gzip all static assets for you.
    // // Before setting to `true`, make sure to:
    // // npm install --save-dev compression-webpack-plugin
    // productionGzip: false,
    // productionGzipExtensions: ['js', 'css']
    env: {
      NODE_ENV: '"production"',
      DEBUG_MODE: false
    },
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    // 配置CDN服务器地址
    assetsPublicPath: cdnPath,
    // assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
