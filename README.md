# swc-loader
A Alternative Webpack Loader For SWC

[![npm][npm-image]][npm-url]

[npm-image]: https://badge.fury.io/js/@hisheng%2Fswc-loader.svg
[npm-url]: https://www.npmjs.com/package/@hisheng/swc-loader

## Usage

```bash
npm i @hisheng/swc-loader -D
```

`webpack.config.js`

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "@hisheng/swc-loader",
        }
      },
    ],
  },
};
```

and `.swcrc`

```js
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": true,
      "dynamicImport": false,
      "privateMethod": false,
      "functionBind": false,
      "exportDefaultFrom": false,
      "exportNamespaceFrom": false,
      "decorators": false,
      "decoratorsBeforeExport": false,
      "topLevelAwait": false,
      "importMeta": false
    },
    "transform": null,
    "target": "es5",
    "loose": false,
    "externalHelpers": false,
    // Requires v1.2.50 or upper and requires target to be es2016 or upper.
    "keepClassNames": false
  }
}
```