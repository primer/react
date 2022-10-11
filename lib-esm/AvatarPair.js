import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.js';
import { get } from './constants.js';
import Box from './Box.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ChildAvatar = styled(Avatar).withConfig({
  displayName: "AvatarPair__ChildAvatar",
  componentId: "sc-fw60pa-0"
})(["position:absolute;right:-15%;bottom:-9%;box-shadow:", ";"], get('shadows.avatar.childShadow'));

const AvatarPair = ({
  children,
  ...rest
}) => {
  const avatars = React.Children.map(children, (child, i) => {
    if (! /*#__PURE__*/React.isValidElement(child)) return child;
    return i === 0 ? /*#__PURE__*/React.cloneElement(child, {
      size: 40
    }) : /*#__PURE__*/React.createElement(ChildAvatar, _extends({
      bg: "canvas.default"
    }, child.props, {
      size: 20
    }));
  });
  return /*#__PURE__*/React.createElement(Box, _extends({
    position: "relative",
    display: "inline-flex"
  }, rest), avatars);
};

AvatarPair.displayName = "AvatarPair";
// styled() changes this
AvatarPair.displayName = 'AvatarPair';

export { AvatarPair as default };
