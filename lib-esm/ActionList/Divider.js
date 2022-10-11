import React from 'react';
import Box from '../Box.js';
import { get } from '../constants.js';
import '@styled-system/css';
import merge from 'deepmerge';

/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */
const Divider = ({
  sx = {}
}) => {
  return /*#__PURE__*/React.createElement(Box, {
    as: "li",
    "aria-hidden": "true",
    sx: merge({
      height: 1,
      backgroundColor: 'actionListItem.inlineDivider',
      marginTop: theme => `calc(${get('space.2')(theme)} - 1px)`,
      marginBottom: 2,
      listStyle: 'none' // hide the ::marker inserted by browser's stylesheet

    }, sx),
    "data-component": "ActionList.Divider"
  });
};
Divider.displayName = "Divider";

export { Divider };
