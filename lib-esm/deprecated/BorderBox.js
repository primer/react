import styled from 'styled-components';
import Box from '../Box.js';

/**
 * @deprecated Use the Box component instead (i.e. <BorderBox> → <Box borderWidth='1px' borderStyle='solid' borderColor='border.primary' borderRadius={2}>)
 */
const BorderBox = styled(Box).withConfig({
  displayName: "BorderBox",
  componentId: "sc-129byhp-0"
})([""]);
BorderBox.defaultProps = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.default',
  borderRadius: 2
};
var BorderBox$1 = BorderBox;

export { BorderBox$1 as default };
