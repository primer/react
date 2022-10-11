'use strict';

var styled = require('styled-components');
var constants = require('./constants.js');

const globalFocusStyle = styled.css(["box-shadow:none;outline:2px solid ", ";"], constants.get('colors.accent.fg'));

const getGlobalFocusStyles = outlineOffset => styled.css(["&:focus:not(:disabled){", ";outline-offset:", ";&:not(:focus-visible){outline:solid 1px transparent;}}&:focus-visible:not(:disabled){", ";outline-offset:", ";}"], globalFocusStyle, typeof outlineOffset === 'undefined' ? '2px' : outlineOffset, globalFocusStyle, typeof outlineOffset === 'undefined' ? '2px' : outlineOffset);

module.exports = getGlobalFocusStyles;
