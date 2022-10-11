import React from 'react';
import Box from '../Box.js';
import '../sx.js';
import { get } from '../constants.js';
import { Slot, getVariantStyles, TEXT_ROW_HEIGHT } from './shared.js';
import merge from 'deepmerge';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const LeadingVisualContainer = ({
  sx = {},
  ...props
}) => {
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: "span",
    sx: merge({
      height: TEXT_ROW_HEIGHT,
      // match height of text row
      minWidth: get('space.3'),
      maxWidth: TEXT_ROW_HEIGHT,
      // square (same as height)
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      marginRight: 2
    }, sx)
  }, props));
};
LeadingVisualContainer.displayName = "LeadingVisualContainer";
const LeadingVisual = ({
  sx = {},
  ...props
}) => {
  return /*#__PURE__*/React.createElement(Slot, {
    name: "LeadingVisual"
  }, ({
    variant,
    disabled
  }) => /*#__PURE__*/React.createElement(LeadingVisualContainer, _extends({
    sx: merge({
      color: getVariantStyles(variant, disabled).iconColor,
      svg: {
        fontSize: 0
      }
    }, sx)
  }, props), props.children));
};
LeadingVisual.displayName = "LeadingVisual";
const TrailingVisual = ({
  sx = {},
  ...props
}) => {
  return /*#__PURE__*/React.createElement(Slot, {
    name: "TrailingVisual"
  }, ({
    variant,
    disabled
  }) => /*#__PURE__*/React.createElement(Box, _extends({
    as: "span",
    sx: merge({
      height: '20px',
      // match height of text row
      flexShrink: 0,
      color: getVariantStyles(variant, disabled).annotationColor,
      marginLeft: 2,
      fontWeight: 'initial'
    }, sx)
  }, props), props.children));
};
TrailingVisual.displayName = "TrailingVisual";

export { LeadingVisual, LeadingVisualContainer, TrailingVisual };
