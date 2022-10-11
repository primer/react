import React from 'react';
import { XIcon } from '@primer/octicons-react';
import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import { get } from '../constants.js';
import sx from '../sx.js';
import { tokenSizes, defaultTokenSize } from './TokenBase.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const variants = variant({
  prop: 'size',
  variants: {
    small: {
      height: tokenSizes.small,
      width: tokenSizes.small
    },
    medium: {
      height: tokenSizes.medium,
      width: tokenSizes.medium
    },
    large: {
      height: tokenSizes.large,
      width: tokenSizes.large
    },
    extralarge: {
      height: tokenSizes.extralarge,
      width: tokenSizes.extralarge
    },
    // xlarge will eventually replace "extralarge" per this ADR: https://github.com/github/primer/blob/main/adrs/2022-02-09-size-naming-guidelines.md
    xlarge: {
      height: tokenSizes.xlarge,
      width: tokenSizes.xlarge
    }
  }
});

const getTokenButtonIconSize = size => parseInt(tokenSizes[size || defaultTokenSize], 10) * 0.75;

const StyledTokenButton = styled.span.withConfig({
  displayName: "_RemoveTokenButton__StyledTokenButton",
  componentId: "sc-urhpr1-0"
})(["background-color:transparent;font-family:inherit;color:currentColor;cursor:pointer;display:inline-flex;justify-content:center;align-items:center;user-select:none;appearance:none;text-decoration:none;padding:0;transform:", ";align-self:baseline;border:0;border-radius:999px;", " &:hover,&:focus{background-color:", ";}&:active{background-color:", ";}", " ", ""], props => `translate(${props.borderOffset}px, -${props.borderOffset}px)`, props => {
  switch (props.size) {
    case 'large':
    case 'extralarge':
    case 'xlarge':
      return css(["margin-left:", ";"], get('space.2'));

    default:
      return css(["margin-left:", ";"], get('space.1'));
  }
}, get('colors.neutral.muted'), get('colors.neutral.subtle'), variants, sx);

const RemoveTokenButton = ({
  'aria-label': ariaLabel,
  isParentInteractive,
  size,
  ...rest
}) => {
  delete rest.children;
  return /*#__PURE__*/React.createElement(StyledTokenButton, _extends({
    as: isParentInteractive ? 'span' : 'button',
    tabIndex: isParentInteractive ? -1 : undefined,
    "aria-label": !isParentInteractive ? 'Remove token' : ariaLabel,
    size: size
  }, rest), /*#__PURE__*/React.createElement(XIcon, {
    size: getTokenButtonIconSize(size)
  }));
};

RemoveTokenButton.displayName = "RemoveTokenButton";
RemoveTokenButton.defaultProps = {
  size: defaultTokenSize
};
var RemoveTokenButton$1 = RemoveTokenButton;

export { RemoveTokenButton$1 as default };
