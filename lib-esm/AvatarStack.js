import classnames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { get } from './constants.js';
import Box from './Box.js';
import sx from './sx.js';

const AvatarStackWrapper = styled.span.withConfig({
  displayName: "AvatarStack__AvatarStackWrapper",
  componentId: "sc-10uzy85-0"
})(["display:flex;position:relative;height:20px;min-width:", ";.pc-AvatarItem{flex-shrink:0;height:20px;width:20px;box-shadow:0 0 0 1px ", ";position:relative;overflow:hidden;transition:margin 0.2s ease-in-out,opacity 0.2s ease-in-out,visibility 0.2s ease-in-out,box-shadow 0.1s ease-in-out;&:first-child{margin-left:0;z-index:10;}&:nth-child(n + 2){margin-left:-11px;z-index:9;}&:nth-child(n + 3){margin-left:-17px;opacity:", "%;z-index:8;}&:nth-child(n + 4){opacity:", "%;z-index:7;}&:nth-child(n + 5){opacity:", "%;z-index:6;}&:nth-child(n + 6){opacity:0;visibility:hidden;}}&.pc-AvatarStack--two{min-width:30px;}&.pc-AvatarStack--three-plus{min-width:38px;}&.pc-AvatarStack--right{justify-content:flex-end;.pc-AvatarItem{margin-left:0 !important;&:first-child{margin-right:0;}&:nth-child(n + 2){margin-right:-11px;}&:nth-child(n + 3){margin-right:-17px;}}.pc-AvatarStackBody{flex-direction:row-reverse;&:hover{.pc-AvatarItem{margin-right:", "!important;margin-left:0 !important;&:first-child{margin-right:0 !important;}}}}}.pc-AvatarStackBody:hover{width:auto;.pc-AvatarItem{margin-left:", ";opacity:100%;visibility:visible;box-shadow:0 0 0 4px ", ";&:first-child{margin-left:0;}}}", ";"], props => props.count === 1 ? '20px' : props.count === 2 ? '30px' : '38px', get('colors.canvas.default'), 100 - 3 * 15, 100 - 4 * 15, 100 - 5 * 15, get('space.1'), get('space.1'), get('colors.canvas.default'), sx);

const transformChildren = children => {
  return React.Children.map(children, child => {
    if (! /*#__PURE__*/React.isValidElement(child)) return child;
    return /*#__PURE__*/React.cloneElement(child, { ...child.props,
      className: classnames(child.props.className, 'pc-AvatarItem')
    });
  });
};

const AvatarStack = ({
  children,
  alignRight,
  sx: sxProp
}) => {
  const count = React.Children.count(children);
  const wrapperClassNames = classnames({
    'pc-AvatarStack--two': count === 2,
    'pc-AvatarStack--three-plus': count > 2,
    'pc-AvatarStack--right': alignRight
  });
  return /*#__PURE__*/React.createElement(AvatarStackWrapper, {
    count: count,
    className: wrapperClassNames,
    sx: sxProp
  }, /*#__PURE__*/React.createElement(Box, {
    position: "absolute",
    display: "flex",
    width: "38px",
    className: "pc-AvatarStackBody"
  }, transformChildren(children)));
};

AvatarStack.displayName = "AvatarStack";

export { AvatarStack as default };
