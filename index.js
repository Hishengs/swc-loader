var swc = require("@swc/core");
var loaderUtils = require('loader-utils');

function makeLoader() {
  return function (source, inputSourceMap) {
    // Make the loader async
    var callback = this.async();
    var filename = this.resourcePath;

    var loaderOptions = loaderUtils.getOptions(this) || {};

    // Standardize on 'sourceMaps' as the key passed through to Webpack, so that
    // users may safely use either one alongside our default use of
    // 'this.sourceMap' below without getting error about conflicting aliases.
    if (
      Object.prototype.hasOwnProperty.call(loaderOptions, "sourceMap") &&
      !Object.prototype.hasOwnProperty.call(loaderOptions, "sourceMaps")
    ) {
      loaderOptions = Object.assign({}, loaderOptions, {
        sourceMaps: loaderOptions.sourceMap,
      });
      delete loaderOptions.sourceMap;
    }

    if (inputSourceMap && typeof inputSourceMap === "object") {
      inputSourceMap = JSON.stringify(inputSourceMap);
    }

    var programmaticOptions = Object.assign({}, loaderOptions, {
      filename,
      inputSourceMap: inputSourceMap || undefined,

      // Set the default sourcemap behavior based on Webpack's mapping flag,
      // but allow users to override if they want.
      sourceMaps:
        loaderOptions.sourceMaps === undefined
          ? this.sourceMap
          : loaderOptions.sourceMaps,

      // Ensure that Webpack will get a full absolute path in the sourcemap
      // so that it can properly map the module back to its internal cached
      // modules.
      sourceFileName: filename,
    });
    if (!programmaticOptions.inputSourceMap) {
      delete programmaticOptions.inputSourceMap;
    }

    var sync = programmaticOptions.sync;
    var parseMap = programmaticOptions.parseMap;

    // Remove loader related options
    delete programmaticOptions.sync;
    delete programmaticOptions.parseMap;
    delete programmaticOptions.customize;
    delete programmaticOptions.cacheDirectory;
    delete programmaticOptions.cacheIdentifier;
    delete programmaticOptions.cacheCompression;
    delete programmaticOptions.metadataSubscribers;

    // auto detect development mode
    if (this.mode && programmaticOptions.jsc && programmaticOptions.jsc.transform
      && programmaticOptions.jsc.transform.react &&
      !Object.prototype.hasOwnProperty.call(programmaticOptions.jsc.transform.react, "development")) {
      programmaticOptions.jsc.transform.react.development = this.mode === 'development'
    }

    if (programmaticOptions.sourceMaps === "inline") {
      // Babel has this weird behavior where if you set "inline", we
      // inline the sourcemap, and set 'result.map = null'. This results
      // in bad behavior from Babel since the maps get put into the code,
      // which Webpack does not expect, and because the map we return to
      // Webpack is null, which is also bad. To avoid that, we override the
      // behavior here so "inline" just behaves like 'true'.
      programmaticOptions.sourceMaps = true;
    }

    try {
      // console.log('======= swc-loader transformSync =======', { sync, programmaticOptions });
      if (sync) {
        var output = swc.transformSync(source, programmaticOptions);
        callback(
          null,
          output.code,
          parseMap ? JSON.parse(output.map) : output.map
        );
      } else {
        swc.transform(source, programmaticOptions).then(
          (output) => {
            // console.log(filename);
            // console.log('======= swc-loader transformSync output =======', output.code);
            callback(
              null,
              output.code,
              parseMap ? JSON.parse(output.map) : output.map
            );
          },
          (err) => {
            console.log('======= swc-loader transformSync err =======', err);
            throw err;
            // callback(err);
          }
        );
      }
    } catch (e) {
      console.log('======= swc-loader transformSync e =======', e);
      throw e;
      // return callback(e);
    }
  };
}

module.exports = makeLoader();
module.exports.custom = makeLoader;
