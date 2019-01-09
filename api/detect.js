"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectType = undefined;
exports.detect = detect;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectType = exports.projectType = {
  CRA: "CRA",
  REACT: "REACT"
};

function getPackageJson() {
  var packageJsonPath = _path2.default.resolve("package.json");

  try {
    var json = _fs2.default.readFileSync(packageJsonPath, "utf8");
    return JSON.parse(json);
  } catch (e) {
    console.error(e);
    return null;
  }
}

function hasDependency(pkg, name) {
  return pkg.dependencies && pkg.dependencies[name] || pkg.devDependencies && pkg.devDependencies[name];
}

function detectFramework(pkg) {
  if (hasDependency(pkg, "react-scripts")) {
    return projectType.CRA;
  }

  if (hasDependency(pkg, "react")) {
    return projectType.REACT;
  }

  return null;
}

function detect() {
  var pkg = getPackageJson();
  if (!pkg) return null;

  return detectFramework(pkg);
}