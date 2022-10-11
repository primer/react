'use strict';

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('../constants.js');
var sx = require('../sx.js');
var TokenBase = require('./TokenBase.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const variants = styledSystem.variant({
  prop: 'size',
  variants: {
    small: {
      height: TokenBase.tokenSizes.small,
      width: TokenBase.tokenSizes.small
    },
    medium: {
      height: TokenBase.tokenSizes.medium,
      width: TokenBase.tokenSizes.medium
    },
    large: {
      height: TokenBase.tokenSizes.large,
      width: TokenBase.tokenSizes.large
    },
    extralarge: {
      height: TokenBase.tokenSizes.extralarge,
      width: TokenBase.tokenSizes.extralarge
    },
    // xlarge will eventually replace "extralarge" per this ADR: https://github.com/github/primer/blob/main/adrs/2022-02-09-size-naming-guidelines.md
    xlarge: {
      height: TokenBase.tokenSizes.xlarge,
      width: TokenBase.tokenSizes.xlarge
    }
  }
});

const getTokenButtonIconSize = size => parseInt(TokenBase.tokenSizes[size || TokenBase.defaultTokenSize], 10) * 0.75;

const StyledTokenButton = styled__default["default"].span.withConfig({
  displayName: "_RemoveTokenButton__StyledTokenButton",
  componentId: "sc-urhpr1-0"
})(["background-color:transparent;font-family:inherit;color:currentColor;cursor:pointer;display:inline-flex;justify-content:center;align-items:center;user-select:none;appearance:none;text-decoration:none;padding:0;transform:", ";align-self:baseline;border:0;border-radius:999px;", " &:hover,&:focus{background-color:", ";}&:active{background-color:", ";}", " ", ""], props => `translate(${props.borderOffset}px, -${props.borderOffset}px)`, props => {
  switch (props.size) {
    case 'large':
    case 'extralarge':
    case 'xlarge':
      return styled.css(["margin-left:", ";"], constants.get('space.2'));

    default:
      return styled.css(["margin-left:", ";"], constants.get('space.1'));
  }
}, constants.get('colors.neutral.muted'), constants.get('colors.neutral.subtle'), variants, sx["default"]);

const RemoveTokenButton = ({
  'aria-label': ariaLabel,
  isParentInteractive,
  size,
  ...rest
}) => {
  delete rest.children;
  return /*#__PURE__*/React__default["default"].createElement(StyledTokenButton, _extends({
    as: isParentInteractive ? 'span' : 'button',
    tabIndex: isParentInteractive ? -1 : undefined,
    "aria-label": !isParentInteractive ? 'Remove token' : ariaLabel,
    size: size
  }, rest), /*#__PURE__*/React__default["default"].createElement(octiconsReact.XIcon, {
    size: getTokenButtonIconSize(size)
  }));
};

RemoveTokenButton.displayName = "RemoveTokenButton";
RemoveTokenButton.defaultProps = {
  size: TokenBase.defaultTokenSize
};
var RemoveTokenButton$1 = RemoveTokenButton;

module.exports = RemoveTokenButton$1;
