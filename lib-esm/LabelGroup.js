import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const LabelGroup = styled.span.withConfig({
  displayName: "LabelGroup",
  componentId: "sc-1a0k7wh-0"
})(["& *{margin-right:", ";}& *:last-child{margin-right:0;}", ";"], get('space.1'), sx);
var LabelGroup$1 = LabelGroup;

export { LabelGroup$1 as default };
