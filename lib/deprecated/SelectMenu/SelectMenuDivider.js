'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const dividerStyles = styled.css(["padding:", " ", ";margin:0;font-size:", ";font-weight:", ";color:", ";background-color:", ";border-bottom:", " solid ", ";"], constants.get('space.1'), constants.get('space.3'), constants.get('fontSizes.0'), constants.get('fontWeights.bold'), constants.get('colors.fg.muted'), constants.get('colors.canvas.subtle'), constants.get('borderWidths.1'), constants.get('colors.border.muted'));
const SelectMenuDivider = styled__default["default"].div.withConfig({
  displayName: "SelectMenuDivider",
  componentId: "sc-qu3a18-0"
})(["", " ", ";"], dividerStyles, sx["default"]);
SelectMenuDivider.displayName = 'SelectMenu.Divider';
var SelectMenuDivider$1 = SelectMenuDivider;

module.exports = SelectMenuDivider$1;
