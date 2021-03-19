"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.filterObject = exports.isColorValue = exports.isShadowValue = exports.fontStack = void 0;
var lodash_isempty_1 = __importDefault(require("lodash.isempty"));
var lodash_isobject_1 = __importDefault(require("lodash.isobject"));
var chroma_js_1 = __importDefault(require("chroma-js"));
function fontStack(fonts) {
    return fonts.map(function (font) { return (font.includes(' ') ? "\"" + font + "\"" : font); }).join(', ');
}
exports.fontStack = fontStack;
// The following functions are a temporary measure for splitting shadow values out from the colors object.
// Eventually, we will push these structural changes upstream to primer/primitives so this data manipulation
// will not be needed.
function isShadowValue(value) {
    return typeof value === 'string' && /(inset\s|)([0-9.empx\s]+){1,4}rgb[a]?\(.*\)/.test(value);
}
exports.isShadowValue = isShadowValue;
function isColorValue(value) {
    return chroma_js_1["default"].valid(value);
}
exports.isColorValue = isColorValue;
function filterObject(obj, predicate) {
    return Object.entries(obj).reduce(function (acc, _a) {
        var _b;
        var key = _a[0], value = _a[1];
        // Filter arrays
        if (value instanceof Array) {
            value = value.filter(predicate);
            // Filter (nested) objects
        }
        else if (lodash_isobject_1["default"](value)) {
            value = filterObject(value, predicate);
            // Filter primitive values
        }
        else if (!predicate(value)) {
            value = undefined;
        }
        // Retain any values that were not filtered out
        return __assign(__assign({}, acc), (!lodash_isempty_1["default"](value) && (_b = {}, _b[key] = value, _b)));
    }, {});
}
exports.filterObject = filterObject;
