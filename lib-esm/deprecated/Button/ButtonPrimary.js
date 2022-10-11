import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';
import ButtonBase from './ButtonBase.js';

const ButtonPrimary = styled(ButtonBase).withConfig({
  displayName: "ButtonPrimary",
  componentId: "sc-1awfvt4-0"
})(["color:", ";border:1px solid ", ";background-color:", ";box-shadow:", ";&:hover{color:", ";background-color:", ";border-color:", ";box-shadow:", ";}&:focus{border-color:", ";box-shadow:", ";}&:active{background-color:", ";box-shadow:", ";}&:disabled{color:", ";background-color:", ";border-color:", ";}", ";"], get('colors.btn.primary.text'), get('colors.btn.primary.border'), get('colors.btn.primary.bg'), get('shadows.btn.primary.shadow'), get('colors.btn.primary.hoverText'), get('colors.btn.primary.hoverBg'), get('colors.btn.primary.hoverBorder'), get('shadows.btn.primary.hoverShadow'), get('colors.btn.primary.focusBorder'), get('shadows.btn.primary.focusShadow'), get('colors.btn.primary.selectedBg'), get('shadows.btn.primary.selectedShadow'), get('colors.btn.primary.disabledText'), get('colors.btn.primary.disabledBg'), get('colors.btn.primary.disabledBorder'), sx);
var ButtonPrimary$1 = ButtonPrimary;

export { ButtonPrimary, ButtonPrimary$1 as default };
