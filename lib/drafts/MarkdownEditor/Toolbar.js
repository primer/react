'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var behaviors = require('@primer/behaviors');
var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var utils = require('@primer/behaviors/utils');
var Box = require('../../Box.js');
require('../../Button/index.js');
var useFocusZone = require('../../hooks/useFocusZone.js');
var MarkdownEditor = require('./MarkdownEditor.js');
var _MarkdownEditorContext = require('./_MarkdownEditorContext.js');
var _SavedReplies = require('./_SavedReplies.js');
var IconButton = require('../../Button/IconButton.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ToolbarButton = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    disabled
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  return /*#__PURE__*/React__default["default"].createElement(IconButton.IconButton, _extends({
    ref: ref,
    variant: "invisible",
    disabled: disabled // Prevent focus leaving input:
    ,
    onMouseDown: e => e.preventDefault()
  }, props, {
    sx: {
      color: 'fg.default',
      ...props.sx
    }
  }));
});
ToolbarButton.displayName = 'MarkdownEditor.ToolbarButton';
const DefaultToolbarButtons = /*#__PURE__*/React.memo(() => {
  const {
    condensed,
    formattingToolsRef
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  const cmdOrCtrl = utils.isMacOS() ? 'Cmd' : 'Ctrl'; // Important: do not replace `() => ref.current?.format()` with `ref.current?.format` - it will refer to an outdated ref.current!

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Box, null, /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c;

      return (_formattingToolsRef$c = formattingToolsRef.current) === null || _formattingToolsRef$c === void 0 ? void 0 : _formattingToolsRef$c.header();
    },
    icon: octiconsReact.HeadingIcon,
    "aria-label": "Add header text"
  }), /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c2;

      return (_formattingToolsRef$c2 = formattingToolsRef.current) === null || _formattingToolsRef$c2 === void 0 ? void 0 : _formattingToolsRef$c2.bold();
    },
    icon: octiconsReact.BoldIcon,
    "aria-label": `Bold (${cmdOrCtrl} + B)`
  }), /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c3;

      return (_formattingToolsRef$c3 = formattingToolsRef.current) === null || _formattingToolsRef$c3 === void 0 ? void 0 : _formattingToolsRef$c3.italic();
    },
    icon: octiconsReact.ItalicIcon,
    "aria-label": `Italic (${cmdOrCtrl} + I)`
  })), /*#__PURE__*/React__default["default"].createElement(Box, null, /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c4;

      return (_formattingToolsRef$c4 = formattingToolsRef.current) === null || _formattingToolsRef$c4 === void 0 ? void 0 : _formattingToolsRef$c4.quote();
    },
    icon: octiconsReact.QuoteIcon,
    "aria-label": `Insert a quote (${cmdOrCtrl} + Shift + .)`
  }), /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c5;

      return (_formattingToolsRef$c5 = formattingToolsRef.current) === null || _formattingToolsRef$c5 === void 0 ? void 0 : _formattingToolsRef$c5.code();
    },
    icon: octiconsReact.CodeIcon,
    "aria-label": `Insert code (${cmdOrCtrl} + E)`
  }), /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c6;

      return (_formattingToolsRef$c6 = formattingToolsRef.current) === null || _formattingToolsRef$c6 === void 0 ? void 0 : _formattingToolsRef$c6.link();
    },
    icon: octiconsReact.LinkIcon,
    "aria-label": `Add a link (${cmdOrCtrl} + K)`
  })), /*#__PURE__*/React__default["default"].createElement(Box, null, /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c7;

      return (_formattingToolsRef$c7 = formattingToolsRef.current) === null || _formattingToolsRef$c7 === void 0 ? void 0 : _formattingToolsRef$c7.unorderedList();
    },
    icon: octiconsReact.ListUnorderedIcon,
    "aria-label": `Add a bulleted list (${cmdOrCtrl} + 8)`
  }), /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c8;

      return (_formattingToolsRef$c8 = formattingToolsRef.current) === null || _formattingToolsRef$c8 === void 0 ? void 0 : _formattingToolsRef$c8.orderedList();
    },
    icon: octiconsReact.ListOrderedIcon,
    "aria-label": `Add a numbered list (${cmdOrCtrl} + Shift + 7)`
  }), /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c9;

      return (_formattingToolsRef$c9 = formattingToolsRef.current) === null || _formattingToolsRef$c9 === void 0 ? void 0 : _formattingToolsRef$c9.taskList();
    },
    icon: octiconsReact.TasklistIcon,
    "aria-label": `Add a task list (${cmdOrCtrl} + Shift + L)`
  })), !condensed && /*#__PURE__*/React__default["default"].createElement(Box, null, /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c10;

      return (_formattingToolsRef$c10 = formattingToolsRef.current) === null || _formattingToolsRef$c10 === void 0 ? void 0 : _formattingToolsRef$c10.mention();
    },
    icon: octiconsReact.MentionIcon,
    "aria-label": "Mention a user or team (@)"
  }), /*#__PURE__*/React__default["default"].createElement(ToolbarButton, {
    onClick: () => {
      var _formattingToolsRef$c11;

      return (_formattingToolsRef$c11 = formattingToolsRef.current) === null || _formattingToolsRef$c11 === void 0 ? void 0 : _formattingToolsRef$c11.reference();
    },
    icon: octiconsReact.CrossReferenceIcon,
    "aria-label": "Reference an issue, pull request, or discussion (#)"
  })), /*#__PURE__*/React__default["default"].createElement(_SavedReplies.SavedRepliesButton, null));
});
DefaultToolbarButtons.displayName = 'MarkdownEditor.DefaultToolbarButtons';
const CoreToolbar = ({
  children
}) => {
  const {
    condensed
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  const containerRef = React.useRef(null);
  useFocusZone.useFocusZone({
    containerRef,
    focusInStrategy: 'closest',
    bindKeys: behaviors.FocusKeys.ArrowHorizontal | behaviors.FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap'
  });
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    ref: containerRef,
    "aria-label": "Formatting tools",
    role: "toolbar",
    sx: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      gap: condensed ? 0 : 3
    }
  }, children);
};
CoreToolbar.displayName = "CoreToolbar";
const Toolbar = ({
  children
}) => /*#__PURE__*/React__default["default"].createElement(MarkdownEditor.MarkdownEditorSlot, {
  name: "Toolbar"
}, /*#__PURE__*/React__default["default"].createElement(CoreToolbar, null, children));
Toolbar.displayName = "Toolbar";
Toolbar.displayName = 'MarkdownEditor.Toolbar';

exports.CoreToolbar = CoreToolbar;
exports.DefaultToolbarButtons = DefaultToolbarButtons;
exports.Toolbar = Toolbar;
exports.ToolbarButton = ToolbarButton;
