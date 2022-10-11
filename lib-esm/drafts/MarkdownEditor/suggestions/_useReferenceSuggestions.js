import React from 'react';
import { suggestionsCalculator } from './index.js';
import { ActionList } from '../../../ActionList/index.js';
import Text from '../../../Text.js';
import { score } from 'fzy.js';

const trigger = {
  triggerChar: '#',
  multiWord: true
};

const referenceToSuggestion = reference => ({
  value: reference.id,
  render: props => /*#__PURE__*/React.createElement(ActionList.Item, props, reference.iconHtml && /*#__PURE__*/React.createElement(ActionList.LeadingVisual, null, /*#__PURE__*/React.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: reference.iconHtml
    }
  })), /*#__PURE__*/React.createElement(Text, {
    sx: {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'block',
      overflow: 'hidden',
      maxWidth: 400
    }
  }, /*#__PURE__*/React.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: reference.titleHtml
    }
  })), ' ', /*#__PURE__*/React.createElement(ActionList.Description, null, "#", reference.id))
});

const scoreSuggestion = (query, reference) => score(query, `${reference.id} ${reference.titleText}`);

const useReferenceSuggestions = references => ({
  calculateSuggestions: query => {
    if (/^\d+\s/.test(query)) return []; // don't return anything if the query is in the form #123 ..., assuming they already have the number they want

    return suggestionsCalculator(references, scoreSuggestion, referenceToSuggestion)(query);
  },
  trigger
});

export { useReferenceSuggestions };
