'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var index = require('../../Button/index.js');
var MarkdownEditor = require('./MarkdownEditor.js');
var _MarkdownEditorContext = require('./_MarkdownEditorContext.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Actions = ({
  children
}) => /*#__PURE__*/React__default["default"].createElement(MarkdownEditor.MarkdownEditorSlot, {
  name: "Actions"
}, children);
Actions.displayName = "Actions";
Actions.displayName = 'MarkdownEditor.Actions';
const ActionButton = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    disabled
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  return /*#__PURE__*/React__default["default"].createElement(index.Button, _extends({
    ref: ref,
    size: "small",
    disabled: disabled
  }, props));
});
ActionButton.displayName = 'MarkdownEditor.ActionButton';

exports.ActionButton = ActionButton;
exports.Actions = Actions;
