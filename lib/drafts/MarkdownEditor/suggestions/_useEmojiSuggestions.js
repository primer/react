'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var index = require('./index.js');
var index$1 = require('../../../ActionList/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const trigger = {
  triggerChar: ':',
  keepTriggerCharOnCommit: false
};

const emojiToSugggestion = emoji => ({
  value: emoji.character,
  key: emoji.name,
  // emoji characters may not be unique - ie haircut and haircut_man both have the same emoji codepoint. But names are guarunteed to be unique.
  render: props => /*#__PURE__*/React__default["default"].createElement(index$1.ActionList.Item, props, /*#__PURE__*/React__default["default"].createElement(index$1.ActionList.LeadingVisual, null, emoji.character), emoji.name)
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
  calculateSuggestions: index.suggestionsCalculator(emojis, scoreSuggestion, emojiToSugggestion),
  trigger
});

exports.useEmojiSuggestions = useEmojiSuggestions;
