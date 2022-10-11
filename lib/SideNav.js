'use strict';

var constants = require('./constants.js');
var styled = require('styled-components');
var Box = require('./Box.js');
var Link = require('./Link.js');
var React = require('react');
var classnames = require('classnames');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);

function SideNavBase({
  variant,
  className,
  bordered,
  children,
  'aria-label': ariaLabel
}) {
  const variantClassName = variant === 'lightweight' ? 'lightweight' : 'normal';
  const newClassName = classnames__default["default"](className, `variant-${variantClassName}`);
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    borderWidth: bordered ? '1px' : 0,
    borderStyle: "solid",
    borderColor: "border.default",
    borderRadius: 2,
    as: "nav",
    className: newClassName,
    "aria-label": ariaLabel
  }, children);
}

SideNavBase.displayName = "SideNavBase";
const SideNav = styled__default["default"](SideNavBase).withConfig({
  displayName: "SideNav",
  componentId: "sc-11f1jdr-0"
})(["background-color:", ";", " ", ";"], constants.get('colors.canvas.subtle'), props => props.bordered && styled.css(["& > &{border-left:0;border-right:0;border-bottom:0;}"]), sx["default"]);
// used for variant normal hover, focus pseudo selectors
const CommonAccessibilityVariantNormalStyles = styled.css(["background-color:", ";outline:none;text-decoration:none;"], constants.get('colors.neutral.subtle')); // used for light weight hover, focus pseudo selectors

const CommonAccessibilityVariantLightWeightStyles = styled.css(["color:", ";text-decoration:none;outline:none;"], constants.get('colors.fg.default'));
const SideNavLink = styled__default["default"](Link).attrs(props => {
  const isReactRouter = typeof props.to === 'string';

  if (isReactRouter || props.selected) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    return {
      'aria-current': 'page'
    };
  } else {
    return {};
  }
}).withConfig({
  displayName: "SideNav__SideNavLink",
  componentId: "sc-11f1jdr-1"
})(["position:relative;display:block;", " width:100%;text-align:left;font-size:", ";& > ", "{border-bottom:none;}", ".variant-normal > &{color:", ";padding:", ";border:0;border-top:", " solid ", ";&:first-child{border-top:0;border-top-right-radius:", ";border-top-left-radius:", ";}&:last-child{border-bottom-right-radius:", ";border-bottom-left-radius:", ";}&::before{position:absolute;top:0;bottom:0;left:0;z-index:1;width:3px;pointer-events:none;content:'';}&:hover{", "}&:focus{", " box-shadow:", ";z-index:1;}&[aria-current='page'],&[aria-selected='true']{background-color:", ";&::before{background-color:", ";}}}", ".variant-lightweight > &{padding:", " 0;color:", ";&:hover{", "}&:focus{", " box-shadow:", ";z-index:1;}&[aria-current='page'],&[aria-selected='true']{color:", ";font-weight:", ";}}", ";"], props => props.variant === 'full' && styled.css(["display:flex;align-items:center;justify-content:space-between;"]), constants.get('fontSizes.1'), SideNav, SideNav, constants.get('colors.fg.default'), constants.get('space.3'), constants.get('borderWidths.1'), constants.get('colors.border.muted'), constants.get('radii.2'), constants.get('radii.2'), constants.get('radii.2'), constants.get('radii.2'), CommonAccessibilityVariantNormalStyles, CommonAccessibilityVariantNormalStyles, constants.get('shadows.primer.shadow.focus'), constants.get('colors.sidenav.selectedBg'), constants.get('colors.primer.border.active'), SideNav, constants.get('space.1'), constants.get('colors.accent.fg'), CommonAccessibilityVariantLightWeightStyles, CommonAccessibilityVariantLightWeightStyles, constants.get('shadows.primer.shadow.focus'), constants.get('colors.fg.default'), constants.get('fontWeights.semibold'), sx["default"]);
SideNav.defaultProps = {
  variant: 'normal'
};
SideNavLink.defaultProps = {
  variant: 'normal'
};
SideNavLink.displayName = 'SideNav.Link';

/** @deprecated Use [NavList](https://primer.style/react/NavList) instead */
var SideNav$1 = Object.assign(SideNav, {
  Link: SideNavLink
});

module.exports = SideNav$1;
