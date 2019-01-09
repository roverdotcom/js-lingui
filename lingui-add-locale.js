"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = command;

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _conf = require("@lingui/conf");

var _catalog = require("./api/catalog");

var _catalog2 = _interopRequireDefault(_catalog);

var _help = require("./api/help");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function command(config, locales) {
  var catalog = (0, _catalog2.default)(config);

  var results = locales.map(function (locale) {
    var _catalog$addLocale = catalog.addLocale(locale),
        _catalog$addLocale2 = (0, _slicedToArray3.default)(_catalog$addLocale, 2),
        created = _catalog$addLocale2[0],
        filename = _catalog$addLocale2[1];

    if (!filename) {
      console.log(_chalk2.default.red("Unknown locale: " + _chalk2.default.bold(locale) + "."));
      return false;
    } else if (created) {
      console.log(_chalk2.default.green("Added locale " + _chalk2.default.bold(locale) + "."));
    } else {
      console.log(_chalk2.default.yellow("Locale " + _chalk2.default.bold(locale) + " already exists."));
    }

    return true;
  });

  // At least one language was added successfully
  if (results.filter(Boolean).length) {
    console.log();
    console.log("(use \"" + _chalk2.default.yellow((0, _help.helpRun)("extract")) + "\" to extract messages)");
  }
}


if (require.main === module) {
  _commander2.default.description("Add target locales. Remove locale by removing <locale> " + "directory from your localeDir (e.g. ./locale/en)").arguments("<locale...>").option("--format <format>", "Format of message catalog").on("--help", function () {
    console.log("\n  Examples:\n");
    console.log("    # Add single locale");
    console.log("    $ " + (0, _help.helpRun)("add-locale en"));
    console.log("");
    console.log("    # Add multiple locales");
    console.log("    $ " + (0, _help.helpRun)("lingui add-locale en es fr ru"));
  }).parse(process.argv);

  if (!_commander2.default.args.length) _commander2.default.help();

  var config = (0, _conf.getConfig)();
  if (_commander2.default.format) {
    var msg = "--format option is deprecated and will be removed in @lingui/cli@3.0.0." + " Please set format in configuration https://lingui.js.org/ref/conf.html#format";
    console.warn(msg);
    config.format = _commander2.default.format;
  }

  command(config, _commander2.default.args);
}