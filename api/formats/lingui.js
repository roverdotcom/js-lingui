"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var format = {
  filename: "messages.json",

  write: function write(filename, catalog) {
    _fs2.default.writeFileSync(filename, (0, _stringify2.default)(catalog, null, 2));
  },
  read: function read(filename) {
    var raw = _fs2.default.readFileSync(filename).toString();

    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Cannot read " + filename + ": " + e.message);
      return null;
    }
  }
};
exports.default = format;