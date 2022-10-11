import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const Heading = styled.h2.withConfig({
  displayName: "Heading",
  componentId: "sc-1irtotl-0"
})(["font-weight:", ";font-size:", ";margin:0;", ";"], get('fontWeights.bold'), get('fontSizes.5'), sx);
var Heading$1 = Heading;

export { Heading$1 as default };
