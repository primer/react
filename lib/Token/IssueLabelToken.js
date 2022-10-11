'use strict';

var React = require('react');
var TokenBase = require('./TokenBase.js');
var _RemoveTokenButton = require('./_RemoveTokenButton.js');
var color2k = require('color2k');
var ThemeProvider = require('../ThemeProvider.js');
var _TokenTextContainer = require('./_TokenTextContainer.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const tokenBorderWidthPx = 1;
const lightModeStyles = {
  '--lightness-threshold': '0.453',
  '--border-threshold': '0.96',
  '--border-alpha': 'max(0, min(calc((var(--perceived-lightness) - var(--border-threshold)) * 100), 1))',
  background: 'rgb(var(--label-r), var(--label-g), var(--label-b))',
  color: 'hsl(0, 0%, calc(var(--lightness-switch) * 100%))',
  borderWidth: tokenBorderWidthPx,
  borderStyle: 'solid',
  borderColor: 'hsla(var(--label-h),calc(var(--label-s) * 1%),calc((var(--label-l) - 25) * 1%),var(--border-alpha))'
};
const darkModeStyles = {
  '--lightness-threshold': '0.6',
  '--background-alpha': '0.18',
  '--border-alpha': '0.3',
  '--lighten-by': 'calc(((var(--lightness-threshold) - var(--perceived-lightness)) * 100) * var(--lightness-switch))',
  borderWidth: tokenBorderWidthPx,
  borderStyle: 'solid',
  background: 'rgba(var(--label-r), var(--label-g), var(--label-b), var(--background-alpha))',
  color: 'hsl(var(--label-h), calc(var(--label-s) * 1%), calc((var(--label-l) + var(--lighten-by)) * 1%))',
  borderColor: 'hsla(var(--label-h), calc(var(--label-s) * 1%),calc((var(--label-l) + var(--lighten-by)) * 1%),var(--border-alpha))'
};
const IssueLabelToken = /*#__PURE__*/React.forwardRef((props, forwardedRef) => {
  const {
    as,
    fillColor = '#999',
    onRemove,
    id,
    isSelected,
    text,
    size,
    hideRemoveButton,
    href,
    onClick,
    ...rest
  } = props;
  const interactiveTokenProps = {
    as,
    href,
    onClick
  };
  const {
    colorScheme
  } = ThemeProvider.useTheme();
  const hasMultipleActionTargets = TokenBase.isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton;

  const onRemoveClick = e => {
    e.stopPropagation();
    onRemove && onRemove();
  };

  const labelStyles = React.useMemo(() => {
    const [r, g, b] = color2k.parseToRgba(fillColor);
    const [h, s, l] = color2k.parseToHsla(fillColor); // label hack taken from https://github.com/github/github/blob/master/app/assets/stylesheets/hacks/hx_primer-labels.scss#L43-L108
    // this logic should eventually live in primer/components. Also worthy of note is that the dotcom hack code will be moving to primer/css soon.

    return {
      '--label-r': String(r),
      '--label-g': String(g),
      '--label-b': String(b),
      '--label-h': String(Math.round(h)),
      '--label-s': String(Math.round(s * 100)),
      '--label-l': String(Math.round(l * 100)),
      '--perceived-lightness': 'calc(((var(--label-r) * 0.2126) + (var(--label-g) * 0.7152) + (var(--label-b) * 0.0722)) / 255)',
      '--lightness-switch': 'max(0, min(calc((var(--perceived-lightness) - var(--lightness-threshold)) * -1000), 1))',
      paddingRight: hideRemoveButton || !onRemove ? undefined : 0,
      position: 'relative',
      ...(colorScheme === 'light' ? lightModeStyles : darkModeStyles),
      ...(isSelected ? {
        background: colorScheme === 'light' ? 'hsl(var(--label-h), calc(var(--label-s) * 1%), calc((var(--label-l) - 5) * 1%))' : darkModeStyles.background,
        ':focus': {
          outline: 'none'
        },
        ':after': {
          content: '""',
          position: 'absolute',
          zIndex: 1,
          top: `-${tokenBorderWidthPx * 2}px`,
          right: `-${tokenBorderWidthPx * 2}px`,
          bottom: `-${tokenBorderWidthPx * 2}px`,
          left: `-${tokenBorderWidthPx * 2}px`,
          display: 'block',
          pointerEvents: 'none',
          boxShadow: `0 0 0 ${tokenBorderWidthPx * 2}px ${colorScheme === 'light' ? 'rgb(var(--label-r), var(--label-g), var(--label-b))' : 'hsl(var(--label-h), calc(var(--label-s) * 1%), calc((var(--label-l) + var(--lighten-by)) * 1%))'}`,
          borderRadius: '999px'
        }
      } : {})
    };
  }, [colorScheme, fillColor, isSelected, hideRemoveButton, onRemove]);
  return /*#__PURE__*/React__default["default"].createElement(TokenBase["default"], _extends({
    onRemove: onRemove,
    id: id === null || id === void 0 ? void 0 : id.toString(),
    isSelected: isSelected,
    text: text,
    size: size,
    sx: labelStyles
  }, !hasMultipleActionTargets ? interactiveTokenProps : {}, rest, {
    ref: forwardedRef
  }), /*#__PURE__*/React__default["default"].createElement(_TokenTextContainer, hasMultipleActionTargets ? interactiveTokenProps : {}, text), !hideRemoveButton && onRemove ? /*#__PURE__*/React__default["default"].createElement(_RemoveTokenButton, {
    borderOffset: tokenBorderWidthPx,
    onClick: onRemoveClick,
    size: size,
    "aria-hidden": hasMultipleActionTargets ? 'true' : 'false',
    isParentInteractive: TokenBase.isTokenInteractive(props),
    sx: hasMultipleActionTargets ? {
      position: 'relative',
      zIndex: '1'
    } : {}
  }) : null);
});
IssueLabelToken.defaultProps = {
  fillColor: '#999',
  size: TokenBase.defaultTokenSize
};
IssueLabelToken.displayName = 'IssueLabelToken';
var IssueLabelToken$1 = IssueLabelToken;

module.exports = IssueLabelToken$1;
