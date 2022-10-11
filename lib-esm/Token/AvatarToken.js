import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { get } from '../constants.js';
import { tokenSizes, defaultTokenSize } from './TokenBase.js';
import Token from './Token.js';
import Avatar from '../Avatar.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AvatarContainer = styled.span.withConfig({
  displayName: "AvatarToken__AvatarContainer",
  componentId: "sc-62sih1-0"
})(["--spacing:calc(", " * 2);display:block;height:", ";width:", ";"], get('space.1'), props => `calc(${tokenSizes[props.avatarSize]} - var(--spacing))`, props => `calc(${tokenSizes[props.avatarSize]} - var(--spacing))`);
const AvatarToken = /*#__PURE__*/forwardRef(({
  avatarSrc,
  id,
  size,
  ...rest
}, forwardedRef) => {
  return /*#__PURE__*/React.createElement(Token, _extends({
    leadingVisual: () => /*#__PURE__*/React.createElement(AvatarContainer, {
      avatarSize: size || defaultTokenSize
    }, /*#__PURE__*/React.createElement(Avatar, {
      src: avatarSrc,
      size: parseInt(tokenSizes[size || defaultTokenSize], 10),
      sx: {
        width: '100%',
        height: '100%'
      }
    })),
    size: size,
    id: id === null || id === void 0 ? void 0 : id.toString(),
    sx: {
      paddingLeft: get('space.1')
    }
  }, rest, {
    ref: forwardedRef
  }));
});
AvatarToken.defaultProps = {
  size: defaultTokenSize
};
AvatarToken.displayName = 'AvatarToken';
var AvatarToken$1 = AvatarToken;

export { AvatarToken$1 as default };
