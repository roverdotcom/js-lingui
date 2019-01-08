"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.command = exports.installPackages = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var installPackages = exports.installPackages = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dryRun) {
    var install, type, usesReact, commonPackages, packages, verbosePackages, _ref4, confirm, commands;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            install = makeInstall();
            type = (0, _detect.detect)();
            usesReact = type === _detect.projectType.CRA || type === _detect.projectType.REACT;
            commonPackages = [["@lingui/macro", true], ["babel-plugin-macros", true]];
            packages = [].concat((0, _toConsumableArray3.default)(usesReact ? [["@lingui/react"]].concat(commonPackages) : [["@lingui/core"]].concat(commonPackages))).filter(Boolean);
            verbosePackages = packages.map(function (_ref2) {
              var _ref3 = (0, _slicedToArray3.default)(_ref2, 1),
                  packageName = _ref3[0];

              return _chalk2.default.yellow(packageName);
            }).join(", ");
            _context.next = 8;
            return _inquirer2.default.prompt({
              type: "confirm",
              name: "confirm",
              message: "Do you want to install " + verbosePackages + "?"
            });

          case 8:
            _ref4 = _context.sent;
            confirm = _ref4.confirm;

            if (confirm) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", false);

          case 12:
            commands = packages.map(function (_ref5) {
              var _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
                  packageName = _ref6[0],
                  dev = _ref6[1];

              return install(packageName, dev);
            });

            if (dryRun) {
              commands.forEach(function (command) {
                return console.log(command);
              });
            } else {
              commands.forEach(function (command) {
                return (0, _child_process.execSync)(command);
              });
            }

            return _context.abrupt("return", true);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function installPackages(_x2) {
    return _ref.apply(this, arguments);
  };
}();

var command = exports.command = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(program) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return installPackages(program.dryRun);

          case 2:
            return _context2.abrupt("return", true);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function command(_x3) {
    return _ref7.apply(this, arguments);
  };
}();

exports.makeInstall = makeInstall;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require("child_process");

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _detect = require("./api/detect");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasYarn() {
  return _fs2.default.existsSync(_path2.default.resolve("yarn.lock"));
}
function makeInstall() {
  var withYarn = hasYarn();

  return function (packageName) {
    var dev = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return withYarn ? "yarn add " + (dev ? "--dev " : "") + packageName : "npm install " + (dev ? "--save-dev" : "--save") + " " + packageName;
  };
}

if (require.main === module) {
  _commander2.default.option("--dry-run", "Output commands that would be run, but don't execute them.").parse(process.argv);

  command(_commander2.default);
}