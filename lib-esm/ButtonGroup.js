import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const ButtonGroup = styled.div.withConfig({
  displayName: "ButtonGroup",
  componentId: "sc-tk435v-0"
})(["display:inline-flex;vertical-align:middle;&& > *{position:relative;border-right-width:0;border-radius:0;:first-child{border-top-left-radius:", ";border-bottom-left-radius:", ";margin-right:0;}:not(:first-child){margin-left:0;margin-right:0;}:last-child{border-right-width:1px;border-top-right-radius:", ";border-bottom-right-radius:", ";}:focus,:active,:hover{border-right-width:1px;+ *{border-left-width:0;}}:focus,:active{z-index:1;}}", ";"], get('radii.2'), get('radii.2'), get('radii.2'), get('radii.2'), sx);
var ButtonGroup$1 = ButtonGroup;

export { ButtonGroup$1 as default };
