import styled from 'styled-components';
import { variant } from 'styled-system';
import buttonBaseStyles from './ButtonStyles.js';

const variants = variant({
  variants: {
    small: {
      p: '4px 12px',
      fontSize: 0
    },
    medium: {
      fontSize: 1
    },
    large: {
      fontSize: 2,
      p: '10px 20px'
    }
  }
});
const ButtonBase = styled.button.attrs(({
  disabled,
  onClick
}) => ({
  onClick: disabled ? undefined : onClick
})).withConfig({
  displayName: "ButtonBase",
  componentId: "sc-bqtwic-0"
})(["", " ", ""], buttonBaseStyles, variants);
ButtonBase.defaultProps = {
  variant: 'medium'
};
var ButtonBase$1 = ButtonBase;

export { ButtonBase$1 as default };
