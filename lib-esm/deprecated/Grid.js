import styled from 'styled-components';
import Box from '../Box.js';

/**
 * @deprecated Use the Box component instead (i.e. <Grid> → <Box display="grid">)
 */
const Grid = styled(Box).withConfig({
  displayName: "Grid",
  componentId: "sc-166tpao-0"
})([""]);
Grid.defaultProps = {
  display: 'grid'
};
var Grid$1 = Grid;

export { Grid$1 as default };
