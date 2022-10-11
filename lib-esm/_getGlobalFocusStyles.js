import { css } from 'styled-components';
import { get } from './constants.js';

const globalFocusStyle = css(["box-shadow:none;outline:2px solid ", ";"], get('colors.accent.fg'));

const getGlobalFocusStyles = outlineOffset => css(["&:focus:not(:disabled){", ";outline-offset:", ";&:not(:focus-visible){outline:solid 1px transparent;}}&:focus-visible:not(:disabled){", ";outline-offset:", ";}"], globalFocusStyle, typeof outlineOffset === 'undefined' ? '2px' : outlineOffset, globalFocusStyle, typeof outlineOffset === 'undefined' ? '2px' : outlineOffset);

export { getGlobalFocusStyles as default };
