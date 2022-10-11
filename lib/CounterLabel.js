'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const colorStyles = ({
  scheme,
  ...props
}) => {
  return {
    color: scheme === 'secondary' ? constants.get('colors.fg.default')(props) : scheme === 'primary' ? constants.get('colors.fg.onEmphasis')(props) : constants.get('colors.fg.default')(props)
  };
};

const bgStyles = ({
  scheme,
  ...props
}) => {
  return {
    backgroundColor: scheme === 'secondary' ? constants.get('colors.neutral.muted')(props) : scheme === 'primary' ? constants.get('colors.neutral.emphasis')(props) : constants.get('colors.neutral.muted')(props)
  };
};

const CounterLabel = styled__default["default"].span.withConfig({
  displayName: "CounterLabel",
  componentId: "sc-13ceqbg-0"
})(["display:inline-block;padding:2px 5px;font-size:", ";font-weight:", ";line-height:", ";border-radius:20px;", ";", ";&:empty{display:none;}", ";"], constants.get('fontSizes.0'), constants.get('fontWeights.bold'), constants.get('lineHeights.condensedUltra'), colorStyles, bgStyles, sx["default"]);
var CounterLabel$1 = CounterLabel;

module.exports = CounterLabel$1;
