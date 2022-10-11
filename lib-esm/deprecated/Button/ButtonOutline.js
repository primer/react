import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';
import ButtonBase from './ButtonBase.js';

const ButtonOutline = styled(ButtonBase).withConfig({
  displayName: "ButtonOutline",
  componentId: "sc-1o2yyuc-0"
})(["color:", ";border:1px solid ", ";background-color:", ";box-shadow:", ";&:hover{color:", ";background-color:", ";border-color:", ";box-shadow:", ";}&:focus{border-color:", ";box-shadow:", ";}&:active{color:", ";background-color:", ";box-shadow:", ";border-color:", ";}&:disabled{color:", ";background-color:", ";border-color:", ";}", ";"], get('colors.btn.outline.text'), get('colors.btn.border'), get('colors.btn.bg'), get('shadows.btn.shadow'), get('colors.btn.outline.hoverText'), get('colors.btn.outline.hoverBg'), get('colors.btn.outline.hoverBorder'), get('shadows.btn.outline.hoverShadow'), get('colors.btn.outline.focusBorder'), get('shadows.btn.outline.focusShadow'), get('colors.btn.outline.selectedText'), get('colors.btn.outline.selectedBg'), get('shadows.btn.outline.selectedShadow'), get('colors.btn.outline.selectedBorder'), get('colors.btn.outline.disabledText'), get('colors.btn.outline.disabledBg'), get('colors.btn.border'), sx);
var ButtonOutline$1 = ButtonOutline;

export { ButtonOutline$1 as default };
