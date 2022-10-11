import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';
import ButtonBase from './ButtonBase.js';

/** @deprecated Use the new Label instead. See https://primer.style/react/Button for more details. */

const Button = styled(ButtonBase).withConfig({
  displayName: "Button",
  componentId: "sc-ybpnzh-0"
})(["color:", ";background-color:", ";border:1px solid ", ";box-shadow:", ",", "};&:hover{background-color:", ";border-color:", ";}&:focus{border-color:", ";box-shadow:", ";}&:active{background-color:", ";box-shadow:", ";}&:disabled{color:", ";background-color:", ";border-color:", ";}", ";"], get('colors.btn.text'), get('colors.btn.bg'), get('colors.btn.border'), get('shadows.btn.shadow'), get('shadows.btn.insetShadow'), get('colors.btn.hoverBg'), get('colors.btn.hoverBorder'), get('colors.btn.focusBorder'), get('shadows.btn.focusShadow'), get('colors.btn.selectedBg'), get('shadows.btn.shadowActive'), get('colors.primer.fg.disabled'), get('colors.btn.bg'), get('colors.btn.border'), sx);
var Button$1 = Button;

export { Button$1 as default };
