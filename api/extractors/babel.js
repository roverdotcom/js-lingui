"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _compat = require("../compat");

var _babelPluginTransformJs = require("@lingui/babel-plugin-transform-js");

var _babelPluginTransformJs2 = _interopRequireDefault(_babelPluginTransformJs);

var _babelPluginTransformReact = require("@lingui/babel-plugin-transform-react");

var _babelPluginTransformReact2 = _interopRequireDefault(_babelPluginTransformReact);

var _babelPluginExtractMessages = require("@lingui/babel-plugin-extract-messages");

var _babelPluginExtractMessages2 = _interopRequireDefault(_babelPluginExtractMessages);

var _detect = require("../detect");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelRe = /\.jsx?$/i;


var extractor = {
  match: function match(filename) {
    return babelRe.test(filename);
  },
  extract: function extract(filename, localeDir) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _options$babelOptions = options.babelOptions,
        babelOptions = _options$babelOptions === undefined ? {} : _options$babelOptions;

    var plugins = babelOptions.plugins || [];
    var frameworkOptions = {};

    if (options.projectType === _detect.projectType.CRA) {
      frameworkOptions.presets = ["react-app"];
    }

    (0, _compat.transformFileSync)(filename, (0, _extends3.default)({}, babelOptions, frameworkOptions, {
      plugins: [
      // Plugins run before presets, so we need to import transform-plugins
      // here until we have a better way to run extract-messages plugin
      // *after* all plugins/presets.
      // Transform plugins are idempotent, so they can run twice.
      _babelPluginTransformJs2.default, _babelPluginTransformReact2.default, [_babelPluginExtractMessages2.default, { localeDir: localeDir }]].concat((0, _toConsumableArray3.default)(plugins))
    }));
  }
};

exports.default = extractor;