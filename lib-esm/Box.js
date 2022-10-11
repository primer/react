import styled from 'styled-components';
import { space, color, typography, layout, flexbox, grid, background, border, position, shadow } from 'styled-system';
import sx from './sx.js';

const Box = styled.div.withConfig({
  displayName: "Box",
  componentId: "sc-1gh2r6s-0"
})(space, color, typography, layout, flexbox, grid, background, border, position, shadow, sx);

export { Box as default };
