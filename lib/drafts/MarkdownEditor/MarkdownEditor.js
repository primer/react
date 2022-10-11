'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ssr = require('@react-aria/ssr');
var React = require('react');
var Box = require('../../Box.js');
var useIgnoreKeyboardActionsWhileComposing = require('../hooks/useIgnoreKeyboardActionsWhileComposing.js');
var useResizeObserver = require('../../hooks/useResizeObserver.js');
var useSyntheticChange = require('../hooks/useSyntheticChange.js');
var MarkdownViewer = require('../MarkdownViewer/MarkdownViewer.js');
var createSlots = require('../../utils/create-slots.js');
var _VisuallyHidden = require('../../_VisuallyHidden.js');
var _FormattingTools = require('./_FormattingTools.js');
var _MarkdownEditorContext = require('./_MarkdownEditorContext.js');
var Toolbar = require('./Toolbar.js');
var _Footer = require('./_Footer.js');
var _MarkdownInput = require('./_MarkdownInput.js');
var _useFileHandling = require('./_useFileHandling.js');
var _useIndenting = require('./_useIndenting.js');
var _useListEditing = require('./_useListEditing.js');
var _ViewSwitch = require('./_ViewSwitch.js');
var useSafeAsyncCallback = require('../hooks/useSafeAsyncCallback.js');
var _SavedReplies = require('./_SavedReplies.js');
var utils = require('./utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const a11yOnlyStyle = {
  clipPath: 'Circle(0)',
  position: 'absolute'
};
const CONDENSED_WIDTH_THRESHOLD = 675;
const {
  Slot,
  Slots
} = createSlots(['Toolbar', 'Actions', 'Label']);
const MarkdownEditorSlot = Slot;
/**
 * We want to switch editors from preview mode on cmd/ctrl+shift+P. But in preview mode,
 * there's no input to focus so we have to bind the event to the document. If there are
 * multiple editors, we want the most recent one to switch to preview mode to be the one
 * that we switch back to edit mode, so we maintain a LIFO stack of IDs of editors in
 * preview mode.
 */

let editorsInPreviewMode = [];
/**
 * Markdown textarea with controls & keyboard shortcuts.
 */

const MarkdownEditor = /*#__PURE__*/React.forwardRef(({
  value,
  onChange,
  disabled = false,
  placeholder,
  maxLength,
  'aria-describedby': describedBy,
  fullHeight,
  onRenderPreview,
  sx,
  onPrimaryAction,
  viewMode: controlledViewMode,
  onChangeViewMode: controlledSetViewMode,
  minHeightLines = 5,
  maxHeightLines = 35,
  emojiSuggestions,
  mentionSuggestions,
  referenceSuggestions,
  onUploadFile,
  acceptedFileTypes,
  monospace = false,
  required = false,
  name,
  children,
  savedReplies,
  pasteUrlsAsPlainText = false
}, ref) => {
  const [uncontrolledViewMode, uncontrolledSetViewMode] = React.useState('edit');
  const [view, setView] = controlledViewMode === undefined ? [uncontrolledViewMode, uncontrolledSetViewMode] : [controlledViewMode, controlledSetViewMode];
  const [html, setHtml] = React.useState(null);
  const safeSetHtml = useSafeAsyncCallback.useSafeAsyncCallback(setHtml);
  const previewStale = React.useRef(true);
  React.useEffect(() => {
    previewStale.current = true;
  }, [value]);

  const loadPreview = async () => {
    if (!previewStale.current) return;
    previewStale.current = false; // set to false before the preview is rendered to prevent multiple concurrent calls

    safeSetHtml(null);
    safeSetHtml(await onRenderPreview(value));
  };

  React.useEffect(() => {
    // we have to be careful here - loading preview sets state which causes a render which can cause an infinite loop,
    // however that should be prevented by previewStale.current being set immediately in loadPreview
    if (view === 'preview' && previewStale.current) loadPreview();
  });
  const inputRef = React.useRef(null);
  React.useImperativeHandle(ref, () => ({
    focus: opts => {
      var _inputRef$current;

      return (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus(opts);
    },
    scrollIntoView: opts => {
      var _containerRef$current;

      return (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.scrollIntoView(opts);
    }
  }));
  const inputHeight = React.useRef(0);
  if (inputRef.current && inputRef.current.offsetHeight) inputHeight.current = inputRef.current.offsetHeight;
  const onInputChange = React.useCallback(e => {
    onChange(e.target.value);
  }, [onChange]);
  const emitChange = useSyntheticChange.useSyntheticChange({
    inputRef,
    fallbackEventHandler: onInputChange
  });
  const fileHandler = _useFileHandling.useFileHandling({
    emitChange,
    value,
    inputRef,
    disabled,
    onUploadFile,
    acceptedFileTypes
  });
  const listEditor = _useListEditing.useListEditing({
    emitChange
  });
  const indenter = _useIndenting.useIndenting({
    emitChange
  });
  const formattingToolsRef = React.useRef(null); // use state instead of ref since we need to recalculate when the element mounts

  const containerRef = React.useRef(null);
  const [condensed, setCondensed] = React.useState(false);
  const onResize = React.useCallback( // it's fine that this isn't debounced because calling setCondensed with the current value will not trigger a render
  () => setCondensed(containerRef.current !== null && containerRef.current.clientWidth < CONDENSED_WIDTH_THRESHOLD), []);
  useResizeObserver.useResizeObserver(onResize, containerRef); // the ID must be unique for each instance while remaining constant across renders

  const id = ssr.useSSRSafeId();
  const descriptionId = `${id}-description`;
  const savedRepliesRef = React.useRef(null);

  const onSelectSavedReply = reply => {
    // need to wait a tick to run after the selectmenu finishes closing
    requestAnimationFrame(() => emitChange(reply.content));
  };

  const savedRepliesContext = savedReplies ? {
    savedReplies,
    onSelect: onSelectSavedReply,
    ref: savedRepliesRef
  } : null;
  const inputCompositionProps = useIgnoreKeyboardActionsWhileComposing.useIgnoreKeyboardActionsWhileComposing(e => {
    const format = formattingToolsRef.current;
    if (disabled) return;

    if (e.ctrlKey && e.key === '.') {
      var _savedRepliesRef$curr;

      // saved replies are always Control, even on Mac
      (_savedRepliesRef$curr = savedRepliesRef.current) === null || _savedRepliesRef$curr === void 0 ? void 0 : _savedRepliesRef$curr.openMenu();
      e.preventDefault();
      e.stopPropagation();
    } else if (utils.isModifierKey(e)) {
      if (e.key === 'Enter') onPrimaryAction === null || onPrimaryAction === void 0 ? void 0 : onPrimaryAction();else if (e.key === 'b') format === null || format === void 0 ? void 0 : format.bold();else if (e.key === 'i') format === null || format === void 0 ? void 0 : format.italic();else if (e.shiftKey && e.key === '.') format === null || format === void 0 ? void 0 : format.quote();else if (e.key === 'e') format === null || format === void 0 ? void 0 : format.code();else if (e.key === 'k') format === null || format === void 0 ? void 0 : format.link();else if (e.key === '8') format === null || format === void 0 ? void 0 : format.unorderedList();else if (e.shiftKey && e.key === '7') format === null || format === void 0 ? void 0 : format.orderedList();else if (e.shiftKey && e.key === 'l') format === null || format === void 0 ? void 0 : format.taskList();else if (e.shiftKey && e.key === 'p') setView === null || setView === void 0 ? void 0 : setView('preview');else return;
      e.preventDefault();
      e.stopPropagation();
    } else {
      listEditor.onKeyDown(e);
      indenter.onKeyDown(e);
    }
  });
  React.useEffect(() => {
    if (view === 'preview') {
      editorsInPreviewMode.push(id);

      const handler = e => {
        if (!e.defaultPrevented && editorsInPreviewMode.at(-1) === id && utils.isModifierKey(e) && e.shiftKey && e.key === 'p') {
          setView === null || setView === void 0 ? void 0 : setView('edit');
          setTimeout(() => {
            var _inputRef$current2;

            return (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.focus();
          });
          e.preventDefault();
        }
      };

      document.addEventListener('keydown', handler);
      return () => {
        document.removeEventListener('keydown', handler); // Performing the filtering in the cleanup callback allows it to happen also when
        // the user clicks the toggle button, not just on keyboard shortcut

        editorsInPreviewMode = editorsInPreviewMode.filter(id_ => id_ !== id);
      };
    }
  }, [view, setView, id]); // If we don't memoize the context object, every child will rerender on every render even if memoized

  const context = React.useMemo(() => ({
    disabled,
    formattingToolsRef,
    condensed,
    required
  }), [disabled, formattingToolsRef, condensed, required]); // We are using MarkdownEditorContext instead of the built-in Slots context because Slots' context is not typesafe

  return /*#__PURE__*/React__default["default"].createElement(Slots, {
    context: {}
  }, slots => {
    var _slots$Toolbar, _fileHandler$isDragge, _fileHandler$isDragge2, _fileHandler$clickTar;

    return /*#__PURE__*/React__default["default"].createElement(_MarkdownEditorContext.MarkdownEditorContext.Provider, {
      value: context
    }, /*#__PURE__*/React__default["default"].createElement("fieldset", {
      "aria-disabled": disabled
      /* if we set disabled={true}, we can't enable the buttons that should be enabled */
      ,
      "aria-describedby": describedBy ? `${descriptionId} ${describedBy}` : descriptionId,
      style: {
        appearance: 'none',
        border: 'none'
      }
    }, /*#__PURE__*/React__default["default"].createElement(_FormattingTools.FormattingTools, {
      ref: formattingToolsRef,
      forInputId: id
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        display: 'none'
      }
    }, children), slots.Label, /*#__PURE__*/React__default["default"].createElement(Box, {
      sx: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderColor: 'border.default',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 2,
        p: 2,
        height: fullHeight ? '100%' : undefined,
        minInlineSize: 'auto',
        bg: 'canvas.default',
        color: disabled ? 'fg.subtle' : 'fg.default',
        ...sx
      },
      ref: containerRef
    }, /*#__PURE__*/React__default["default"].createElement(_VisuallyHidden, {
      id: descriptionId,
      "aria-live": "polite"
    }, "Markdown input:", view === 'preview' ? ' preview mode selected.' : ' edit mode selected.'), /*#__PURE__*/React__default["default"].createElement(Box, {
      sx: {
        display: 'flex',
        pb: 2,
        gap: 2,
        justifyContent: 'space-between'
      },
      as: "header"
    }, /*#__PURE__*/React__default["default"].createElement(_ViewSwitch.ViewSwitch, {
      selectedView: view,
      onViewSelect: setView,
      disabled: (fileHandler === null || fileHandler === void 0 ? void 0 : fileHandler.uploadProgress) !== undefined,
      onLoadPreview: loadPreview
    }), /*#__PURE__*/React__default["default"].createElement(Box, {
      sx: {
        display: 'flex'
      }
    }, /*#__PURE__*/React__default["default"].createElement(_SavedReplies.SavedRepliesContext.Provider, {
      value: savedRepliesContext
    }, view === 'edit' && ((_slots$Toolbar = slots.Toolbar) !== null && _slots$Toolbar !== void 0 ? _slots$Toolbar : /*#__PURE__*/React__default["default"].createElement(Toolbar.CoreToolbar, null, /*#__PURE__*/React__default["default"].createElement(Toolbar.DefaultToolbarButtons, null)))))), /*#__PURE__*/React__default["default"].createElement(_MarkdownInput.MarkdownInput, _extends({
      value: value,
      onChange: onInputChange,
      emojiSuggestions: emojiSuggestions,
      mentionSuggestions: mentionSuggestions,
      referenceSuggestions: referenceSuggestions,
      disabled: disabled,
      placeholder: placeholder,
      id: id,
      maxLength: maxLength,
      ref: inputRef,
      fullHeight: fullHeight,
      isDraggedOver: (_fileHandler$isDragge = fileHandler === null || fileHandler === void 0 ? void 0 : fileHandler.isDraggedOver) !== null && _fileHandler$isDragge !== void 0 ? _fileHandler$isDragge : false,
      minHeightLines: minHeightLines,
      maxHeightLines: maxHeightLines,
      visible: view === 'edit',
      monospace: monospace,
      required: required,
      name: name,
      pasteUrlsAsPlainText: pasteUrlsAsPlainText
    }, inputCompositionProps, fileHandler === null || fileHandler === void 0 ? void 0 : fileHandler.pasteTargetProps, fileHandler === null || fileHandler === void 0 ? void 0 : fileHandler.dropTargetProps)), view === 'preview' && /*#__PURE__*/React__default["default"].createElement(Box, {
      sx: {
        p: 1,
        overflow: 'auto',
        height: fullHeight ? '100%' : undefined,
        minHeight: inputHeight.current,
        boxSizing: 'border-box'
      },
      "aria-live": "polite",
      tabIndex: -1
    }, /*#__PURE__*/React__default["default"].createElement("h2", {
      style: a11yOnlyStyle
    }, "Rendered Markdown Preview"), /*#__PURE__*/React__default["default"].createElement(MarkdownViewer, {
      dangerousRenderedHTML: {
        __html: html || 'Nothing to preview'
      },
      loading: html === null,
      openLinksInNewTab: true
    })), /*#__PURE__*/React__default["default"].createElement(_Footer.Footer, {
      actionButtons: slots.Actions,
      fileDraggedOver: (_fileHandler$isDragge2 = fileHandler === null || fileHandler === void 0 ? void 0 : fileHandler.isDraggedOver) !== null && _fileHandler$isDragge2 !== void 0 ? _fileHandler$isDragge2 : false,
      fileUploadProgress: fileHandler === null || fileHandler === void 0 ? void 0 : fileHandler.uploadProgress,
      uploadButtonProps: (_fileHandler$clickTar = fileHandler === null || fileHandler === void 0 ? void 0 : fileHandler.clickTargetProps) !== null && _fileHandler$clickTar !== void 0 ? _fileHandler$clickTar : null,
      errorMessage: fileHandler === null || fileHandler === void 0 ? void 0 : fileHandler.errorMessage,
      previewMode: view === 'preview'
    }))));
  });
});
var _MarkdownEditor = MarkdownEditor;

exports.MarkdownEditorSlot = MarkdownEditorSlot;
exports["default"] = _MarkdownEditor;
