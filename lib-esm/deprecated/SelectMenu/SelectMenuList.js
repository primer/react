import styled, { css } from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

const listStyles = css(["position:relative;padding:0;margin:0;flex:auto;overflow-x:hidden;overflow-y:auto;background-color:", ";-webkit-overflow-scrolling:touch;@media (hover:hover){.SelectMenuTab:focus{background-color:", ";}.SelectMenuTab:not([aria-checked='true']):hover{color:", ";background-color:", ";}.SelectMenuTab:not([aria-checked='true']):active{color:", ";background-color:", ";}}"], get('colors.canvas.overlay'), get('colors.selectMenu.tapFocusBg'), get('colors.fg.default'), get('colors.canvas.subtle'), get('colors.fg.default'), get('colors.canvas.subtle'));
const SelectMenuList = styled.div.withConfig({
  displayName: "SelectMenuList",
  componentId: "sc-lbozs8-0"
})(["", " ", ";"], listStyles, sx);
SelectMenuList.displayName = 'SelectMenu.List';
var SelectMenuList$1 = SelectMenuList;

export { SelectMenuList$1 as default };
