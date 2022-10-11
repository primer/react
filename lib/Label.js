'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styled = require('styled-components');
var styledSystem = require('styled-system');
var sx = require('./sx.js');
var constants = require('./constants.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const variants = {
  default: {
    borderColor: 'border.default'
  },
  primary: {
    borderColor: 'fg.default'
  },
  secondary: {
    borderColor: 'border.muted',
    color: 'fg.muted'
  },
  accent: {
    borderColor: 'accent.emphasis',
    color: 'accent.fg'
  },
  success: {
    borderColor: 'success.emphasis',
    color: 'success.fg'
  },
  attention: {
    borderColor: 'attention.emphasis',
    color: 'attention.fg'
  },
  severe: {
    borderColor: 'severe.emphasis',
    color: 'severe.fg'
  },
  danger: {
    borderColor: 'danger.emphasis',
    color: 'danger.fg'
  },
  done: {
    borderColor: 'done.fg',
    color: 'done.emphasis'
  },
  sponsors: {
    borderColor: 'sponsors.fg',
    color: 'sponsors.emphasis'
  }
};
const sizes = {
  small: {
    height: '20px',
    padding: '0 7px' // hard-coded to align with Primer ViewComponents and Primer CSS

  },
  large: {
    height: '24px',
    padding: '0 10px' // hard-coded to align with Primer ViewComponents and Primer CSS

  }
};
const Label = styled__default["default"].span.withConfig({
  displayName: "Label",
  componentId: "sc-6dyj7v-0"
})(["align-items:center;background-color:transparent;border-width:1px;border-radius:999px;border-style:solid;display:inline-flex;font-weight:", ";font-size:", ";line-height:1;white-space:nowrap;", ";", ";", ";"], constants.get('fontWeights.bold'), constants.get('fontSizes.0'), styledSystem.variant({
  variants
}), styledSystem.variant({
  prop: 'size',
  variants: sizes
}), sx["default"]);
Label.defaultProps = {
  size: 'small',
  variant: 'default'
};

exports["default"] = Label;
exports.variants = variants;
