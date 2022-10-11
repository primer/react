import styled from 'styled-components';
import { get } from './constants.js';
import StyledOcticon from './StyledOcticon.js';
import sx from './sx.js';
import isNumeric from './utils/isNumeric.js';

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128
};

const sizeStyles = ({
  size,
  variant = 'medium'
}) => {
  const calc = isNumeric(size) ? size : variantSizes[variant];
  return {
    width: calc,
    height: calc
  };
};

const CircleBadge = styled.div.withConfig({
  displayName: "CircleBadge",
  componentId: "sc-1ej09kx-0"
})(["display:", ";align-items:center;justify-content:center;background-color:", ";border-radius:50%;box-shadow:", ";", ";", ";"], props => props.inline ? 'inline-flex' : 'flex', get('colors.canvas.default'), get('shadows.shadow.medium'), sizeStyles, sx);
const CircleBadgeIcon = styled(StyledOcticon).withConfig({
  displayName: "CircleBadge__CircleBadgeIcon",
  componentId: "sc-1ej09kx-1"
})(["height:auto;max-width:60%;max-height:55%;"]);
CircleBadge.defaultProps = {
  inline: false
};
CircleBadgeIcon.displayName = 'CircleBadge.Icon';
var CircleBadge$1 = Object.assign(CircleBadge, {
  Icon: CircleBadgeIcon
});

export { CircleBadge$1 as default };
