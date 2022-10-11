'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

let hasRegisteredToolbarElement = false;
/**
 * Renders an invisible `markdown-toolbar-element` that provides formatting actions to the
 * editor. This is a hacky way of using the library, but it allows us to use the built-in
 * behavior without having to actually display the inflexible toolbar element. It also means
 * we can still use the formatting tools even if the consumer hides the default toolbar
 * buttons (ie, by keyboard shortcut).
 */

const FormattingTools = /*#__PURE__*/React.forwardRef(({
  forInputId
}, forwadedRef) => {
  React.useEffect(() => {
    // requiring this module will register the custom element; we don't want to do that until the component mounts in the DOM
    if (!hasRegisteredToolbarElement) require('@github/markdown-toolbar-element');
    hasRegisteredToolbarElement = true;
  }, []);
  const headerRef = React.useRef(null);
  const boldRef = React.useRef(null);
  const italicRef = React.useRef(null);
  const quoteRef = React.useRef(null);
  const codeRef = React.useRef(null);
  const linkRef = React.useRef(null);
  const unorderedListRef = React.useRef(null);
  const orderedListRef = React.useRef(null);
  const taskListRef = React.useRef(null);
  const mentionRef = React.useRef(null);
  const referenceRef = React.useRef(null);
  React.useImperativeHandle(forwadedRef, () => ({
    header: () => {
      var _headerRef$current;

      return (_headerRef$current = headerRef.current) === null || _headerRef$current === void 0 ? void 0 : _headerRef$current.click();
    },
    bold: () => {
      var _boldRef$current;

      return (_boldRef$current = boldRef.current) === null || _boldRef$current === void 0 ? void 0 : _boldRef$current.click();
    },
    italic: () => {
      var _italicRef$current;

      return (_italicRef$current = italicRef.current) === null || _italicRef$current === void 0 ? void 0 : _italicRef$current.click();
    },
    quote: () => {
      var _quoteRef$current;

      return (_quoteRef$current = quoteRef.current) === null || _quoteRef$current === void 0 ? void 0 : _quoteRef$current.click();
    },
    code: () => {
      var _codeRef$current;

      return (_codeRef$current = codeRef.current) === null || _codeRef$current === void 0 ? void 0 : _codeRef$current.click();
    },
    link: () => {
      var _linkRef$current;

      return (_linkRef$current = linkRef.current) === null || _linkRef$current === void 0 ? void 0 : _linkRef$current.click();
    },
    unorderedList: () => {
      var _unorderedListRef$cur;

      return (_unorderedListRef$cur = unorderedListRef.current) === null || _unorderedListRef$cur === void 0 ? void 0 : _unorderedListRef$cur.click();
    },
    orderedList: () => {
      var _orderedListRef$curre;

      return (_orderedListRef$curre = orderedListRef.current) === null || _orderedListRef$curre === void 0 ? void 0 : _orderedListRef$curre.click();
    },
    taskList: () => {
      var _taskListRef$current;

      return (_taskListRef$current = taskListRef.current) === null || _taskListRef$current === void 0 ? void 0 : _taskListRef$current.click();
    },
    mention: () => {
      var _mentionRef$current;

      return (_mentionRef$current = mentionRef.current) === null || _mentionRef$current === void 0 ? void 0 : _mentionRef$current.click();
    },
    reference: () => {
      var _referenceRef$current;

      return (_referenceRef$current = referenceRef.current) === null || _referenceRef$current === void 0 ? void 0 : _referenceRef$current.click();
    }
  }));
  return /*#__PURE__*/React__default["default"].createElement("markdown-toolbar", {
    for: forInputId,
    style: {
      display: 'none'
    }
  }, /*#__PURE__*/React__default["default"].createElement("md-header", {
    ref: headerRef
  }), /*#__PURE__*/React__default["default"].createElement("md-bold", {
    ref: boldRef
  }), /*#__PURE__*/React__default["default"].createElement("md-italic", {
    ref: italicRef
  }), /*#__PURE__*/React__default["default"].createElement("md-quote", {
    ref: quoteRef
  }), /*#__PURE__*/React__default["default"].createElement("md-code", {
    ref: codeRef
  }), /*#__PURE__*/React__default["default"].createElement("md-link", {
    ref: linkRef
  }), /*#__PURE__*/React__default["default"].createElement("md-unordered-list", {
    ref: unorderedListRef
  }), /*#__PURE__*/React__default["default"].createElement("md-ordered-list", {
    ref: orderedListRef
  }), /*#__PURE__*/React__default["default"].createElement("md-task-list", {
    ref: taskListRef
  }), /*#__PURE__*/React__default["default"].createElement("md-mention", {
    ref: mentionRef
  }), /*#__PURE__*/React__default["default"].createElement("md-ref", {
    ref: referenceRef
  }));
});

exports.FormattingTools = FormattingTools;
