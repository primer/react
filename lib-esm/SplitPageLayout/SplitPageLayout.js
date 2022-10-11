import React from 'react';
import { PageLayout } from '../PageLayout/PageLayout.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// SplitPageLayout

const Root = props => {
  return /*#__PURE__*/React.createElement(PageLayout, _extends({
    containerWidth: "full",
    padding: "none",
    columnGap: "none",
    rowGap: "none"
  }, props));
};
Root.displayName = "Root";
Root.displayName = 'SplitPageLayout'; // ----------------------------------------------------------------------------
// SplitPageLayout.Header

const Header = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  return /*#__PURE__*/React.createElement(PageLayout.Header, _extends({
    padding: padding,
    divider: divider
  }, props));
};
Header.displayName = "Header";
Header.displayName = 'SplitPageLayout.Header'; // ----------------------------------------------------------------------------
// SplitPageLayout.Content

const Content = ({
  width = 'large',
  padding = 'normal',
  ...props
}) => {
  return /*#__PURE__*/React.createElement(PageLayout.Content, _extends({
    width: width,
    padding: padding
  }, props));
};
Content.displayName = "Content";
Content.displayName = 'SplitPageLayout.Content'; // ----------------------------------------------------------------------------
// SplitPageLayout.Pane

const Pane = ({
  position = 'start',
  sticky = true,
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  return /*#__PURE__*/React.createElement(PageLayout.Pane, _extends({
    position: position,
    sticky: sticky,
    padding: padding,
    divider: divider
  }, props));
};
Pane.displayName = "Pane";
Pane.displayName = 'SplitPageLayout.Pane'; // ----------------------------------------------------------------------------
// SplitPageLayout.Footer

const Footer = ({
  padding = 'normal',
  divider = 'line',
  ...props
}) => {
  return /*#__PURE__*/React.createElement(PageLayout.Footer, _extends({
    padding: padding,
    divider: divider
  }, props));
};
Footer.displayName = "Footer";
Footer.displayName = 'SplitPageLayout.Footer'; // ----------------------------------------------------------------------------
// Export

const SplitPageLayout = Object.assign(Root, {
  Header,
  Content,
  Pane,
  Footer
});

export { Content, Footer, Header, Pane, Root, SplitPageLayout };
