import styled, { css } from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

const footerStyles = css(["margin-top:-1px;padding:", " ", ";font-size:", ";color:", ";text-align:center;border-top:", " solid ", ";@media (min-width:", "){padding:", " ", ";}"], get('space.2'), get('space.3'), get('fontSizes.0'), get('colors.fg.muted'), get('borderWidths.1'), get('colors.border.muted'), get('breakpoints.0'), get('space.1'), get('space.2'));
const SelectMenuFooter = styled.footer.withConfig({
  displayName: "SelectMenuFooter",
  componentId: "sc-1fomnr6-0"
})(["", " ", ";"], footerStyles, sx);
SelectMenuFooter.displayName = 'SelectMenu.Footer';
var SelectMenuFooter$1 = SelectMenuFooter;

export { SelectMenuFooter$1 as default };
