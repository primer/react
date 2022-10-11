'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pasteMarkdown = require('@github/paste-markdown');
var React = require('react');
var useDynamicTextareaHeight = require('../hooks/useDynamicTextareaHeight.js');
var InlineAutocomplete = require('../InlineAutocomplete/InlineAutocomplete.js');
var Textarea = require('../../Textarea.js');
var _useEmojiSuggestions = require('./suggestions/_useEmojiSuggestions.js');
var _useMentionSuggestions = require('./suggestions/_useMentionSuggestions.js');
var _useReferenceSuggestions = require('./suggestions/_useReferenceSuggestions.js');
var useRefObjectAsForwardedRef = require('../../hooks/useRefObjectAsForwardedRef.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const MarkdownInput = /*#__PURE__*/React.forwardRef(({
  value,
  onChange,
  disabled,
  placeholder,
  id,
  maxLength,
  onKeyDown,
  fullHeight,
  isDraggedOver,
  emojiSuggestions,
  mentionSuggestions,
  referenceSuggestions,
  minHeightLines,
  maxHeightLines,
  visible,
  monospace,
  pasteUrlsAsPlainText,
  ...props
}, forwardedRef) => {
  const [suggestions, setSuggestions] = React.useState(null);
  const {
    trigger: emojiTrigger,
    calculateSuggestions: calculateEmojiSuggestions
  } = _useEmojiSuggestions.useEmojiSuggestions(emojiSuggestions !== null && emojiSuggestions !== void 0 ? emojiSuggestions : []);
  const {
    trigger: mentionsTrigger,
    calculateSuggestions: calculateMentionSuggestions
  } = _useMentionSuggestions.useMentionSuggestions(mentionSuggestions !== null && mentionSuggestions !== void 0 ? mentionSuggestions : []);
  const {
    trigger: referencesTrigger,
    calculateSuggestions: calculateReferenceSuggestions
  } = _useReferenceSuggestions.useReferenceSuggestions(referenceSuggestions !== null && referenceSuggestions !== void 0 ? referenceSuggestions : []);
  const triggers = React.useMemo(() => [mentionsTrigger, referencesTrigger, emojiTrigger], [mentionsTrigger, referencesTrigger, emojiTrigger]);

  const onShowSuggestions = event => {
    if (event.trigger.triggerChar === emojiTrigger.triggerChar) {
      setSuggestions(calculateEmojiSuggestions(event.query));
    } else if (event.trigger.triggerChar === mentionsTrigger.triggerChar) {
      setSuggestions(calculateMentionSuggestions(event.query));
    } else if (event.trigger.triggerChar === referencesTrigger.triggerChar) {
      setSuggestions(calculateReferenceSuggestions(event.query));
    }
  };

  const ref = React.useRef(null);
  useRefObjectAsForwardedRef.useRefObjectAsForwardedRef(forwardedRef, ref);
  React.useEffect(() => {
    const subscription = ref.current && pasteMarkdown.subscribe(ref.current, {
      defaultPlainTextPaste: {
        urlLinks: pasteUrlsAsPlainText
      }
    });
    return subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe;
  }, [pasteUrlsAsPlainText]);
  const dynamicHeightStyles = useDynamicTextareaHeight.useDynamicTextareaHeight({
    maxHeightLines,
    minHeightLines,
    element: ref.current,
    value
  });
  const heightStyles = fullHeight ? {} : dynamicHeightStyles;
  return /*#__PURE__*/React__default["default"].createElement(InlineAutocomplete, {
    triggers: triggers,
    suggestions: suggestions,
    onShowSuggestions: onShowSuggestions,
    onHideSuggestions: () => setSuggestions(null),
    sx: {
      flex: 'auto'
    },
    tabInsertsSuggestions: true
  }, /*#__PURE__*/React__default["default"].createElement(Textarea["default"], _extends({
    id: id,
    ref: ref,
    placeholder: placeholder,
    maxLength: maxLength,
    value: value,
    onKeyDown: onKeyDown,
    disabled: disabled,
    "aria-label": "Markdown value",
    onChange: onChange,
    sx: {
      width: '100%',
      borderStyle: 'none',
      height: fullHeight ? '100%' : undefined,
      boxShadow: isDraggedOver ? 'primer.shadow.focus' : 'none',
      display: visible ? undefined : 'none',
      '& textarea': {
        lineHeight: 1.2,
        resize: fullHeight ? 'none' : 'vertical',
        p: 2,
        fontFamily: monospace ? 'mono' : 'normal',
        ...heightStyles
      }
    }
  }, props)));
});
MarkdownInput.displayName = 'MarkdownInput';

exports.MarkdownInput = MarkdownInput;
