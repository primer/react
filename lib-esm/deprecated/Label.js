import styled, { css } from 'styled-components';
import { borderColor, variant } from 'styled-system';
import { get } from '../constants.js';
import sx from '../sx.js';

const outlineStyles = css(["margin-top:-1px;margin-bottom:-1px;color:", ";border:", " solid ", ";box-shadow:none;", ";background-color:transparent;"], get('colors.fg.muted'), get('borderWidths.1'), get('colors.border.default'), borderColor);
const sizeVariant = variant({
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

const Label = styled.span.withConfig({
  displayName: "Label",
  componentId: "sc-q8qkkr-0"
})(["display:inline-block;font-weight:", ";color:", ";border-radius:", ";background-color:", ";&:hover{text-decoration:none;}", " ", " ", "  ", ""], get('fontWeights.semibold'), get('colors.fg.onEmphasis'), get('radii.3'), get('colors.neutral.emphasis'), sizeVariant, props => props.dropshadow ? 'box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12)' : '', props => props.outline ? outlineStyles : '', sx);
Label.defaultProps = {
  variant: 'medium'
};
Label.displayName = 'Label';
var Label$1 = Label;

export { Label$1 as default };
