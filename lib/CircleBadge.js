'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');
var StyledOcticon = require('./StyledOcticon.js');
var sx = require('./sx.js');
var isNumeric = require('./utils/isNumeric.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const variantSizes = {
  small: 56,
  medium: 96,
  large: 128
};

const sizeStyles = ({
  size,
  variant = 'medium'
}) => {
  const calc = isNumeric(size) ? size : variantSizes[variant];
  return {
    width: calc,
    height: calc
  };
};

const CircleBadge = styled__default["default"].div.withConfig({
  displayName: "CircleBadge",
  componentId: "sc-1ej09kx-0"
})(["display:", ";align-items:center;justify-content:center;background-color:", ";border-radius:50%;box-shadow:", ";", ";", ";"], props => props.inline ? 'inline-flex' : 'flex', constants.get('colors.canvas.default'), constants.get('shadows.shadow.medium'), sizeStyles, sx["default"]);
const CircleBadgeIcon = styled__default["default"](StyledOcticon).withConfig({
  displayName: "CircleBadge__CircleBadgeIcon",
  componentId: "sc-1ej09kx-1"
})(["height:auto;max-width:60%;max-height:55%;"]);
CircleBadge.defaultProps = {
  inline: false
};
CircleBadgeIcon.displayName = 'CircleBadge.Icon';
var CircleBadge$1 = Object.assign(CircleBadge, {
  Icon: CircleBadgeIcon
});

module.exports = CircleBadge$1;
