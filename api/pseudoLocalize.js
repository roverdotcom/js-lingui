"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (message) {
  message = addDelimiters(message);
  message = _pseudolocale2.default.str(message);

  return removeDelimiters(message);
};

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

var _pseudolocale = require("pseudolocale");

var _pseudolocale2 = _interopRequireDefault(_pseudolocale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var delimiter = "%&&&%";

_pseudolocale2.default.option.delimiter = delimiter;
// We do not want prepending and appending because of Plurals structure
_pseudolocale2.default.option.prepend = "";
_pseudolocale2.default.option.append = "";

/*
Regex should match HTML tags
It was taken from https://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx/
Example: https://regex101.com/r/bDHD9z/3
*/
var HTMLRegex = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g;
/*
Regex should match js-lingui plurals
Example: https://regex101.com/r/zXWiQR/3
*/
var PluralRegex = /{\w*,\s*plural,\s*\w*\s*{|}\s*\w*\s*({|})/g;
/*
Regex should match js-lingui variables
Example: https://regex101.com/r/dw1QHb/2
*/
var VariableRegex = /({\s*[a-zA-Z_$][a-zA-Z_$0-9]*\s*})/g;

function addDelimitersHTMLTags(message) {
  return message.replace(HTMLRegex, function (matchedString) {
    return "" + delimiter + matchedString + delimiter;
  });
}

function addDelimitersPlural(message) {
  return message.replace(PluralRegex, function (matchedString) {
    return "" + delimiter + matchedString + delimiter;
  });
}

function addDelimitersVariables(message) {
  return message.replace(VariableRegex, function (matchedString) {
    return "" + delimiter + matchedString + delimiter;
  });
}

var addDelimiters = _ramda2.default.compose(addDelimitersVariables, addDelimitersPlural, addDelimitersHTMLTags);

function removeDelimiters(message) {
  return message.replace(new RegExp(delimiter, "g"), "");
}