"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinOrigin = exports.splitOrigin = undefined;
exports.removeDirectory = removeDirectory;
exports.prettyOrigin = prettyOrigin;
exports.helpMisspelledCommand = helpMisspelledCommand;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _fuzzaldrin = require("fuzzaldrin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeDirectory(dir) {
  var keep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!_fs2.default.existsSync(dir)) return;
  var list = _fs2.default.readdirSync(dir);

  for (var i = 0; i < list.length; i++) {
    var filename = _path2.default.join(dir, list[i]);
    var stat = _fs2.default.statSync(filename);

    if (filename === "." || filename === "..") {
      // pass these files
    } else if (stat.isDirectory()) {
      // rmdir recursively
      removeDirectory(filename);
    } else {
      _fs2.default.unlinkSync(filename);
    }
  }

  if (!keep) {
    _fs2.default.rmdirSync(dir);
  }
}

function prettyOrigin(origins) {
  try {
    return origins.map(function (origin) {
      return origin.join(":");
    }).join(", ");
  } catch (e) {
    return "";
  }
}

/**
 * .. js:function:: helpMisspelledCommand(command [, availableCommands = []])
 *    :param: command - command passed to CLI
 *    :param: availableCommands - all commands defined in commander.js
 *
 *    If unknown commands is passed to CLI, check it agains all available commands
 *    for possible misspelled letter. Output help with suggestions to console.
 */
function helpMisspelledCommand(command) {
  var availableCommands = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var commandNames = availableCommands.map(function (command) {
    return command.name();
  });

  // if no command is supplied, then commander.js shows help automatically
  if (!command || commandNames.includes(command)) {
    return;
  }

  var suggestions = commandNames.map(function (name) {
    return {
      name: name,
      score: (0, _fuzzaldrin.score)(name, command.slice(0, name.length))
    };
  }).filter(function (nameScore) {
    return nameScore.score > 0;
  }).slice(0, 3).map(function (commandScore) {
    return _chalk2.default.inverse(commandScore.name);
  }).join(", ");

  console.log("lingui: command " + command + " is not a lingui command. " + "See 'lingui --help' for the list of available commands.");

  if (suggestions) {
    console.log();
    console.log("Did you mean: " + suggestions + "?");
  }
}

var splitOrigin = exports.splitOrigin = function splitOrigin(origin) {
  return origin.split(":");
};

var joinOrigin = exports.joinOrigin = function joinOrigin(origin) {
  return origin.join(":");
};