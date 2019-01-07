"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.compile = compile;
exports.createCompiledCatalog = createCompiledCatalog;

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

var _messageformatParser = require("messageformat-parser");

var _babylon = require("babylon");

var _babelGenerator = require("babel-generator");

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var _makePlural = require("make-plural");

var _makePlural2 = _interopRequireDefault(_makePlural);

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

var _pseudoLocalize = require("./pseudoLocalize");

var _pseudoLocalize2 = _interopRequireDefault(_pseudoLocalize);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isString = function isString(s) {
  return typeof s === "string";
};
function compile(message) {
  var arg = t.identifier("a");

  var tokens = void 0;
  try {
    tokens = (0, _messageformatParser.parse)(message);
  } catch (e) {
    throw new Error("Can't parse message. Please check correct syntax: \"" + message + "\"");
  }
  var ast = processTokens(tokens, arg);

  if (isString(ast)) return t.stringLiteral(ast);

  return t.functionExpression(null, [arg], t.blockStatement([t.returnStatement(ast)]));
}

function processTokens(tokens, arg) {
  if (!tokens.filter(function (token) {
    return !isString(token);
  }).length) {
    return tokens.join("");
  }

  return t.arrayExpression(tokens.map(function (token) {
    if (isString(token)) {
      return t.stringLiteral(token);

      // # in plural case
    } else if (token.type === "octothorpe") {
      return t.stringLiteral("#");

      // simple argument
    } else if (token.type === "argument") {
      return t.callExpression(arg, [t.stringLiteral(token.arg)]);

      // argument with custom format (date, number)
    } else if (token.type === "function") {
      var _params = [t.stringLiteral(token.arg), t.stringLiteral(token.key)];

      var format = token.params[0];
      if (format) {
        _params.push(t.stringLiteral(format));
      }
      return t.callExpression(arg, _params);
    }

    // complex argument with cases
    var formatProps = [];

    if (token.offset) {
      formatProps.push(t.objectProperty(t.identifier("offset"), t.numericLiteral(parseInt(token.offset))));
    }

    token.cases.forEach(function (item) {
      var inlineTokens = processTokens(item.tokens, arg);
      formatProps.push(t.objectProperty(t.identifier(item.key), isString(inlineTokens) ? t.stringLiteral(inlineTokens) : inlineTokens));
    });

    var params = [t.stringLiteral(token.arg), t.stringLiteral(token.type), t.objectExpression(formatProps)];

    return t.callExpression(arg, params);
  }));
}

function buildExportStatement(expression) {
  var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "cjs";

  namespace = namespace.trim();
  if (namespace === "es") {
    return t.ExportDefaultDeclaration(expression);
  } else {
    var exportExpression = null;
    var matches = namespace.match(/^(window|global)\.([^.\s]+)$/);
    if (namespace === "cjs") {
      exportExpression = t.memberExpression(t.identifier("module"), t.identifier("exports"));
    } else if (matches) {
      exportExpression = t.memberExpression(t.identifier(matches[1]), t.identifier(matches[2]));
    } else {
      throw new Error("Invalid namespace param: \"" + namespace + "\"");
    }
    return t.expressionStatement(t.assignmentExpression("=", exportExpression, expression));
  }
}

function createCompiledCatalog(locale, messages) {
  var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var namespace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "cjs";
  var pseudoLocale = arguments[4];

  var _locale$split = locale.split(/[_-]/),
      _locale$split2 = (0, _slicedToArray3.default)(_locale$split, 1),
      language = _locale$split2[0];

  var pluralRules = _makePlural2.default[language];

  var compiledMessages = _ramda2.default.keys(messages).map(function (key) {
    var translation = messages[key] || (!strict ? key : "");
    if (locale === pseudoLocale) {
      translation = (0, _pseudoLocalize2.default)(translation);
    }
    return t.objectProperty(t.stringLiteral(key), compile(translation));
  });

  var languageData = [t.objectProperty(t.stringLiteral("plurals"), (0, _babylon.parseExpression)(pluralRules.toString()))];

  var ast = buildExportStatement(t.objectExpression([
  // language data
  t.objectProperty(t.identifier("languageData"), t.objectExpression(languageData)),
  // messages
  t.objectProperty(t.identifier("messages"), t.objectExpression(compiledMessages))]), namespace);

  return "/* eslint-disable */" + (0, _babelGenerator2.default)(ast, {
    minified: true
  }).code;
}