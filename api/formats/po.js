"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _ramda = require("ramda");

var R = _interopRequireWildcard(_ramda);

var _dateFns = require("date-fns");

var _pofile = require("pofile");

var _pofile2 = _interopRequireDefault(_pofile);

var _utils = require("../utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getCreateHeaders = function getCreateHeaders() {
  var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "no";
  return {
    "POT-Creation-Date": (0, _dateFns.format)(new Date(), "YYYY-MM-DD HH:mmZZ"),
    "Mime-Version": "1.0",
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Transfer-Encoding": "8bit",
    "X-Generator": "@lingui/cli",
    Language: language
  };
};


var serialize = R.compose(R.values, R.mapObjIndexed(function (message, key) {
  var item = new _pofile2.default.Item();
  item.msgid = key;
  item.msgstr = message.translation;
  item.comments = message.comments || [];
  item.extractedComments = message.description ? [message.description] : [];
  item.references = message.origin ? message.origin.map(_utils.joinOrigin) : [];
  item.obsolete = message.obsolete;
  item.flags = message.flags ? R.fromPairs(message.flags.map(function (flag) {
    return [flag, true];
  })) : {};
  return item;
}));

var getMessageKey = R.prop("msgid");
var getTranslations = R.prop("msgstr");
var getExtractedComments = R.prop("extractedComments");
var getTranslatorComments = R.prop("comments");
var getOrigins = R.prop("references");
var getFlags = R.compose(R.map(R.trim), R.keys, R.dissoc("obsolete"), // backward-compatibility, remove in 3.x
R.prop("flags"));
var isObsolete = R.either(R.path(["flags", "obsolete"]), R.prop("obsolete"));

var deserialize = R.map(R.applySpec({
  translation: R.compose(R.head, R.defaultTo([]), getTranslations),
  description: R.compose(R.head, R.defaultTo([]), getExtractedComments),
  comments: function comments(item) {
    return R.concat(getTranslatorComments(item), R.tail(getExtractedComments(item)));
  },
  obsolete: isObsolete,
  origin: R.compose(R.map(_utils.splitOrigin), R.defaultTo([]), getOrigins),
  flags: getFlags
}));

var validateItems = R.map(function (item) {
  if (R.length(getTranslations(item)) > 1) {
    console.warn("Multiple translations for item with key %s is not supported and it will be ignored.", getMessageKey(item));
  }
});

var indexItems = R.indexBy(getMessageKey);

var format = {
  filename: "messages.po",

  write: function write(filename, catalog) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var po = void 0;
    var indexedItems = {};
    if (_fs2.default.existsSync(filename)) {
      var raw = _fs2.default.readFileSync(filename).toString();
      po = _pofile2.default.parse(raw);
    } else {
      po = new _pofile2.default();
      po.headers = getCreateHeaders(options.language);
      po.headerOrder = R.keys(po.headers);
    }
    po.items = serialize(catalog);
    _fs2.default.writeFileSync(filename, po.toString());
  },
  read: function read(filename) {
    var raw = _fs2.default.readFileSync(filename).toString();
    return this.parse(raw);
  },
  parse: function parse(raw) {
    var po = _pofile2.default.parse(raw);
    validateItems(po.items);
    return deserialize(indexItems(po.items));
  }
};

exports.default = format;