import styled from 'styled-components';
import { system } from 'styled-system';
import { get } from './constants.js';
import sx from './sx.js';

const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors'
  }
});
const Link = styled.a.withConfig({
  displayName: "Link",
  componentId: "sc-hrxz1n-0"
})(["color:", ";text-decoration:", ";&:hover{text-decoration:", ";", ";}&:is(button){display:inline-block;padding:0;font-size:inherit;white-space:nowrap;cursor:pointer;user-select:none;background-color:transparent;border:0;appearance:none;}", ";"], props => props.muted ? get('colors.fg.muted')(props) : get('colors.accent.fg')(props), props => props.underline ? 'underline' : 'none', props => props.muted ? 'none' : 'underline', props => props.hoverColor ? hoverColor : props.muted ? `color: ${get('colors.accent.fg')(props)}` : '', sx);
var Link$1 = Link;

export { Link$1 as default };
