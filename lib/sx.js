'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var css = require('@styled-system/css');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var css__default = /*#__PURE__*/_interopDefaultLegacy(css);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

const sx = props => css__default["default"](props.sx);

var sx$1 = sx;

Object.defineProperty(exports, 'merge', {
  enumerable: true,
  get: function () { return merge__default["default"]; }
});
exports["default"] = sx$1;
