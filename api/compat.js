"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformFileSync = exports.transform = undefined;

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _babelCore = require("babel-core");

var core = _interopRequireWildcard(_babelCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function catchBabelVersionMismatch(fn) {
  return function () {
    try {
      fn.apply(null, arguments);
    } catch (e) {
      if (e.message.startsWith("Plugin/Preset files are not allowed to export objects")) {
        var _require = require("../lingui-init"),
            makeInstall = _require.makeInstall;

        var install = makeInstall();
        console.log(_chalk2.default.red("Please install missing Babel 6 core package:"));
        console.log();
        console.log(install("babel-core@^6.0.0", true));
        console.log();

        process.exit(1);
      } else if (e.message.startsWith('Requires Babel "^7.0.0-0", but was loaded with "6.26.3".')) {
        var _require2 = require("../lingui-init"),
            _makeInstall = _require2.makeInstall;

        var _install = _makeInstall();
        console.log(_chalk2.default.red("Please install missing Babel 7 core packages:"));
        console.log();
        console.log(_install("babel-core@^7.0.0-bridge.0 @babel/core", true));
        console.log();

        process.exit(1);
      } else {
        throw e;
      }
    }
  };
}

var transform = exports.transform = catchBabelVersionMismatch(core.transform);
var transformFileSync = exports.transformFileSync = catchBabelVersionMismatch(core.transformFileSync);