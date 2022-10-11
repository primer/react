import classnames from 'classnames';
import styled from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const Popover = styled.div.attrs(({
  className,
  caret
}) => {
  return {
    className: classnames(className, `caret-pos--${caret}`)
  };
}).withConfig({
  displayName: "Popover",
  componentId: "sc-7jji3e-0"
})(["position:", ";z-index:100;display:", ";", ";"], props => props.relative ? 'relative' : 'absolute', props => props.open ? 'block' : 'none', sx);
const PopoverContent = styled.div.withConfig({
  displayName: "Popover__PopoverContent",
  componentId: "sc-7jji3e-1"
})(["border:1px solid ", ";border-radius:", ";position:relative;width:232px;margin-right:auto;margin-left:auto;padding:", ";background-color:", ";&::before,&::after{position:absolute;left:50%;display:inline-block;content:'';}&::before{top:-", ";margin-left:-9px;border:", " solid transparent;border-bottom-color:", ";}&::after{top:-14px;margin-left:-", ";border:7px solid transparent;border-bottom-color:", ";}", ".caret-pos--bottom &,", ".caret-pos--bottom-right &,", ".caret-pos--bottom-left &{&::before,&::after{top:auto;border-bottom-color:transparent;}&::before{bottom:-", ";border-top-color:", ";}&::after{bottom:-14px;border-top-color:", ";}}", ".caret-pos--top-right &,", ".caret-pos--bottom-right &{right:-9px;margin-right:0;&::before,&::after{left:auto;margin-left:0;}&::before{right:20px;}&::after{right:21px;}}", ".caret-pos--top-left &,", ".caret-pos--bottom-left &{left:-9px;margin-left:0;&::before,&::after{left:", ";margin-left:0;}&::after{left:calc(", " + 1px);}}", ".caret-pos--right &,", ".caret-pos--right-top &,", ".caret-pos--right-bottom &,", ".caret-pos--left &,", ".caret-pos--left-top &,", ".caret-pos--left-bottom &{&::before,&::after{top:50%;left:auto;margin-left:0;border-bottom-color:transparent;}&::before{margin-top:calc((", " + 1px) * -1);}&::after{margin-top:-", ";}}", ".caret-pos--right &,", ".caret-pos--right-top &,", ".caret-pos--right-bottom &{&::before{right:-", ";border-left-color:", ";}&::after{right:-14px;border-left-color:", ";}}", ".caret-pos--left &,", ".caret-pos--left-top &,", ".caret-pos--left-bottom &{&::before{left:-", ";border-right-color:", ";}&::after{left:-14px;border-right-color:", ";}}", ".caret-pos--right-top &,", ".caret-pos--left-top &{&::before,&::after{top:", ";}}", ".caret-pos--right-bottom &,", ".caret-pos--left-bottom &{&::before,&::after{top:auto;}&::before{bottom:", ";}&::after{bottom:calc(", " + 1px);}}", ";"], get('colors.border.default'), get('radii.2'), get('space.4'), get('colors.canvas.overlay'), get('space.3'), get('space.2'), get('colors.border.default'), get('space.2'), get('colors.canvas.overlay'), Popover, Popover, Popover, get('space.3'), get('colors.border.default'), get('colors.canvas.overlay'), Popover, Popover, Popover, Popover, get('space.4'), get('space.4'), Popover, Popover, Popover, Popover, Popover, Popover, get('space.2'), get('space.2'), Popover, Popover, Popover, get('space.3'), get('colors.border.default'), get('colors.canvas.overlay'), Popover, Popover, Popover, get('space.3'), get('colors.border.default'), get('colors.canvas.overlay'), Popover, Popover, get('space.4'), Popover, Popover, get('space.3'), get('space.3'), sx);
Popover.defaultProps = {
  caret: 'top'
};
PopoverContent.displayName = 'Popover.Content';
var Popover$1 = Object.assign(Popover, {
  Content: PopoverContent
});

export { Popover$1 as default };
