'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const footerStyles = styled.css(["margin-top:-1px;padding:", " ", ";font-size:", ";color:", ";text-align:center;border-top:", " solid ", ";@media (min-width:", "){padding:", " ", ";}"], constants.get('space.2'), constants.get('space.3'), constants.get('fontSizes.0'), constants.get('colors.fg.muted'), constants.get('borderWidths.1'), constants.get('colors.border.muted'), constants.get('breakpoints.0'), constants.get('space.1'), constants.get('space.2'));
const SelectMenuFooter = styled__default["default"].footer.withConfig({
  displayName: "SelectMenuFooter",
  componentId: "sc-1fomnr6-0"
})(["", " ", ";"], footerStyles, sx["default"]);
SelectMenuFooter.displayName = 'SelectMenu.Footer';
var SelectMenuFooter$1 = SelectMenuFooter;

module.exports = SelectMenuFooter$1;
