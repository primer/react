'use strict';

var require$$0 = require('lodash.isempty');
var require$$1 = require('lodash.isobject');
var require$$2 = require('chroma-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);

// Utility functions used in theme-preval.js
// This file needs to be a JavaScript file using CommonJS to be compatible with preval
const isEmpty = require$$0__default["default"];

const isObject = require$$1__default["default"];

const chroma = require$$2__default["default"];

function fontStack(fonts) {
  return fonts.map(font => font.includes(' ') ? `"${font}"` : font).join(', ');
} // The following functions are a temporary measure for splitting shadow values out from the colors object.
// Eventually, we will push these structural changes upstream to primer/primitives so this data manipulation
// will not be needed.


function isShadowValue(value) {
  return typeof value === 'string' && /(inset\s|)([0-9.]+(\w*)\s){1,4}(rgb[a]?\(.*\)|\w+)/.test(value);
}

function isColorValue(value) {
  return chroma.valid(value);
}

function filterObject(obj, predicate) {
  if (Array.isArray(obj)) {
    return obj.filter(predicate);
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (isObject(value)) {
      const result = filterObject(value, predicate); // Don't include empty objects or arrays

      if (!isEmpty(result)) {
        acc[key] = result;
      }
    } else if (predicate(value)) {
      acc[key] = value;
    }

    return acc;
  }, {});
}

function partitionColors(colors) {
  return {
    colors: filterObject(colors, value => isColorValue(value)),
    shadows: filterObject(colors, value => isShadowValue(value))
  };
}

function omitScale(obj) {
  const {
    scale,
    ...rest
  } = obj;
  return rest;
}

var theme = {
  fontStack,
  isShadowValue,
  isColorValue,
  filterObject,
  partitionColors,
  omitScale
};

module.exports = theme;
