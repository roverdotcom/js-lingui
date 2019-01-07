"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.helpRun = helpRun;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Detect how cli command is being run (npm, yarn) and construct help
 * for follow-up commands based on that.
 *
 * Example:
 * $ yarn extract
 * ...
 * (use "yarn compile" to compile catalogs for production)
 *
 * $ yarn lingui extract
 * ...
 * (use "yarn lingui compile" to compile catalogs for production)
 *
 * $ npm run extract
 * ...
 * (use "npm run compile" to compile catalogs for production)
 */
function helpRun(command) {
  return preCommand + " " + command;
}

var commands = void 0;
try {
  commands = JSON.parse(process.env.npm_config_argv).original.slice(0, -1);
} catch (e) {
  commands = ["run"];
}
var isYarn = process.env.npm_config_user_agent.includes("yarn");
var preCommand = [isYarn ? "yarn" : "npm"].concat((0, _toConsumableArray3.default)(commands)).join(" ");