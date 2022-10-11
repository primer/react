import { score } from 'fzy.js';
import React from 'react';
import { suggestionsCalculator } from './index.js';
import { ActionList } from '../../../ActionList/index.js';
import Text from '../../../Text.js';

/** Could be a user, team, or organization - anything that can be mentioned. */

const trigger = {
  triggerChar: '@'
};

const mentionableToSuggestion = mentionable => ({
  value: mentionable.identifier,
  render: props => /*#__PURE__*/React.createElement(ActionList.Item, props, /*#__PURE__*/React.createElement(Text, {
    sx: {
      fontWeight: 'bold'
    }
  }, mentionable.identifier), ' ', /*#__PURE__*/React.createElement(ActionList.Description, null, mentionable.description))
});

const scoreSuggestion = (query, mentionable) => score(query, `${mentionable.identifier} ${mentionable.description}`.trim().toLowerCase());

const useMentionSuggestions = mentionables => ({
  calculateSuggestions: suggestionsCalculator(mentionables, scoreSuggestion, mentionableToSuggestion),
  trigger
});

export { useMentionSuggestions };
