'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createSlots = require('../utils/create-slots.js');

const getVariantStyles = (variant, disabled) => {
  if (disabled) {
    return {
      color: 'primer.fg.disabled',
      iconColor: 'primer.fg.disabled',
      annotationColor: 'primer.fg.disabled'
    };
  }

  switch (variant) {
    case 'danger':
      return {
        color: 'danger.fg',
        iconColor: 'danger.fg',
        annotationColor: 'fg.muted',
        hoverColor: 'actionListItem.danger.hoverText'
      };

    default:
      return {
        color: 'fg.default',
        iconColor: 'fg.muted',
        annotationColor: 'fg.muted',
        hoverColor: 'fg.default'
      };
  }
};
const {
  Slots,
  Slot
} = createSlots(['LeadingVisual', 'InlineDescription', 'BlockDescription', 'TrailingVisual']);
const TEXT_ROW_HEIGHT = '20px'; // custom value off the scale

exports.Slot = Slot;
exports.Slots = Slots;
exports.TEXT_ROW_HEIGHT = TEXT_ROW_HEIGHT;
exports.getVariantStyles = getVariantStyles;
