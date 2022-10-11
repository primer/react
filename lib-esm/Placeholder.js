import React from 'react';
import Box from './Box.js';

/** Private component used to render placeholders in storybook and documentation examples  */

const Placeholder = ({
  width,
  height,
  id,
  label
}) => {
  return /*#__PURE__*/React.createElement(Box, {
    id: id,
    sx: {
      width: width !== null && width !== void 0 ? width : '100%',
      height,
      display: 'grid',
      placeItems: 'center',
      bg: 'canvas.inset',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'border.subtle'
    }
  }, label);
};
Placeholder.displayName = "Placeholder";

export { Placeholder };
