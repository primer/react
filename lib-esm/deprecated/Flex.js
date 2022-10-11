import styled from 'styled-components';
import Box from '../Box.js';

/**
 * @deprecated Use the Box component instead (i.e. <Flex> → <Box display="flex">)
 */
const Flex = styled(Box).withConfig({
  displayName: "Flex",
  componentId: "sc-1vv09sz-0"
})([""]);
Flex.defaultProps = {
  display: 'flex'
};
var Flex$1 = Flex;

export { Flex$1 as default };
