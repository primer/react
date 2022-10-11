import { themeGet } from '@styled-system/theme-get';
import * as styledSystem from 'styled-system';
import theme from './theme-preval.js';

const {
  get: getKey,
  compose,
  system
} = styledSystem;
const get = key => themeGet(key, getKey(theme, key)); // Common props

const COMMON = compose(styledSystem.space, styledSystem.color, styledSystem.display);
// Typography props
const whiteSpace = system({
  whiteSpace: {
    property: 'whiteSpace' // cssProperty: 'whiteSpace',

  }
});
const TYPOGRAPHY = compose(styledSystem.typography, whiteSpace);
// Border props
compose(styledSystem.border, styledSystem.shadow);

export { COMMON, TYPOGRAPHY, get };
