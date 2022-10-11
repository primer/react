import { subscribe } from '@github/paste-markdown';
import React, { forwardRef, useState, useMemo, useRef, useEffect } from 'react';
import { useDynamicTextareaHeight } from '../hooks/useDynamicTextareaHeight.js';
import InlineAutocomplete from '../InlineAutocomplete/InlineAutocomplete.js';
import Textarea from '../../Textarea.js';
import { useEmojiSuggestions } from './suggestions/_useEmojiSuggestions.js';
import { useMentionSuggestions } from './suggestions/_useMentionSuggestions.js';
import { useReferenceSuggestions } from './suggestions/_useReferenceSuggestions.js';
import { useRefObjectAsForwardedRef } from '../../hooks/useRefObjectAsForwardedRef.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const MarkdownInput = /*#__PURE__*/forwardRef(({
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
  const [suggestions, setSuggestions] = useState(null);
  const {
    trigger: emojiTrigger,
    calculateSuggestions: calculateEmojiSuggestions
  } = useEmojiSuggestions(emojiSuggestions !== null && emojiSuggestions !== void 0 ? emojiSuggestions : []);
  const {
    trigger: mentionsTrigger,
    calculateSuggestions: calculateMentionSuggestions
  } = useMentionSuggestions(mentionSuggestions !== null && mentionSuggestions !== void 0 ? mentionSuggestions : []);
  const {
    trigger: referencesTrigger,
    calculateSuggestions: calculateReferenceSuggestions
  } = useReferenceSuggestions(referenceSuggestions !== null && referenceSuggestions !== void 0 ? referenceSuggestions : []);
  const triggers = useMemo(() => [mentionsTrigger, referencesTrigger, emojiTrigger], [mentionsTrigger, referencesTrigger, emojiTrigger]);

  const onShowSuggestions = event => {
    if (event.trigger.triggerChar === emojiTrigger.triggerChar) {
      setSuggestions(calculateEmojiSuggestions(event.query));
    } else if (event.trigger.triggerChar === mentionsTrigger.triggerChar) {
      setSuggestions(calculateMentionSuggestions(event.query));
    } else if (event.trigger.triggerChar === referencesTrigger.triggerChar) {
      setSuggestions(calculateReferenceSuggestions(event.query));
    }
  };

  const ref = useRef(null);
  useRefObjectAsForwardedRef(forwardedRef, ref);
  useEffect(() => {
    const subscription = ref.current && subscribe(ref.current, {
      defaultPlainTextPaste: {
        urlLinks: pasteUrlsAsPlainText
      }
    });
    return subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe;
  }, [pasteUrlsAsPlainText]);
  const dynamicHeightStyles = useDynamicTextareaHeight({
    maxHeightLines,
    minHeightLines,
    element: ref.current,
    value
  });
  const heightStyles = fullHeight ? {} : dynamicHeightStyles;
  return /*#__PURE__*/React.createElement(InlineAutocomplete, {
    triggers: triggers,
    suggestions: suggestions,
    onShowSuggestions: onShowSuggestions,
    onHideSuggestions: () => setSuggestions(null),
    sx: {
      flex: 'auto'
    },
    tabInsertsSuggestions: true
  }, /*#__PURE__*/React.createElement(Textarea, _extends({
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

export { MarkdownInput };
