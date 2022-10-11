import styled, { css } from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

const dividerStyles = css(["padding:", " ", ";margin:0;font-size:", ";font-weight:", ";color:", ";background-color:", ";border-bottom:", " solid ", ";"], get('space.1'), get('space.3'), get('fontSizes.0'), get('fontWeights.bold'), get('colors.fg.muted'), get('colors.canvas.subtle'), get('borderWidths.1'), get('colors.border.muted'));
const SelectMenuDivider = styled.div.withConfig({
  displayName: "SelectMenuDivider",
  componentId: "sc-qu3a18-0"
})(["", " ", ";"], dividerStyles, sx);
SelectMenuDivider.displayName = 'SelectMenu.Divider';
var SelectMenuDivider$1 = SelectMenuDivider;

export { SelectMenuDivider$1 as default };
