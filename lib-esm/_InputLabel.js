import React from 'react';
import Box from './Box.js';
import VisuallyHidden from './_VisuallyHidden.js';

const InputLabel = ({
  children,
  disabled,
  htmlFor,
  id,
  required,
  visuallyHidden,
  sx,
  as = 'label'
}) => {
  return /*#__PURE__*/React.createElement(VisuallyHidden, {
    isVisible: !visuallyHidden,
    as: as
    /* This assertion is clearly wrong, but it's the only way TS will allow the htmlFor prop to be possibly defined */
    ,
    htmlFor: htmlFor,
    id: id,
    sx: {
      fontWeight: 'bold',
      fontSize: 1,
      display: 'block',
      color: disabled ? 'fg.muted' : 'fg.default',
      cursor: disabled ? 'default' : 'pointer',
      alignSelf: 'flex-start',
      ...sx
    }
  }, required ? /*#__PURE__*/React.createElement(Box, {
    display: "flex",
    as: "span"
  }, /*#__PURE__*/React.createElement(Box, {
    mr: 1
  }, children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "*")) : children);
};

InputLabel.displayName = "InputLabel";
var InputLabel$1 = InputLabel;

export { InputLabel$1 as default };
