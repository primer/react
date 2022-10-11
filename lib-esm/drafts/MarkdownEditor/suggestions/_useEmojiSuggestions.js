import React from 'react';
import { suggestionsCalculator } from './index.js';
import { ActionList } from '../../../ActionList/index.js';

const trigger = {
  triggerChar: ':',
  keepTriggerCharOnCommit: false
};

const emojiToSugggestion = emoji => ({
  value: emoji.character,
  key: emoji.name,
  // emoji characters may not be unique - ie haircut and haircut_man both have the same emoji codepoint. But names are guarunteed to be unique.
  render: props => /*#__PURE__*/React.createElement(ActionList.Item, props, /*#__PURE__*/React.createElement(ActionList.LeadingVisual, null, emoji.character), emoji.name)
}); // for emojis we don't use a fuzzy search because they are short and easy to accurately search through


const scoreSuggestion = (query, emoji) => {
  const name = emoji.name.toLowerCase();
  const q = query.toLowerCase();
  let score = 0;

  if (name.includes(q)) {
    score += 5;
    if (name.startsWith(q)) score += 5;
  }

  return score;
};

const useEmojiSuggestions = emojis => ({
  calculateSuggestions: suggestionsCalculator(emojis, scoreSuggestion, emojiToSugggestion),
  trigger
});

export { useEmojiSuggestions };
