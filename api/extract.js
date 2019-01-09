"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

exports.extract = extract;
exports.collect = collect;
exports.cleanObsolete = cleanObsolete;
exports.order = order;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require("ora");

var _ora2 = _interopRequireDefault(_ora);

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

var _utils = require("./utils");

var _extractors = require("./extractors");

var extractors = _interopRequireWildcard(_extractors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Merge origins for messages found in different places. All other attributes
 * should be the same (raise an error if defaults are different).
 */
function mergeMessage(msgId, prev, next) {
  if (prev.defaults !== next.defaults) {
    throw new Error("Encountered different defaults for message " + _chalk2.default.yellow(msgId) + ("\n" + _chalk2.default.yellow((0, _utils.prettyOrigin)(prev.origin)) + " " + prev.defaults) + ("\n" + _chalk2.default.yellow((0, _utils.prettyOrigin)(next.origin)) + " " + next.defaults));
  }

  return (0, _extends3.default)({}, next, {
    origin: _ramda2.default.concat(prev.origin, next.origin)
  });
}
function extract(srcPaths, targetPath) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$ignore = options.ignore,
      ignore = _options$ignore === undefined ? [] : _options$ignore,
      _options$verbose = options.verbose,
      verbose = _options$verbose === undefined ? false : _options$verbose;

  var ignorePattern = ignore.length ? new RegExp(ignore.join("|"), "i") : null;

  srcPaths.forEach(function (srcFilename) {
    if (!_fs2.default.existsSync(srcFilename) || ignorePattern && ignorePattern.test(srcFilename)) return;

    if (_fs2.default.statSync(srcFilename).isDirectory()) {
      var subdirs = _fs2.default.readdirSync(srcFilename).map(function (filename) {
        return _path2.default.join(srcFilename, filename);
      });

      extract(subdirs, targetPath, options);
      return;
    }

    var extracted = _ramda2.default.values(extractors).some(function (ext) {
      if (!ext.match(srcFilename)) return false;

      var spinner = void 0;
      if (verbose) spinner = (0, _ora2.default)().start(srcFilename);

      ext.extract(srcFilename, targetPath, options);
      if (verbose && spinner) spinner.succeed();

      return true;
    });
  });
}

function collect(buildDir) {
  return _fs2.default.readdirSync(buildDir).map(function (filename) {
    var filepath = _path2.default.join(buildDir, filename);

    if (_fs2.default.lstatSync(filepath).isDirectory()) {
      return collect(filepath);
    }

    if (!filename.endsWith(".json")) return;

    try {
      return JSON.parse(_fs2.default.readFileSync(filepath).toString());
    } catch (e) {
      return {};
    }
  }).filter(Boolean).reduce(function (catalog, messages) {
    return _ramda2.default.mergeWithKey(mergeMessage, catalog, messages);
  }, {});
}

function cleanObsolete(catalogs) {
  return _ramda2.default.map(_ramda2.default.filter(function (message) {
    return !message.obsolete;
  }), catalogs);
}

function order(catalogs) {
  return _ramda2.default.map(orderByMessageId, catalogs);
}

function orderByMessageId(messages) {
  var orderedMessages = {};
  (0, _keys2.default)(messages).sort().forEach(function (key) {
    orderedMessages[key] = messages[key];
  });

  return orderedMessages;
}