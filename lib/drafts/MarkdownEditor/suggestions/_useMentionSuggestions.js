'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fzy_js = require('fzy.js');
var React = require('react');
var index = require('./index.js');
var index$1 = require('../../../ActionList/index.js');
var Text = require('../../../Text.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** Could be a user, team, or organization - anything that can be mentioned. */

const trigger = {
  triggerChar: '@'
};

const mentionableToSuggestion = mentionable => ({
  value: mentionable.identifier,
  render: props => /*#__PURE__*/React__default["default"].createElement(index$1.ActionList.Item, props, /*#__PURE__*/React__default["default"].createElement(Text, {
    sx: {
      fontWeight: 'bold'
    }
  }, mentionable.identifier), ' ', /*#__PURE__*/React__default["default"].createElement(index$1.ActionList.Description, null, mentionable.description))
});

const scoreSuggestion = (query, mentionable) => fzy_js.score(query, `${mentionable.identifier} ${mentionable.description}`.trim().toLowerCase());

const useMentionSuggestions = mentionables => ({
  calculateSuggestions: index.suggestionsCalculator(mentionables, scoreSuggestion, mentionableToSuggestion),
  trigger
});

exports.useMentionSuggestions = useMentionSuggestions;
