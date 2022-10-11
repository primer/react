'use strict';

var styled = require('styled-components');
var styledSystem = require('styled-system');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Truncate = styled__default["default"].div.withConfig({
  displayName: "Truncate",
  componentId: "sc-1d9305p-0"
})(["display:", ";overflow:hidden;text-overflow:ellipsis;vertical-align:", ";white-space:nowrap;", " ", " ", ";"], props => props.inline ? 'inline-block' : 'inherit', props => props.inline ? 'top' : 'initial', styledSystem.maxWidth, props => props.expandable ? `&:hover { max-width: 10000px; }` : '', sx["default"]);
Truncate.defaultProps = {
  expandable: false,
  inline: false,
  maxWidth: 125
};
var Truncate$1 = Truncate;

module.exports = Truncate$1;
