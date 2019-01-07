"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _makePlural = require("make-plural");

var _makePlural2 = _interopRequireDefault(_makePlural);

var _conf = require("@lingui/conf");

var _catalog = require("./api/catalog");

var _catalog2 = _interopRequireDefault(_catalog);

var _compile = require("./api/compile");

var _help = require("./api/help");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function command(config, options) {
  var catalog = (0, _catalog2.default)(config);
  var locales = catalog.getLocales();

  if (!locales.length) {
    console.log("No locales defined!\n");
    console.log("(use \"" + _chalk2.default.yellow((0, _help.helpRun)("add-locale <locale>")) + "\" to add one)");
    return false;
  }

  var catalogs = _ramda2.default.mergeAll(locales.map(function (locale) {
    return (0, _defineProperty3.default)({}, locale, catalog.read(locale));
  }));

  var noMessages = _ramda2.default.compose(_ramda2.default.all(_ramda2.default.equals(true)), _ramda2.default.values, _ramda2.default.map(_ramda2.default.isEmpty));
  if (noMessages(catalogs)) {
    console.log("Nothing to compile, message catalogs are empty!\n");
    console.log("(use \"" + _chalk2.default.yellow((0, _help.helpRun)("extract")) + "\" to extract messages from source files)");
    return false;
  }

  console.log("Compiling message catalogs…");

  return locales.map(function (locale) {
    var _locale$split = locale.split(/[_-]/),
        _locale$split2 = (0, _slicedToArray3.default)(_locale$split, 1),
        language = _locale$split2[0];

    if (!_makePlural2.default[language]) {
      console.log(_chalk2.default.red("Error: Invalid locale " + _chalk2.default.bold(locale) + " (missing plural rules)!"));
      console.log();
      return false;
    }

    var messages = _ramda2.default.mergeAll((0, _keys2.default)(catalogs[locale]).map(function (key) {
      return (0, _defineProperty3.default)({}, key, catalog.getTranslation(catalogs, locale, key, {
        fallbackLocale: config.fallbackLocale,
        sourceLocale: config.sourceLocale
      }));
    }));

    if (!options.allowEmpty && config.sourceLocale !== locale) {
      var missing = _ramda2.default.keys(messages).filter(function (key) {
        return messages[key] === undefined;
      });

      if (missing.length) {
        console.log(_chalk2.default.red("Error: Failed to compile catalog for locale " + _chalk2.default.bold(locale) + "!"));

        if (options.verbose) {
          console.log(_chalk2.default.red("Missing translations:"));
          missing.forEach(function (msgId) {
            return console.log(msgId);
          });
        } else {
          console.log(_chalk2.default.red("Missing " + missing.length + " translation(s)"));
        }
        console.log();
        return false;
      }
    }

    var compiledCatalog = (0, _compile.createCompiledCatalog)(locale, messages, false, options.namespace || config.compileNamespace, config.pseudoLocale);
    var compiledPath = catalog.writeCompiled(locale, compiledCatalog);
    if (options.typescript) {
      var typescriptPath = compiledPath.replace(/\.js$/, "") + ".d.ts";
      _fs2.default.writeFileSync(typescriptPath, "import { Catalog } from '@lingui/core';\ndeclare const catalog: Catalog;\nexport = catalog;\n");
    }

    options.verbose && console.log(_chalk2.default.green(locale + " \u21D2 " + compiledPath));
    return compiledPath;
  });
}


if (require.main === module) {
  _commander2.default.description("Add compile message catalogs and add language data (plurals) to compiled bundle.").option("--strict", "Disable defaults for missing translations").option("--verbose", "Verbose output").option("--format <format>", "Format of message catalog").option("--typescript", "Create Typescript definition for compiled bundle").option("--namespace <namespace>", "Specify namespace for compiled bundle. Ex: cjs(default) -> module.exports, window.test -> window.test").on("--help", function () {
    console.log("\n  Examples:\n");
    console.log("    # Compile translations and use defaults or message IDs for missing translations");
    console.log("    $ " + (0, _help.helpRun)("compile"));
    console.log("");
    console.log("    # Compile translations but fail when there're missing");
    console.log("    # translations (don't replace missing translations with");
    console.log("    # default messages or message IDs)");
    console.log("    $ " + (0, _help.helpRun)("compile --strict"));
  }).parse(process.argv);

  var config = (0, _conf.getConfig)();

  if (_commander2.default.format) {
    var msg = "--format option is deprecated and will be removed in @lingui/cli@3.0.0." + " Please set format in configuration https://lingui.js.org/ref/conf.html#format";
    console.warn(msg);
    config.format = _commander2.default.format;
  }

  var results = command(config, {
    verbose: _commander2.default.verbose || false,
    allowEmpty: !_commander2.default.strict,
    typescript: _commander2.default.typescript || false,
    namespace: _commander2.default.namespace // we want this to be undefined if user does not specify so default can be used
  });

  if (!results || results.some(function (res) {
    return !res;
  })) {
    process.exit(1);
  }

  console.log("Done!");
}