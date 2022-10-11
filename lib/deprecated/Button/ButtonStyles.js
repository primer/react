'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');

var buttonBaseStyles = styled.css(["position:relative;display:inline-block;padding:6px 16px;font-family:inherit;font-weight:", ";line-height:20px;white-space:nowrap;vertical-align:middle;cursor:pointer;user-select:none;border-radius:", ";appearance:none;text-decoration:none;text-align:center;&:hover{text-decoration:none;}&:focus{outline:none;}&:disabled{cursor:default;}&:disabled svg{opacity:0.6;}"], constants.get('fontWeights.bold'), constants.get('radii.2'));

module.exports = buttonBaseStyles;
