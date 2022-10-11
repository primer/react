import React, { useContext } from 'react';
import { PencilIcon, EyeIcon } from '@primer/octicons-react';
import Box from '../../Box.js';
import { Button } from '../../Button/index.js';
import { MarkdownEditorContext } from './_MarkdownEditorContext.js';
import { IconButton } from '../../Button/IconButton.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// no point in memoizing this component because onLoadPreview depends on value, so it would still re-render on every change
const ViewSwitch = ({
  selectedView,
  onViewSelect,
  onLoadPreview,
  disabled
}) => {
  // don't get disabled from context - the switch is not disabled when the editor is disabled
  const {
    condensed
  } = useContext(MarkdownEditorContext);
  const {
    label,
    icon,
    ...sharedProps
  } = selectedView === 'preview' ? {
    variant: 'invisible',
    sx: {
      color: 'fg.default',
      px: 2
    },
    onClick: () => onViewSelect === null || onViewSelect === void 0 ? void 0 : onViewSelect('edit'),
    icon: PencilIcon,
    label: 'Edit'
  } : {
    variant: 'invisible',
    sx: {
      color: 'fg.default',
      px: 2
    },
    onClick: () => {
      onLoadPreview();
      onViewSelect === null || onViewSelect === void 0 ? void 0 : onViewSelect('preview');
    },
    onMouseOver: () => onLoadPreview(),
    onFocus: () => onLoadPreview(),
    icon: EyeIcon,
    label: 'Preview'
  };
  return /*#__PURE__*/React.createElement(Box, {
    sx: {
      display: 'flex',
      flexDirection: 'row'
    }
  }, condensed ? /*#__PURE__*/React.createElement(IconButton, _extends({}, sharedProps, {
    disabled: disabled,
    icon: icon,
    label: label
  })) : /*#__PURE__*/React.createElement(Button, _extends({}, sharedProps, {
    leadingIcon: icon,
    disabled: disabled
  }), label));
};
ViewSwitch.displayName = "ViewSwitch";

export { ViewSwitch };
