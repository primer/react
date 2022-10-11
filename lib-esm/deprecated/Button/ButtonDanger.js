import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';
import ButtonBase from './ButtonBase.js';

const ButtonDanger = styled(ButtonBase).withConfig({
  displayName: "ButtonDanger",
  componentId: "sc-j9bmd7-0"
})(["color:", ";border:1px solid ", ";background-color:", ";box-shadow:", ";&:hover{color:", ";background-color:", ";border-color:", ";box-shadow:", ";}&:focus{border-color:", ";box-shadow:", ";}&:active{color:", ";background-color:", ";box-shadow:", ";border-color:", ";}&:disabled{color:", ";background-color:", ";border-color:", ";}", ";"], get('colors.btn.danger.text'), get('colors.btn.border'), get('colors.btn.bg'), get('shadows.btn.shadow'), get('colors.btn.danger.hoverText'), get('colors.btn.danger.hoverBg'), get('colors.btn.danger.hoverBorder'), get('shadows.btn.danger.hoverShadow'), get('colors.btn.danger.focusBorder'), get('shadows.btn.danger.focusShadow'), get('colors.btn.danger.selectedText'), get('colors.btn.danger.selectedBg'), get('shadows.btn.danger.selectedShadow'), get('colors.btn.danger.selectedBorder'), get('colors.btn.danger.disabledText'), get('colors.btn.danger.disabledBg'), get('colors.btn.danger.disabledBorder'), sx);
var ButtonDanger$1 = ButtonDanger;

export { ButtonDanger$1 as default };
