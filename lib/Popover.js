'use strict';

var classnames = require('classnames');
var styled = require('styled-components');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Popover = styled__default["default"].div.attrs(({
  className,
  caret
}) => {
  return {
    className: classnames__default["default"](className, `caret-pos--${caret}`)
  };
}).withConfig({
  displayName: "Popover",
  componentId: "sc-7jji3e-0"
})(["position:", ";z-index:100;display:", ";", ";"], props => props.relative ? 'relative' : 'absolute', props => props.open ? 'block' : 'none', sx["default"]);
const PopoverContent = styled__default["default"].div.withConfig({
  displayName: "Popover__PopoverContent",
  componentId: "sc-7jji3e-1"
})(["border:1px solid ", ";border-radius:", ";position:relative;width:232px;margin-right:auto;margin-left:auto;padding:", ";background-color:", ";&::before,&::after{position:absolute;left:50%;display:inline-block;content:'';}&::before{top:-", ";margin-left:-9px;border:", " solid transparent;border-bottom-color:", ";}&::after{top:-14px;margin-left:-", ";border:7px solid transparent;border-bottom-color:", ";}", ".caret-pos--bottom &,", ".caret-pos--bottom-right &,", ".caret-pos--bottom-left &{&::before,&::after{top:auto;border-bottom-color:transparent;}&::before{bottom:-", ";border-top-color:", ";}&::after{bottom:-14px;border-top-color:", ";}}", ".caret-pos--top-right &,", ".caret-pos--bottom-right &{right:-9px;margin-right:0;&::before,&::after{left:auto;margin-left:0;}&::before{right:20px;}&::after{right:21px;}}", ".caret-pos--top-left &,", ".caret-pos--bottom-left &{left:-9px;margin-left:0;&::before,&::after{left:", ";margin-left:0;}&::after{left:calc(", " + 1px);}}", ".caret-pos--right &,", ".caret-pos--right-top &,", ".caret-pos--right-bottom &,", ".caret-pos--left &,", ".caret-pos--left-top &,", ".caret-pos--left-bottom &{&::before,&::after{top:50%;left:auto;margin-left:0;border-bottom-color:transparent;}&::before{margin-top:calc((", " + 1px) * -1);}&::after{margin-top:-", ";}}", ".caret-pos--right &,", ".caret-pos--right-top &,", ".caret-pos--right-bottom &{&::before{right:-", ";border-left-color:", ";}&::after{right:-14px;border-left-color:", ";}}", ".caret-pos--left &,", ".caret-pos--left-top &,", ".caret-pos--left-bottom &{&::before{left:-", ";border-right-color:", ";}&::after{left:-14px;border-right-color:", ";}}", ".caret-pos--right-top &,", ".caret-pos--left-top &{&::before,&::after{top:", ";}}", ".caret-pos--right-bottom &,", ".caret-pos--left-bottom &{&::before,&::after{top:auto;}&::before{bottom:", ";}&::after{bottom:calc(", " + 1px);}}", ";"], constants.get('colors.border.default'), constants.get('radii.2'), constants.get('space.4'), constants.get('colors.canvas.overlay'), constants.get('space.3'), constants.get('space.2'), constants.get('colors.border.default'), constants.get('space.2'), constants.get('colors.canvas.overlay'), Popover, Popover, Popover, constants.get('space.3'), constants.get('colors.border.default'), constants.get('colors.canvas.overlay'), Popover, Popover, Popover, Popover, constants.get('space.4'), constants.get('space.4'), Popover, Popover, Popover, Popover, Popover, Popover, constants.get('space.2'), constants.get('space.2'), Popover, Popover, Popover, constants.get('space.3'), constants.get('colors.border.default'), constants.get('colors.canvas.overlay'), Popover, Popover, Popover, constants.get('space.3'), constants.get('colors.border.default'), constants.get('colors.canvas.overlay'), Popover, Popover, constants.get('space.4'), Popover, Popover, constants.get('space.3'), constants.get('space.3'), sx["default"]);
Popover.defaultProps = {
  caret: 'top'
};
PopoverContent.displayName = 'Popover.Content';
var Popover$1 = Object.assign(Popover, {
  Content: PopoverContent
});

module.exports = Popover$1;
