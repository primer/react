import React, { useContext } from 'react';
import InputLabel from '../../_InputLabel.js';
import { MarkdownEditorSlot } from './MarkdownEditor.js';
import { MarkdownEditorContext } from './_MarkdownEditorContext.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// ref is not forwarded because InputLabel does not (yet) support it
const Legend = ({
  sx,
  ...props
}) => {
  // using context and definining a Slot in the same component causes an infinite loop, so these must be separate
  const {
    disabled,
    required
  } = useContext(MarkdownEditorContext);
  return /*#__PURE__*/React.createElement(InputLabel, _extends({
    as: "legend",
    disabled: disabled,
    required: required
  }, props, {
    sx: {
      cursor: 'default',
      mb: 1,
      ...sx
    }
  }));
};

Legend.displayName = "Legend";
Legend.displayName = 'MarkdownEditor.Label';
const Label = props => /*#__PURE__*/React.createElement(MarkdownEditorSlot, {
  name: "Label"
}, /*#__PURE__*/React.createElement(Legend, props));
Label.displayName = "Label";

export { Label };
