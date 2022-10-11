'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var themeGet = require('@styled-system/theme-get');
var styledSystem = require('styled-system');
var themePreval = require('./theme-preval.js');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var styledSystem__namespace = /*#__PURE__*/_interopNamespace(styledSystem);

const {
  get: getKey,
  compose,
  system
} = styledSystem__namespace;
const get = key => themeGet.themeGet(key, getKey(themePreval, key)); // Common props

const COMMON = compose(styledSystem__namespace.space, styledSystem__namespace.color, styledSystem__namespace.display);
// Typography props
const whiteSpace = system({
  whiteSpace: {
    property: 'whiteSpace' // cssProperty: 'whiteSpace',

  }
});
const TYPOGRAPHY = compose(styledSystem__namespace.typography, whiteSpace);
// Border props
const BORDER = compose(styledSystem__namespace.border, styledSystem__namespace.shadow);
// Layout props
const LAYOUT = styledSystem__namespace.layout;

exports.BORDER = BORDER;
exports.COMMON = COMMON;
exports.LAYOUT = LAYOUT;
exports.TYPOGRAPHY = TYPOGRAPHY;
exports.get = get;
