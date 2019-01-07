"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formats = exports.configureCatalog = exports.createCompiledCatalog = undefined;

var _compile = require("./compile");

Object.defineProperty(exports, "createCompiledCatalog", {
  enumerable: true,
  get: function get() {
    return _compile.createCompiledCatalog;
  }
});

var _lingui = require("./formats/lingui");

var _lingui2 = _interopRequireDefault(_lingui);

var _minimal = require("./formats/minimal");

var _minimal2 = _interopRequireDefault(_minimal);

var _po = require("./formats/po");

var _po2 = _interopRequireDefault(_po);

var _catalog = require("./catalog");

var _catalog2 = _interopRequireDefault(_catalog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.configureCatalog = _catalog2.default;
var formats = exports.formats = { lingui: _lingui2.default, minimal: _minimal2.default, po: _po2.default };