'use strict';

var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('../constants.js');
var sx = require('../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const outlineStyles = styled.css(["margin-top:-1px;margin-bottom:-1px;color:", ";border:", " solid ", ";box-shadow:none;", ";background-color:transparent;"], constants.get('colors.fg.muted'), constants.get('borderWidths.1'), constants.get('colors.border.default'), styledSystem.borderColor);
const sizeVariant = styledSystem.variant({
  variants: {
    small: {
      fontSize: 0,
      lineHeight: '16px',
      padding: '0px 8px'
    },
    medium: {
      fontSize: 0,
      lineHeight: '20px',
      padding: '0 8px'
    },
    large: {
      fontSize: 0,
      lineHeight: '24px',
      padding: '0 12px'
    },
    // corresponds to StateLabel fontSize/lineHeight/padding
    xl: {
      fontSize: 1,
      lineHeight: '16px',
      padding: '8px 12px'
    }
  }
});
/** @deprecated Use the new Label instead. See https://primer.style/react/Label for more details. */

const Label = styled__default["default"].span.withConfig({
  displayName: "Label",
  componentId: "sc-q8qkkr-0"
})(["display:inline-block;font-weight:", ";color:", ";border-radius:", ";background-color:", ";&:hover{text-decoration:none;}", " ", " ", "  ", ""], constants.get('fontWeights.semibold'), constants.get('colors.fg.onEmphasis'), constants.get('radii.3'), constants.get('colors.neutral.emphasis'), sizeVariant, props => props.dropshadow ? 'box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12)' : '', props => props.outline ? outlineStyles : '', sx["default"]);
Label.defaultProps = {
  variant: 'medium'
};
Label.displayName = 'Label';
var Label$1 = Label;

module.exports = Label$1;
