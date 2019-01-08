"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _compat = require("../compat");

var _babelPluginTransformJs = require("@lingui/babel-plugin-transform-js");

var _babelPluginTransformJs2 = _interopRequireDefault(_babelPluginTransformJs);

var _babelPluginTransformReact = require("@lingui/babel-plugin-transform-react");

var _babelPluginTransformReact2 = _interopRequireDefault(_babelPluginTransformReact);

var _babelPluginExtractMessages = require("@lingui/babel-plugin-extract-messages");

var _babelPluginExtractMessages2 = _interopRequireDefault(_babelPluginExtractMessages);

var _typescript = require("typescript");

var ts = _interopRequireWildcard(_typescript);

var _detect = require("../detect");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelRe = /(^.?|\.[^d]|[^.]d|[^.][^d])\.tsx?$/i;


var extractor = {
  match: function match(filename) {
    return babelRe.test(filename);
  },
  extract: function extract(filename, localeDir) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var content = _fs2.default.readFileSync(filename, "utf8");
    var isTsx = filename.endsWith(".tsx");
    // pass jsx to babel untouched
    var jsx = isTsx ? ts.JsxEmit.Preserve : ts.JsxEmit.None;
    var stripped = ts.transpileModule(content, {
      compilerOptions: {
        filename: filename,
        jsx: jsx,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2016, // use ES2015 or ES2016 to preserve tagged template literal
        allowSyntheticDefaultImports: true,
        moduleResolution: ts.ModuleResolutionKind.NodeJs
      }
    });

    var frameworkOptions = {};
    if (options.projectType === _detect.projectType.CRA) {
      frameworkOptions.presets = ["react-app"];
    }

    var _options$babelOptions = options.babelOptions,
        babelOptions = _options$babelOptions === undefined ? {} : _options$babelOptions;

    var plugins = [
    // Plugins run before presets, so we need to import transform-plugins
    // here until we have a better way to run extract-messages plugin
    // *after* all plugins/presets.
    // Transform plugins are idempotent, so they can run twice.
    _babelPluginTransformJs2.default, _babelPluginTransformReact2.default, [_babelPluginExtractMessages2.default, { localeDir: localeDir }]].concat((0, _toConsumableArray3.default)(babelOptions.plugins || []));

    if (isTsx) {
      plugins.unshift("syntax-jsx");
    }

    (0, _compat.transform)(stripped.outputText, (0, _extends3.default)({}, babelOptions, frameworkOptions, {
      filename: filename,
      plugins: plugins
    }));
  }
};

exports.default = extractor;