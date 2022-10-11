'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils = require('@primer/behaviors/utils');

const getSelectedLineRange = textarea => {
  // Subtract one from the caret position so the newline found is not the one _at_ the caret position
  // then add one because we don't want to include the found newline. Also changes -1 (not found) result to 0
  const start = textarea.value.lastIndexOf('\n', textarea.selectionStart - 1) + 1; // activeLineEnd will be the index of the next newline inclusive, which works because slice is last-index exclusive

  let end = textarea.value.indexOf('\n', textarea.selectionEnd);
  if (end === -1) end = textarea.value.length;
  return [start, end];
};
const markdownComment = text => `<!-- ${text.replaceAll('--', '\\-\\-')} -->`;
const markdownLink = (text, url) => `[${text.replaceAll('[', '\\[').replaceAll(']', '\\]')}](${url.replaceAll('(', '\\(').replaceAll(')', '\\)')})`;
const markdownImage = (altText, url) => `!${markdownLink(altText, url)}`;
const isModifierKey = event => utils.isMacOS() ? event.metaKey : event.ctrlKey;

exports.getSelectedLineRange = getSelectedLineRange;
exports.isModifierKey = isModifierKey;
exports.markdownComment = markdownComment;
exports.markdownImage = markdownImage;
exports.markdownLink = markdownLink;
