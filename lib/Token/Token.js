'use strict';

var React = require('react');
var Box = require('../Box.js');
require('@styled-system/css');
var merge = require('deepmerge');
var TokenBase = require('./TokenBase.js');
var _RemoveTokenButton = require('./_RemoveTokenButton.js');
var _TokenTextContainer = require('./_TokenTextContainer.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const tokenBorderWidthPx = 1;

const LeadingVisualContainer = ({
  children,
  size
}) => /*#__PURE__*/React__default["default"].createElement(Box, {
  sx: {
    flexShrink: 0,
    lineHeight: 0,
    marginRight: size && ['large', 'extralarge', 'xlarge'].includes(size) ? 2 : 1
  }
}, children);

LeadingVisualContainer.displayName = "LeadingVisualContainer";
const Token = /*#__PURE__*/React.forwardRef((props, forwardedRef) => {
  const {
    as,
    onRemove,
    id,
    leadingVisual: LeadingVisual,
    text,
    size,
    hideRemoveButton,
    href,
    onClick,
    sx: sxProp = {},
    ...rest
  } = props;
  const hasMultipleActionTargets = TokenBase.isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton;

  const onRemoveClick = e => {
    e.stopPropagation();
    onRemove && onRemove();
  };

  const interactiveTokenProps = {
    as,
    href,
    onClick
  };
  const sx = merge__default["default"]({
    backgroundColor: 'neutral.subtle',
    borderColor: props.isSelected ? 'fg.default' : 'border.subtle',
    borderStyle: 'solid',
    borderWidth: `${tokenBorderWidthPx}px`,
    color: props.isSelected ? 'fg.default' : 'fg.muted',
    maxWidth: '100%',
    paddingRight: !(hideRemoveButton || !onRemove) ? 0 : undefined,
    ...(TokenBase.isTokenInteractive(props) ? {
      '&:hover': {
        backgroundColor: 'neutral.muted',
        boxShadow: 'shadow.medium',
        color: 'fg.default'
      }
    } : {})
  }, sxProp);
  return /*#__PURE__*/React__default["default"].createElement(TokenBase["default"], _extends({
    onRemove: onRemove,
    id: id === null || id === void 0 ? void 0 : id.toString(),
    text: text,
    size: size,
    sx: sx
  }, !hasMultipleActionTargets ? interactiveTokenProps : {}, rest, {
    ref: forwardedRef
  }), LeadingVisual ? /*#__PURE__*/React__default["default"].createElement(LeadingVisualContainer, {
    size: size
  }, /*#__PURE__*/React__default["default"].createElement(LeadingVisual, null)) : null, /*#__PURE__*/React__default["default"].createElement(_TokenTextContainer, hasMultipleActionTargets ? interactiveTokenProps : {}, text), !hideRemoveButton && onRemove ? /*#__PURE__*/React__default["default"].createElement(_RemoveTokenButton, {
    borderOffset: tokenBorderWidthPx,
    onClick: onRemoveClick,
    size: size,
    isParentInteractive: TokenBase.isTokenInteractive(props),
    "aria-hidden": hasMultipleActionTargets ? 'true' : 'false',
    sx: hasMultipleActionTargets ? {
      position: 'relative',
      zIndex: '1'
    } : {}
  }) : null);
});
Token.displayName = 'Token';
Token.defaultProps = {
  size: TokenBase.defaultTokenSize
};
var Token$1 = Token;

module.exports = Token$1;
