"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = command;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _conf = require("@lingui/conf");

var _catalog = require("./api/catalog");

var _catalog2 = _interopRequireDefault(_catalog);

var _extract = require("./api/extract");

var _stats = require("./api/stats");

var _utils = require("./api/utils");

var _detect = require("./api/detect");

var _help = require("./api/help");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function command(config, options) {
  // `react-app` babel plugin used by CRA requires either BABEL_ENV or NODE_ENV to be
  // set. We're setting it here, because lingui macros are going to use them as well.
  if (!process.env.BABEL_ENV && !process.env.NODE_ENV) {
    process.env.BABEL_ENV = "development";
  }

  // We need macros to keep imports, so extract-messages plugin know what componets
  // to collect. Users usually use both BABEN_ENV and NODE_ENV, so it's probably
  // save to introduce a new env variable. LINGUI_EXTRACT=1 during `lingui extract`
  process.env.LINGUI_EXTRACT = "1";

  var catalog = (0, _catalog2.default)(config);
  var pseudoLocale = config.pseudoLocale;
  if (pseudoLocale) {
    catalog.addLocale(pseudoLocale);
  }

  var locales = catalog.getLocales();

  if (!locales.length) {
    console.log("No locales defined!\n");
    console.log("(use \"" + _chalk2.default.yellow((0, _help.helpRun)("add-locale <locale>")) + "\" to add one)");
    return false;
  }

  var buildDir = _path2.default.join(config.localeDir, "_build");
  if (_fs2.default.existsSync(buildDir)) {
    // remove only the content of build dir, not the directory itself
    (0, _utils.removeDirectory)(buildDir, true);
  } else {
    (0, _mkdirp2.default)(buildDir);
  }

  var projectType = (0, _detect.detect)();

  options.verbose && console.log("Extracting messages from source files…");
  (0, _extract.extract)(config.srcPathDirs, config.localeDir, {
    projectType: projectType,
    ignore: config.srcPathIgnorePatterns,
    verbose: options.verbose,
    babelOptions: options.babelOptions
  });
  options.verbose && console.log();

  options.verbose && console.log("Collecting messages…");
  var clean = options.clean ? _extract.cleanObsolete : function (id) {
    return id;
  };

  var nextCatalog = void 0;
  try {
    nextCatalog = (0, _extract.collect)(buildDir);
  } catch (e) {
    console.error(e);
    return false;
  }

  var prevCatalogs = catalog.readAll();
  var catalogs = (0, _extract.order)(clean(catalog.merge(prevCatalogs, nextCatalog, {
    overwrite: options.overwrite
  })));
  options.verbose && console.log();

  options.verbose && console.log("Writing message catalogues…");
  locales.map(function (locale) {
    return catalog.write(locale, catalogs[locale]);
  }).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        created = _ref2[0],
        filename = _ref2[1];

    if (!filename || !options.verbose) return;

    if (created) {
      console.log(_chalk2.default.green("Created " + filename));
    } else {
      console.log(_chalk2.default.green("Updated " + filename));
    }
  });
  options.verbose && console.log();
  options.verbose && console.log("Messages extracted!\n");

  console.log("Catalog statistics:");
  (0, _stats.printStats)(config, catalogs);
  console.log();

  console.log("(use \"" + _chalk2.default.yellow((0, _help.helpRun)("add-locale <locale>")) + "\" to add more locales)");
  console.log("(use \"" + _chalk2.default.yellow((0, _help.helpRun)("extract")) + "\" to update catalogs with new messages)");
  console.log("(use \"" + _chalk2.default.yellow((0, _help.helpRun)("compile")) + "\" to compile catalogs for production)");
  return true;
}

if (require.main === module) {
  _commander2.default.option("--overwrite", "Overwrite translations for source locale").option("--clean", "Remove obsolete translations").option("--babelOptions", "Babel options passed to transform/extract plugins").option("--verbose", "Verbose output").option("--format <format>", "Format of message catalogs").option("--convert-from <format>", "Convert from previous format of message catalogs").parse(process.argv);

  var config = (0, _conf.getConfig)();

  if (_commander2.default.format) {
    var msg = "--format option is deprecated and will be removed in @lingui/cli@3.0.0." + " Please set format in configuration https://lingui.js.org/ref/conf.html#format";
    console.warn(msg);
    config.format = _commander2.default.format;
  }

  if (_commander2.default.babelOptions) {
    var _msg = "--babelOptions option is deprecated and will be removed in @lingui/cli@3.0.0." + " Please set extractBabelOptions in configuration https://lingui.js.org/ref/conf.html#extractBabelOptions";
    console.warn(_msg);
  }

  var _prevFormat = _commander2.default.convertFrom;
  if (_prevFormat && config.format === _prevFormat) {
    console.log(_chalk2.default.red("Trying to migrate message catalog to the same format"));
    console.log("Set " + _chalk2.default.bold("new") + " format in lingui configuration\n" + (" and " + _chalk2.default.bold("previous") + " format using --convert-format option."));
    console.log();
    console.log("Example: Convert from lingui format to minimal");
    console.log(_chalk2.default.yellow((0, _help.helpRun)("extract --format minimal --convert-from lingui")));
    process.exit(1);
  }

  var result = command(config, {
    verbose: _commander2.default.verbose || false,
    clean: _commander2.default.clean || false,
    overwrite: _commander2.default.overwrite || false,
    babelOptions: config.extractBabelOptions || _commander2.default.babelOptions || {},
    prevFormat: _prevFormat
  });

  if (!result) process.exit(1);
}