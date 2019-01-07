#!/usr/bin/env node
"use strict";

var _utils = require("./api/utils");

var program = require("commander");

var version = void 0;
try {
  version = require("./package.json").version;
} catch (e) {
  version = "dev";
}

program.version(version).command("init", "Install all required packages").command("add-locale [locales...]", "Add new locale (generate empty message catalogues for this locale)").command("extract [files...]", "Extracts messages from source files").command("compile", "Compile message catalogs").parse(process.argv);

(0, _utils.helpMisspelledCommand)(process.argv[2], program.commands);