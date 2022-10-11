import createSlots from '../utils/create-slots.js';

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

export { Slot, Slots, TEXT_ROW_HEIGHT, getVariantStyles };
