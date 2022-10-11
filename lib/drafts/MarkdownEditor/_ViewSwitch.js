'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
var Box = require('../../Box.js');
var index = require('../../Button/index.js');
var _MarkdownEditorContext = require('./_MarkdownEditorContext.js');
var IconButton = require('../../Button/IconButton.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
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
    icon: octiconsReact.PencilIcon,
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
    icon: octiconsReact.EyeIcon,
    label: 'Preview'
  };
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    sx: {
      display: 'flex',
      flexDirection: 'row'
    }
  }, condensed ? /*#__PURE__*/React__default["default"].createElement(IconButton.IconButton, _extends({}, sharedProps, {
    disabled: disabled,
    icon: icon,
    label: label
  })) : /*#__PURE__*/React__default["default"].createElement(index.Button, _extends({}, sharedProps, {
    leadingIcon: icon,
    disabled: disabled
  }), label));
};
ViewSwitch.displayName = "ViewSwitch";

exports.ViewSwitch = ViewSwitch;
