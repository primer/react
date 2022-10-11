'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
var _MarkdownEditorContext = require('./_MarkdownEditorContext.js');
var Box = require('../../Box.js');
var Text = require('../../Text.js');
var Spinner = require('../../Spinner.js');
var index = require('../../Button/index.js');
var LinkButton = require('../../Button/LinkButton.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const uploadingNote = ([current, total]) => total === 1 ? `Uploading your file...` : `Uploading your files... (${current}/${total})`;

const Footer = ({
  actionButtons,
  uploadButtonProps,
  fileUploadProgress,
  fileDraggedOver,
  errorMessage,
  previewMode
}) => /*#__PURE__*/React__default["default"].createElement(Box, {
  sx: {
    pt: 2,
    display: 'flex',
    gap: 2,
    justifyContent: 'space-between',
    minHeight: '36px'
  },
  as: "footer"
}, /*#__PURE__*/React__default["default"].createElement(Box, {
  sx: {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    fontSize: 0
  }
}, previewMode ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null) : fileUploadProgress ? /*#__PURE__*/React__default["default"].createElement(Text, {
  sx: {
    py: 1,
    px: 2
  }
}, /*#__PURE__*/React__default["default"].createElement(Spinner, {
  size: "small",
  sx: {
    mr: 1,
    verticalAlign: 'text-bottom'
  }
}), " ", uploadingNote(fileUploadProgress)) : errorMessage ? /*#__PURE__*/React__default["default"].createElement(ErrorMessage, {
  message: errorMessage
}) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(MarkdownSupportedHint, null), uploadButtonProps && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(VisualSeparator, null), /*#__PURE__*/React__default["default"].createElement(FileUploadButton, _extends({
  fileDraggedOver: fileDraggedOver
}, uploadButtonProps))))), !fileUploadProgress && /*#__PURE__*/React__default["default"].createElement(Box, {
  sx: {
    display: 'flex',
    gap: 2
  }
}, actionButtons));
Footer.displayName = "Footer";
const ErrorMessage = /*#__PURE__*/React.memo(({
  message
}) => /*#__PURE__*/React__default["default"].createElement(Text, {
  sx: {
    py: 1,
    px: 2,
    color: 'danger.fg'
  },
  "aria-live": "polite"
}, /*#__PURE__*/React__default["default"].createElement(Text, {
  sx: {
    mr: 1
  }
}, /*#__PURE__*/React__default["default"].createElement(octiconsReact.AlertIcon, {
  size: "small"
})), ' ', message));
const FileUploadButton = /*#__PURE__*/React.memo(({
  fileDraggedOver,
  ...props
}) => {
  const {
    condensed,
    disabled
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  return /*#__PURE__*/React__default["default"].createElement(index.Button, _extends({
    variant: "invisible",
    leadingIcon: octiconsReact.ImageIcon,
    size: "small",
    sx: {
      color: 'fg.default',
      fontWeight: fileDraggedOver ? 'bold' : 'normal',
      px: 2
    },
    onMouseDown: e => {
      // Prevent pulling focus from the textarea
      e.preventDefault();
    },
    disabled: disabled
  }, props), condensed ? 'Add files' : fileDraggedOver ? 'Drop to add files' : 'Paste, drop, or click to add files');
});
const VisualSeparator = /*#__PURE__*/React.memo(() => /*#__PURE__*/React__default["default"].createElement(Box, {
  sx: {
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: 'border.muted',
    height: '100%'
  }
}));
const MarkdownSupportedHint = /*#__PURE__*/React.memo(() => {
  const {
    condensed
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  return /*#__PURE__*/React__default["default"].createElement(LinkButton.LinkButton, {
    leadingIcon: octiconsReact.MarkdownIcon,
    variant: "invisible",
    size: "small",
    sx: {
      color: 'inherit',
      fontWeight: 'normal',
      px: 2
    },
    href: "https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax",
    target: "_blank" // The markdown editor aria-description already describes it as Markdown editor, so it's
    // redundant to say Markdown is supported again here. However for sighted users, they
    // cannot see the aria-description so this is a useful hint for them. So the aria-label
    // is different from the visible text content.
    ,
    "aria-label": "Markdown documentation"
  }, !condensed && /*#__PURE__*/React__default["default"].createElement(Text, {
    "aria-hidden": true
  }, "Markdown is supported"));
});

exports.Footer = Footer;
