"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

var _locales = require("./locales");

var locales = _interopRequireWildcard(_locales);

var _ = require(".");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  var format = _.formats[config.format];
  if (!format) {
    throw new Error("Unknown format " + config.format + ".");
  }

  var sourceFilename = _path2.default.join("{locale}", format.filename);
  var compiledFilename = _path2.default.join("{locale}", "messages.js");

  return {
    formatFilename: function formatFilename(pattern, locale) {
      return pattern.replace("{locale}", locale);
    },
    write: function write(locale, messages) {
      var filename = _path2.default.join(config.localeDir, this.formatFilename(sourceFilename, locale));

      var created = !_fs2.default.existsSync(filename);
      format.write(filename, messages, { language: locale });
      return [created, filename];
    },
    read: function read(locale) {
      var filename = _path2.default.join(config.localeDir, this.formatFilename(sourceFilename, locale));

      if (!_fs2.default.existsSync(filename)) return null;
      return format.read(filename);
    },
    readAll: function readAll() {
      var _this = this;

      return _ramda2.default.mergeAll(this.getLocales().map(function (locale) {
        return (0, _defineProperty3.default)({}, locale, _this.read(locale));
      }));
    },
    merge: function merge(prevCatalogs, nextCatalog) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var nextKeys = _ramda2.default.keys(nextCatalog);

      return _ramda2.default.mapObjIndexed(function (prevCatalog, locale) {
        var prevKeys = _ramda2.default.keys(prevCatalog);

        var newKeys = _ramda2.default.difference(nextKeys, prevKeys);
        var mergeKeys = _ramda2.default.intersection(nextKeys, prevKeys);
        var obsoleteKeys = _ramda2.default.difference(prevKeys, nextKeys);

        // Initialize new catalog with new keys
        var newMessages = _ramda2.default.mapObjIndexed(function (message, key) {
          return (0, _extends3.default)({
            translation: config.sourceLocale === locale ? message.defaults || key : ""
          }, message);
        }, _ramda2.default.pick(newKeys, nextCatalog));

        // Merge translations from previous catalog
        var mergedMessages = mergeKeys.map(function (key) {
          var updateFromDefaults = config.sourceLocale === locale && (prevCatalog[key].translation === prevCatalog[key].defaults || options.overwrite);

          var translation = updateFromDefaults ? nextCatalog[key].defaults : prevCatalog[key].translation;

          return (0, _defineProperty3.default)({}, key, (0, _extends3.default)({
            translation: translation
          }, _ramda2.default.omit(["obsolete, translation"], nextCatalog[key])));
        });

        // Mark all remaining translations as obsolete
        var obsoleteMessages = obsoleteKeys.map(function (key) {
          return (0, _defineProperty3.default)({}, key, (0, _extends3.default)({}, prevCatalog[key], {
            obsolete: true
          }));
        });

        return _ramda2.default.mergeAll([newMessages].concat((0, _toConsumableArray3.default)(mergedMessages), (0, _toConsumableArray3.default)(obsoleteMessages)));
      }, prevCatalogs);
    },
    getTranslation: function getTranslation(catalogs, locale, key, _ref4) {
      var fallbackLocale = _ref4.fallbackLocale,
          sourceLocale = _ref4.sourceLocale;

      var getTranslation = function getTranslation(locale) {
        return catalogs[locale][key].translation;
      };

      return (
        // Get translation in target locale
        getTranslation(locale) ||
        // Get translation in fallbackLocale (if any)
        fallbackLocale && getTranslation(fallbackLocale) ||
        // Get message default
        catalogs[locale][key].defaults ||
        // If sourceLocale is either target locale of fallback one, use key
        sourceLocale && sourceLocale === locale && key || sourceLocale && fallbackLocale && sourceLocale === fallbackLocale && key ||
        // Otherwise no translation is available
        undefined
      );
    },
    writeCompiled: function writeCompiled(locale, content) {
      var filename = _path2.default.join(config.localeDir, this.formatFilename(compiledFilename, locale));

      _fs2.default.writeFileSync(filename, content);
      return filename;
    },
    getLocale: function getLocale(filename) {
      var _filename$split$rever = filename.split(_path2.default.sep).reverse(),
          _filename$split$rever2 = (0, _slicedToArray3.default)(_filename$split$rever, 2),
          messages = _filename$split$rever2[0],
          locale = _filename$split$rever2[1];

      if (messages !== format.filename || !locales.isValid(locale)) return null;
      return locale;
    },
    getLocales: function getLocales() {
      var pattern = _path2.default.join(config.localeDir, "*");

      return _glob2.default.sync(pattern).map(function (filename) {
        // Don't use path.sep here, because glob.sync normalizes path separators
        var _filename$split$rever3 = filename.split("/").reverse(),
            _filename$split$rever4 = (0, _slicedToArray3.default)(_filename$split$rever3, 1),
            locale = _filename$split$rever4[0];

        return locales.isValid(locale) && locale;
      }).filter(Boolean);
    },
    addLocale: function addLocale(locale) {
      if (!locales.isValid(locale) && locale !== config.pseudoLocale) {
        return [false, null];
      }

      var filename = _path2.default.join(config.localeDir, this.formatFilename(sourceFilename, locale));

      if (!_fs2.default.existsSync(filename)) {
        var dirname = _path2.default.dirname(filename);

        _mkdirp2.default.sync(dirname);
        this.write(locale, {});

        return [true, filename];
      }

      return [false, filename];
    }
  };
};