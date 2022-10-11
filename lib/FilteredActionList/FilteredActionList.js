'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ssr = require('@react-aria/ssr');
var TextInput = require('../TextInput.js');
var Box = require('../Box.js');
var index = require('../deprecated/ActionList/index.js');
var Spinner = require('../Spinner.js');
var useFocusZone = require('../hooks/useFocusZone.js');
var useProvidedStateOrCreate = require('../hooks/useProvidedStateOrCreate.js');
var styled = require('styled-components');
var constants = require('../constants.js');
var useProvidedRefOrCreate = require('../hooks/useProvidedRefOrCreate.js');
var useScrollFlash = require('../hooks/useScrollFlash.js');
var behaviors = require('@primer/behaviors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const menuScrollMargins = {
  startMargin: 0,
  endMargin: 8
};
const StyledHeader = styled__default["default"].div.withConfig({
  displayName: "FilteredActionList__StyledHeader",
  componentId: "sc-1oqgb0s-0"
})(["box-shadow:0 1px 0 ", ";z-index:1;"], constants.get('colors.border.default'));
function FilteredActionList({
  loading = false,
  placeholderText,
  filterValue: externalFilterValue,
  onFilterChange,
  items,
  textInputProps,
  inputRef: providedInputRef,
  sx,
  ...listProps
}) {
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate.useProvidedStateOrCreate(externalFilterValue, undefined, '');
  const onInputChange = React.useCallback(e => {
    const value = e.target.value;
    onFilterChange(value, e);
    setInternalFilterValue(value);
  }, [onFilterChange, setInternalFilterValue]);
  const scrollContainerRef = React.useRef(null);
  const listContainerRef = React.useRef(null);
  const inputRef = useProvidedRefOrCreate.useProvidedRefOrCreate(providedInputRef);
  const activeDescendantRef = React.useRef();
  const listId = ssr.useSSRSafeId();
  const onInputKeyPress = React.useCallback(event => {
    if (event.key === 'Enter' && activeDescendantRef.current) {
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation(); // Forward Enter key press to active descendant so that item gets activated

      const activeDescendantEvent = new KeyboardEvent(event.type, event.nativeEvent);
      activeDescendantRef.current.dispatchEvent(activeDescendantEvent);
    }
  }, [activeDescendantRef]);
  useFocusZone.useFocusZone({
    containerRef: listContainerRef,
    focusOutBehavior: 'wrap',
    focusableElementFilter: element => {
      return !(element instanceof HTMLInputElement);
    },
    activeDescendantFocus: inputRef,
    onActiveDescendantChanged: (current, previous, directlyActivated) => {
      activeDescendantRef.current = current;

      if (current && scrollContainerRef.current && directlyActivated) {
        behaviors.scrollIntoView(current, scrollContainerRef.current, menuScrollMargins);
      }
    }
  }, [// List ref isn't set while loading.  Need to re-bind focus zone when it changes
  loading]);
  React.useEffect(() => {
    // if items changed, we want to instantly move active descendant into view
    if (activeDescendantRef.current && scrollContainerRef.current) {
      behaviors.scrollIntoView(activeDescendantRef.current, scrollContainerRef.current, { ...menuScrollMargins,
        behavior: 'auto'
      });
    }
  }, [items]);
  useScrollFlash(scrollContainerRef);
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    sx: sx
  }, /*#__PURE__*/React__default["default"].createElement(StyledHeader, null, /*#__PURE__*/React__default["default"].createElement(TextInput, _extends({
    ref: inputRef,
    block: true,
    width: "auto",
    color: "fg.default",
    value: filterValue,
    onChange: onInputChange,
    onKeyPress: onInputKeyPress,
    placeholder: placeholderText,
    "aria-label": placeholderText,
    "aria-controls": listId
  }, textInputProps))), /*#__PURE__*/React__default["default"].createElement(Box, {
    ref: scrollContainerRef,
    overflow: "auto"
  }, loading ? /*#__PURE__*/React__default["default"].createElement(Box, {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    pt: 6,
    pb: 7
  }, /*#__PURE__*/React__default["default"].createElement(Spinner, null)) : /*#__PURE__*/React__default["default"].createElement(index.ActionList, _extends({
    ref: listContainerRef,
    items: items
  }, listProps, {
    role: "listbox",
    id: listId
  }))));
}
FilteredActionList.displayName = "FilteredActionList";
FilteredActionList.displayName = 'FilteredActionList';

exports.FilteredActionList = FilteredActionList;
