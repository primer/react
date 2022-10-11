'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ssr = require('@react-aria/ssr');
var Box = require('../Box.js');
var List = require('./List.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const GroupContext = /*#__PURE__*/React__default["default"].createContext({});
const Group = ({
  title,
  variant = 'subtle',
  auxiliaryText,
  selectionVariant,
  role,
  sx = {},
  ...props
}) => {
  const labelId = ssr.useSSRSafeId();
  const {
    role: listRole
  } = React__default["default"].useContext(List.ListContext);
  return /*#__PURE__*/React__default["default"].createElement(Box, _extends({
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
  }, props), title && /*#__PURE__*/React__default["default"].createElement(Header, {
    title: title,
    variant: variant,
    auxiliaryText: auxiliaryText,
    labelId: labelId
  }), /*#__PURE__*/React__default["default"].createElement(GroupContext.Provider, {
    value: {
      selectionVariant
    }
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
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
  } = React__default["default"].useContext(List.ListContext);
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
  return /*#__PURE__*/React__default["default"].createElement(Box, _extends({
    sx: styles,
    role: "presentation",
    "aria-hidden": "true"
  }, props), /*#__PURE__*/React__default["default"].createElement("span", {
    id: labelId
  }, title), auxiliaryText && /*#__PURE__*/React__default["default"].createElement("span", null, auxiliaryText));
};

Header.displayName = "Header";

exports.Group = Group;
exports.GroupContext = GroupContext;
