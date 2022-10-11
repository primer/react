'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styled = require('styled-components');
var constants = require('../constants.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const loading = styled.keyframes(["from{opacity:0.4;}to{opacity:0.8;}"]);
const LoadingCounter = styled__default["default"].span.withConfig({
  displayName: "LoadingCounter",
  componentId: "sc-ouonic-0"
})(["animation:", " 1.2s linear infinite alternate;background-color:", ";border-color:", ";width:1.5rem;height:1rem;display:inline-block;border-radius:20px;"], loading, constants.get('colors.neutral.emphasis'), constants.get('colors.border.default'));

exports.LoadingCounter = LoadingCounter;
