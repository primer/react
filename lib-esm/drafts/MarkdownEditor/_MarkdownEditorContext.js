import { createContext } from 'react';

const MarkdownEditorContext = /*#__PURE__*/createContext({
  disabled: false,
  condensed: false,
  required: false,
  formattingToolsRef: {
    current: null
  }
});

export { MarkdownEditorContext };
