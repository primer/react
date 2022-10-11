'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var index = require('./index.js');
var index$1 = require('../../../ActionList/index.js');
var Text = require('../../../Text.js');
var fzy_js = require('fzy.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const trigger = {
  triggerChar: '#',
  multiWord: true
};

const referenceToSuggestion = reference => ({
  value: reference.id,
  render: props => /*#__PURE__*/React__default["default"].createElement(index$1.ActionList.Item, props, reference.iconHtml && /*#__PURE__*/React__default["default"].createElement(index$1.ActionList.LeadingVisual, null, /*#__PURE__*/React__default["default"].createElement("span", {
    dangerouslySetInnerHTML: {
      __html: reference.iconHtml
    }
  })), /*#__PURE__*/React__default["default"].createElement(Text, {
    sx: {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'block',
      overflow: 'hidden',
      maxWidth: 400
    }
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    dangerouslySetInnerHTML: {
      __html: reference.titleHtml
    }
  })), ' ', /*#__PURE__*/React__default["default"].createElement(index$1.ActionList.Description, null, "#", reference.id))
});

const scoreSuggestion = (query, reference) => fzy_js.score(query, `${reference.id} ${reference.titleText}`);

const useReferenceSuggestions = references => ({
  calculateSuggestions: query => {
    if (/^\d+\s/.test(query)) return []; // don't return anything if the query is in the form #123 ..., assuming they already have the number they want

    return index.suggestionsCalculator(references, scoreSuggestion, referenceToSuggestion)(query);
  },
  trigger
});

exports.useReferenceSuggestions = useReferenceSuggestions;
