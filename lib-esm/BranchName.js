import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const BranchName = styled.a.withConfig({
  displayName: "BranchName",
  componentId: "sc-lduqme-0"
})(["display:inline-block;padding:2px 6px;font-size:", ";font-family:", ";color:", ";background-color:", ";border-radius:", ";text-decoration:none;", ";"], get('fontSizes.0'), get('fonts.mono'), get('colors.accent.fg'), get('colors.accent.subtle'), get('radii.2'), sx);
var BranchName$1 = BranchName;

export { BranchName$1 as default };
