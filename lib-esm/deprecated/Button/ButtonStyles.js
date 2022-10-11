import { css } from 'styled-components';
import { get } from '../../constants.js';

var buttonBaseStyles = css(["position:relative;display:inline-block;padding:6px 16px;font-family:inherit;font-weight:", ";line-height:20px;white-space:nowrap;vertical-align:middle;cursor:pointer;user-select:none;border-radius:", ";appearance:none;text-decoration:none;text-align:center;&:hover{text-decoration:none;}&:focus{outline:none;}&:disabled{cursor:default;}&:disabled svg{opacity:0.6;}"], get('fontWeights.bold'), get('radii.2'));

export { buttonBaseStyles as default };
