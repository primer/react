'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('../constants.js');
var sx = require('../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/** @deprecated 'extralarge' to be removed to align with size naming ADR https://github.com/github/primer/blob/main/adrs/2022-02-09-size-naming-guidelines.md **/

const xlargeSize = '32px';
const tokenSizes = {
  small: '16px',
  medium: '20px',
  large: '24px',
  extralarge: xlargeSize,
  xlarge: xlargeSize
};
const defaultTokenSize = 'medium';
const isTokenInteractive = ({
  as = 'span',
  onClick,
  onFocus,
  tabIndex = -1
}) => Boolean(onFocus || onClick || tabIndex > -1 || ['a', 'button'].includes(as));
const xlargeVariantStyles = {
  fontSize: 1,
  height: tokenSizes.xlarge,
  lineHeight: tokenSizes.xlarge,
  paddingLeft: 3,
  paddingRight: 3,
  paddingTop: 0,
  paddingBottom: 0
};
const variants = styledSystem.variant({
  prop: 'size',
  variants: {
    small: {
      fontSize: 0,
      height: tokenSizes.small,
      // without setting lineHeight to match height, the "x" appears vertically mis-aligned
      lineHeight: tokenSizes.small,
      paddingLeft: 1,
      paddingRight: 1,
      // need to explicitly set padding top and bottom to "0" to override default `<button>` element styles
      // without setting these, the "x" appears vertically mis-aligned
      paddingTop: 0,
      paddingBottom: 0
    },
    medium: {
      fontSize: 0,
      height: tokenSizes.medium,
      lineHeight: tokenSizes.medium,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 0,
      paddingBottom: 0
    },
    large: {
      fontSize: 0,
      height: tokenSizes.large,
      lineHeight: tokenSizes.large,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 0,
      paddingBottom: 0
    },
    extralarge: xlargeVariantStyles,
    xlarge: xlargeVariantStyles
  }
});
const StyledTokenBase = styled__default["default"].span.withConfig({
  displayName: "TokenBase__StyledTokenBase",
  componentId: "sc-1ju9l7y-0"
})(["align-items:center;border-radius:999px;cursor:", ";display:inline-flex;font-weight:", ";font-family:inherit;text-decoration:none;position:relative;white-space:nowrap;", " ", ""], props => isTokenInteractive(props) ? 'pointer' : 'auto', constants.get('fontWeights.bold'), variants, sx["default"]);
const TokenBase = /*#__PURE__*/React__default["default"].forwardRef(({
  text,
  onRemove,
  onKeyDown,
  id,
  ...rest
}, forwardedRef) => {
  return /*#__PURE__*/React__default["default"].createElement(StyledTokenBase, _extends({
    onKeyDown: event => {
      onKeyDown && onKeyDown(event);

      if ((event.key === 'Backspace' || event.key === 'Delete') && onRemove) {
        onRemove();
      }
    },
    "aria-label": onRemove ? `${text}, press backspace or delete to remove` : undefined,
    id: id === null || id === void 0 ? void 0 : id.toString()
  }, rest, {
    ref: forwardedRef
  }));
});
TokenBase.defaultProps = {
  as: 'span',
  size: defaultTokenSize
};
var TokenBase$1 = TokenBase;

exports["default"] = TokenBase$1;
exports.defaultTokenSize = defaultTokenSize;
exports.isTokenInteractive = isTokenInteractive;
exports.tokenSizes = tokenSizes;
