import styled from 'styled-components';
import { TYPOGRAPHY, COMMON } from './constants.js';
import sx from './sx.js';

const Text = styled.span.withConfig({
  displayName: "Text",
  componentId: "sc-125xb1i-0"
})(["", ";", ";", ";"], TYPOGRAPHY, COMMON, sx);

export { Text as default };
