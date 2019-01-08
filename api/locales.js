"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValid = isValid;
exports.parse = parse;

var _makePlural = require("make-plural");

var _makePlural2 = _interopRequireDefault(_makePlural);

var _bcp = require("bcp-47");

var _bcp2 = _interopRequireDefault(_bcp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check that locale is valid according to BCP47 and we have plurals for it
 * @param locale: string - Locale in BCP47 format
 * @return {boolean}
 */
function isValid(locale) {
  var localeData = parse(locale);
  return localeData !== null && localeData !== undefined && localeData.language in _makePlural2.default;
}

/**
 * Parse locale in BCP47 format and
 * @param locale - Locale in BCP47 format
 * @return {LocaleInfo}
 */
function parse(locale) {
  if (typeof locale !== "string") return null;

  var schema = _bcp2.default.parse(locale.replace("_", "-"));
  if (!schema.language) return null;

  return {
    locale: _bcp2.default.stringify(schema),
    language: schema.language
  };
}