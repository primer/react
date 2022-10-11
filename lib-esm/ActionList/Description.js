import React from 'react';
import Box from '../Box.js';
import '../sx.js';
import Truncate from '../Truncate.js';
import { Slot } from './shared.js';
import merge from 'deepmerge';

const Description = ({
  variant = 'inline',
  sx = {},
  ...props
}) => {
  const styles = {
    fontSize: 0,
    lineHeight: '16px',
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
    marginLeft: variant === 'block' ? 0 : 2
  };
  return /*#__PURE__*/React.createElement(Slot, {
    name: variant === 'block' ? 'BlockDescription' : 'InlineDescription'
  }, ({
    blockDescriptionId,
    inlineDescriptionId,
    disabled
  }) => variant === 'block' ? /*#__PURE__*/React.createElement(Box, {
    as: "span",
    sx: merge({ ...styles,
      color: disabled ? 'fg.disabled' : 'fg.muted'
    }, sx),
    id: blockDescriptionId
  }, props.children) : /*#__PURE__*/React.createElement(Truncate, {
    id: inlineDescriptionId,
    sx: merge({ ...styles,
      color: disabled ? 'fg.disabled' : 'fg.muted'
    }, sx),
    title: props.children,
    inline: true,
    maxWidth: "100%"
  }, props.children));
};
Description.displayName = "Description";

export { Description };
