import React from 'react';
import { useSSRSafeId } from '@react-aria/ssr';
import Box from '../Box.js';
import { ListContext } from './List.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GroupContext = /*#__PURE__*/React.createContext({});
const Group = ({
  title,
  variant = 'subtle',
  auxiliaryText,
  selectionVariant,
  role,
  sx = {},
  ...props
}) => {
  const labelId = useSSRSafeId();
  const {
    role: listRole
  } = React.useContext(ListContext);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: "li",
    role: listRole ? 'none' : undefined,
    sx: {
      '&:not(:first-child)': {
        marginTop: 2
      },
      listStyle: 'none',
      // hide the ::marker inserted by browser's stylesheet
      ...sx
    }
  }, props), title && /*#__PURE__*/React.createElement(Header, {
    title: title,
    variant: variant,
    auxiliaryText: auxiliaryText,
    labelId: labelId
  }), /*#__PURE__*/React.createElement(GroupContext.Provider, {
    value: {
      selectionVariant
    }
  }, /*#__PURE__*/React.createElement(Box, {
    as: "ul",
    sx: {
      paddingInlineStart: 0
    },
    "aria-labelledby": title ? labelId : undefined,
    role: role || listRole && 'group'
  }, props.children)));
};
Group.displayName = "Group";

/**
 * Displays the name and description of a `Group`.
 *
 * For visual presentation only. It's hidden from screen readers.
 */
const Header = ({
  variant,
  title,
  auxiliaryText,
  labelId,
  ...props
}) => {
  const {
    variant: listVariant
  } = React.useContext(ListContext);
  const styles = {
    paddingY: '6px',
    paddingX: listVariant === 'full' ? 2 : 3,
    fontSize: 0,
    fontWeight: 'bold',
    color: 'fg.muted',
    ...(variant === 'filled' && {
      backgroundColor: 'canvas.subtle',
      marginX: 0,
      marginBottom: 2,
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: 'neutral.muted'
    })
  };
  return /*#__PURE__*/React.createElement(Box, _extends({
    sx: styles,
    role: "presentation",
    "aria-hidden": "true"
  }, props), /*#__PURE__*/React.createElement("span", {
    id: labelId
  }, title), auxiliaryText && /*#__PURE__*/React.createElement("span", null, auxiliaryText));
};

Header.displayName = "Header";

export { Group, GroupContext };
