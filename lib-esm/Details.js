import styled from 'styled-components';
import sx from './sx.js';

const Details = styled.details.withConfig({
  displayName: "Details",
  componentId: "sc-1qhvasm-0"
})(["& > summary{list-style:none;}& > summary::-webkit-details-marker{display:none;}", ";"], sx);
Details.displayName = 'Details';

export { Details as default };
