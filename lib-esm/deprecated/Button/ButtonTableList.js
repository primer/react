import styled from 'styled-components';
import { get } from '../../constants.js';
import sx from '../../sx.js';

const ButtonTableList = styled.summary.withConfig({
  displayName: "ButtonTableList",
  componentId: "sc-xbr2xd-0"
})(["display:inline-block;padding:0;font-size:", ";color:", ";text-decoration:none;white-space:nowrap;cursor:pointer;user-select:none;background-color:transparent;border:0;appearance:none;&:hover{text-decoration:underline;}&:disabled{&,&:hover{color:", ";cursor:default;}}&:after{display:inline-block;margin-left:", ";width:0;height:0;vertical-align:-2px;content:'';border:4px solid transparent;border-top-color:currentcolor;}", ";"], get('fontSizes.1'), get('colors.fg.muted'), get('colors.primer.fg.disabled'), get('space.1'), sx);
var ButtonTableList$1 = ButtonTableList;

export { ButtonTableList$1 as default };
