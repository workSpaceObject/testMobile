import pxtorem from 'postcss-pxtorem';

export default {
  "entry": "src/index.js",
  "disableCSSModules": false,
  "publicPath": "/",
  "less":"true",
  "theme": {
    "@primary-color": "#108EE9",
    "@link-color": "#108EE9",
    "@border-radius-base": "2px",
    "@font-size-base": "14px",
    "@line-height-base": "1.2"
  },
  "autoprefixer": null,
  "extraBabelPlugins": [
    "transform-runtime",
    ["import", { "libraryName": "antd-mobile","libraryDirectory": "lib", "style": true }]
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime"
      ],
      extraPostCSSPlugins: [
        pxtorem({
          rootValue: 100,
          propWhiteList: [],
        }),
      ],
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime"
      ],
      extraPostCSSPlugins: [
        pxtorem({
          rootValue: 100,
          propWhiteList: [],
        }),
      ],
    }
  }
}
