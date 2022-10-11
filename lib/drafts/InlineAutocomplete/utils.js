'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

const singleWordTriggerTerminators = new Set([' ', '\n']);
const multiWordTriggerTerminators = new Set(['.', '\n']);

const isWhitespace = char => /\s/.test(char);
/**
 * Calculate whether or not suggestions should be shown based on the given state of the
 * input. If they should be shown, returns the show event.
 */


const calculateSuggestionsQuery = (triggers, text, caretLocation) => {
  // Build backwards from the caret location until the most recent trigger character or terminator
  for (let i = caretLocation - 1, query = '', potentialTriggers = triggers; i >= 0 && potentialTriggers.length > 0; i--) {
    const character = text[i];
    if (singleWordTriggerTerminators.has(character)) potentialTriggers = potentialTriggers.filter(t => t.multiWord);
    if (multiWordTriggerTerminators.has(character)) potentialTriggers = potentialTriggers.filter(t => !t.multiWord);

    for (const trigger of potentialTriggers.filter(t => character === t.triggerChar)) {
      // Trigger chars must always be preceded by whitespace or be the first character in the input,
      // and even a multi-word query cannot start with whitespace
      if ((i === 0 || isWhitespace(text[i - 1])) && !isWhitespace(query[0])) return {
        trigger,
        query
      };
      potentialTriggers = potentialTriggers.filter(t => t !== trigger);
    }

    query = character + query;
  }

  return null;
};
const getSuggestionValue = suggestion => typeof suggestion === 'string' ? suggestion : suggestion.value;
const getSuggestionKey = suggestion => {
  var _suggestion$key;

  return typeof suggestion === 'string' ? suggestion : (_suggestion$key = suggestion.key) !== null && _suggestion$key !== void 0 ? _suggestion$key : suggestion.value;
};
/**
 * Attempts to assert that the child element is of a supported type. This can't be enforced
 * by the type system so it has to be done as a runtime check. This isn't foolproof - a
 * component that forwards a ref to a correct element but does not forward event handlers
 * will not work. But it's the best we can reasonably do.
 */

function requireChildrenToBeInput(child, childRef) {
  React.Children.only(child); // Assert that the child is lonely

  if ( // There is no way to know what type the underlying child is until it mounts, so this
  // will always pass on first render before failing on the second render
  childRef.current && !(childRef.current instanceof HTMLInputElement) && !(childRef.current instanceof HTMLTextAreaElement)) {
    throw new TypeError(`AutocompleteTextarea child must be a component that forwards a ref and props to an <input> or <textarea> element.`);
  }

  return child;
}
/**
 * Combine several event handlers into one. The last handler in the list is called first
 * and no further handlers will be called if `event.preventDefault()` is called.
 */

const augmentHandler = (...handlers) => event => {
  for (const handler of [...handlers].reverse()) {
    if (!event.isDefaultPrevented()) handler === null || handler === void 0 ? void 0 : handler(event);
  }
};

exports.augmentHandler = augmentHandler;
exports.calculateSuggestionsQuery = calculateSuggestionsQuery;
exports.getSuggestionKey = getSuggestionKey;
exports.getSuggestionValue = getSuggestionValue;
exports.requireChildrenToBeInput = requireChildrenToBeInput;
