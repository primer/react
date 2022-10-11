import styled, { css } from 'styled-components';
import { get } from './constants.js';
import sx from './sx.js';

const Header = styled.div.withConfig({
  displayName: "Header",
  componentId: "sc-11fu6rh-0"
})(["z-index:32;display:flex;padding:", ";font-size:", ";line-height:", ";color:", ";background-color:", ";align-items:center;flex-wrap:nowrap;", ";"], get('space.3'), get('fontSizes.1'), get('lineHeights.default'), get('colors.header.text'), get('colors.header.bg'), sx);
const HeaderItem = styled.div.withConfig({
  displayName: "Header__HeaderItem",
  componentId: "sc-11fu6rh-1"
})(["display:flex;margin-right:", ";align-self:stretch;align-items:center;flex-wrap:nowrap;", ";", ";"], get('space.3'), ({
  full
}) => full && css(["flex:auto;"]), sx);
HeaderItem.displayName = 'Header.Item';
const HeaderLink = styled.a.attrs(({
  to
}) => {
  const isReactRouter = typeof to === 'string';

  if (isReactRouter) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    return {
      'aria-current': 'page'
    };
  } else {
    return {};
  }
}).withConfig({
  displayName: "Header__HeaderLink",
  componentId: "sc-11fu6rh-2"
})(["font-weight:", ";color:", ";white-space:nowrap;cursor:pointer;text-decoration:none;display:flex;align-items:center;&:hover,&:focus{color:", ";}", ";"], get('fontWeights.bold'), get('colors.header.logo'), get('colors.header.text'), sx);
HeaderLink.displayName = 'Header.Link';
var Header$1 = Object.assign(Header, {
  Link: HeaderLink,
  Item: HeaderItem
});

export { Header$1 as default };
