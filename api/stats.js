"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

exports.getStats = getStats;
exports.printStats = printStats;

var _cliTable = require("cli-table");

var _cliTable2 = _interopRequireDefault(_cliTable);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStats(catalog) {
  return [(0, _keys2.default)(catalog).length, (0, _keys2.default)(catalog).filter(function (key) {
    return !catalog[key].translation;
  }).length];
}

function printStats(config, catalogs) {
  var table = new _cliTable2.default({
    head: ["Language", "Total count", "Missing"],
    colAligns: ["left", "middle", "middle"],
    style: {
      head: ["green"],
      border: [],
      compact: true
    }
  });

  (0, _keys2.default)(catalogs).forEach(function (locale) {
    var _getStats = getStats(catalogs[locale]),
        _getStats2 = (0, _slicedToArray3.default)(_getStats, 2),
        all = _getStats2[0],
        translated = _getStats2[1];

    if (config.sourceLocale === locale) {
      table.push((0, _defineProperty3.default)({}, _chalk2.default.bold(locale) + " (source)", [all, "-"]));
    } else {
      table.push((0, _defineProperty3.default)({}, locale, [all, translated]));
    }
  });

  console.log(table.toString());
}