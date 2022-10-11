import styled from 'styled-components';
import sx from '../sx.js';
import getGlobalFocusStyles from '../_getGlobalFocusStyles.js';

const StyledButton = styled.button.withConfig({
  displayName: "types__StyledButton",
  componentId: "sc-ws60qy-0"
})(["", ";", ";"], getGlobalFocusStyles('-2px'), sx);

export { StyledButton };
