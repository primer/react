'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Box = require('../Box.js');
var sx = require('../sx.js');
var UnderlineNavContext = require('./UnderlineNavContext.js');
var ActionMenu = require('../ActionMenu.js');
var index = require('../ActionList/index.js');
var useResizeObserver = require('../hooks/useResizeObserver.js');
var useMedia = require('../hooks/useMedia.js');
var behaviors = require('@primer/behaviors');
var CounterLabel = require('../CounterLabel.js');
var ThemeProvider = require('../ThemeProvider.js');
var styles = require('./styles.js');
var UnderlineNavArrowButton = require('./UnderlineNavArrowButton.js');
var styled = require('styled-components');
var LoadingCounter = require('./LoadingCounter.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// When page is loaded, we don't have ref for the more button as it is not on the DOM yet.
// However, we need to calculate number of possible items when the more button present as well. So using the width of the more button as a constant.
const MORE_BTN_WIDTH = 86;
const ARROW_BTN_WIDTH = 36;
const underlineNavScrollMargins = {
  startMargin: ARROW_BTN_WIDTH,
  endMargin: ARROW_BTN_WIDTH,
  direction: 'horizontal',
  behavior: 'smooth'
}; // Needed this because passing a ref using HTMLULListElement to `Box` causes a type error

const NavigationList = styled__default["default"].ul.withConfig({
  displayName: "UnderlineNav__NavigationList",
  componentId: "sc-3wwkh2-0"
})(["", ";"], sx["default"]);
const MoreMenuListItem = styled__default["default"].li.withConfig({
  displayName: "UnderlineNav__MoreMenuListItem",
  componentId: "sc-3wwkh2-1"
})(["display:flex;"]);

const handleArrowBtnsVisibility = (scrollableList, callback) => {
  const {
    scrollLeft,
    scrollWidth,
    clientWidth
  } = scrollableList.current;
  const scrollRight = scrollWidth - scrollLeft - clientWidth;
  const scrollOffsets = {
    scrollLeft,
    scrollRight
  };
  callback(scrollOffsets);
};

const overflowEffect = (navWidth, moreMenuWidth, childArray, childWidthArray, noIconChildWidthArray, isCoarsePointer, updateListAndMenu) => {
  let iconsVisible = true;
  let overflowStyles = {};

  if (childWidthArray.length === 0) {
    updateListAndMenu({
      items: childArray,
      actions: [],
      overflowStyles
    }, iconsVisible);
  }

  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, navWidth);
  const numberOfItemsWithoutIconPossible = calculatePossibleItems(noIconChildWidthArray, navWidth); // We need to take more menu width into account when calculating the number of items possible

  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(noIconChildWidthArray, navWidth, moreMenuWidth || MORE_BTN_WIDTH);
  const items = [];
  const actions = [];

  if (isCoarsePointer) {
    // If it is a coarse pointer, we never show the icons even if they fit into the screen.
    iconsVisible = false;
    items.push(...childArray); // If we have more items than we can fit, we add the scroll styles

    if (childArray.length > numberOfItemsWithoutIconPossible) {
      overflowStyles = styles.scrollStyles;
    }
  } else {
    // For fine pointer devices, first we check if we can fit all the items with icons
    if (childArray.length <= numberOfItemsPossible) {
      items.push(...childArray);
    } else if (childArray.length <= numberOfItemsWithoutIconPossible) {
      // if we can't fit all the items with icons, we check if we can fit all the items without icons
      iconsVisible = false;
      items.push(...childArray);
    } else {
      // if we can't fit all the items without icons, we keep the icons hidden and show the rest in the menu
      iconsVisible = false;
      overflowStyles = styles.moreMenuStyles;

      for (const [index, child] of childArray.entries()) {
        if (index < numberOfItemsPossibleWithMoreMenu) {
          items.push(child); // keeping selected item always visible.
        } else if (child.props.selected) {
          // If selected item's index couldn't make the list, we swap it with the last item in the list.
          const propsectiveAction = items.splice(numberOfItemsPossibleWithMoreMenu - 1, 1, child)[0];
          actions.push(propsectiveAction);
        } else {
          actions.push(child);
        }
      }
    }
  }

  updateListAndMenu({
    items,
    actions,
    overflowStyles
  }, iconsVisible);
};

const getValidChildren = children => {
  return React__default["default"].Children.toArray(children).filter(child => /*#__PURE__*/React__default["default"].isValidElement(child));
};

const calculatePossibleItems = (childWidthArray, navWidth, moreMenuWidth = 0) => {
  const widthToFit = navWidth - moreMenuWidth;
  let breakpoint = childWidthArray.length - 1;
  let sumsOfChildWidth = 0;

  for (const [index, childWidth] of childWidthArray.entries()) {
    if (sumsOfChildWidth > widthToFit) {
      breakpoint = index - 1;
      break;
    } else {
      sumsOfChildWidth = sumsOfChildWidth + childWidth.width;
    }
  }

  return breakpoint;
};

const UnderlineNav = /*#__PURE__*/React.forwardRef(({
  as = 'nav',
  align,
  'aria-label': ariaLabel,
  sx: sxProp = {},
  afterSelect,
  variant = 'default',
  loadingCounters = false,
  children
}, forwardedRef) => {
  const backupRef = React.useRef(null);
  const navRef = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : backupRef;
  const listRef = React.useRef(null);
  const moreMenuRef = React.useRef(null);
  const {
    theme
  } = ThemeProvider.useTheme();

  function getItemsWidth(itemText) {
    var _noIconChildWidthArra;

    return ((_noIconChildWidthArra = noIconChildWidthArray.find(item => item.text === itemText)) === null || _noIconChildWidthArra === void 0 ? void 0 : _noIconChildWidthArra.width) || 0;
  }

  const swapMenuItemWithListItem = (prospectiveListItem, indexOfProspectiveListItem, event, callback) => {
    var _listRef$current;

    // get the selected menu item's width
    const widthToFitIntoList = getItemsWidth(prospectiveListItem.props.children); // Check if there is any empty space on the right side of the list

    const availableSpace = navRef.current.getBoundingClientRect().width - (((_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.getBoundingClientRect().width) || 0); // Calculate how many items need to be pulled in to the menu to make room for the selected menu item
    // I.e. if we need to pull 2 items in (index 0 and index 1), breakpoint (index) will return 1.

    const index = getBreakpointForItemSwapping(widthToFitIntoList, availableSpace);
    const indexToSliceAt = responsiveProps.items.length - 1 - index; // Form the new list of items

    const itemsLeftInList = [...responsiveProps.items].slice(0, indexToSliceAt);
    const updatedItemList = [...itemsLeftInList, prospectiveListItem]; // Form the new menu items

    const itemsToAddToMenu = [...responsiveProps.items].slice(indexToSliceAt);
    const updatedMenuItems = [...actions]; // Add itemsToAddToMenu array's items to the menu at the index of the prospectiveListItem and remove 1 count of items (prospectiveListItem)

    updatedMenuItems.splice(indexOfProspectiveListItem, 1, ...itemsToAddToMenu);
    setSelectedLinkText(prospectiveListItem.props.children);
    callback({
      items: updatedItemList,
      actions: updatedMenuItems,
      overflowStyles: responsiveProps.overflowStyles
    }, false);
  }; // How many items do we need to pull in to the menu to make room for the selected menu item.


  function getBreakpointForItemSwapping(widthToFitIntoList, availableSpace) {
    let widthToSwap = 0;
    let breakpoint = 0;

    for (const [index, item] of [...responsiveProps.items].reverse().entries()) {
      widthToSwap += getItemsWidth(item.props.children);

      if (widthToFitIntoList < widthToSwap + availableSpace) {
        breakpoint = index;
        break;
      }
    }

    return breakpoint;
  }

  const isCoarsePointer = useMedia.useMedia('(pointer: coarse)');
  const [selectedLink, setSelectedLink] = React.useState(undefined);
  const [focusedLink, setFocusedLink] = React.useState(null); // selectedLinkText is needed to be able set the selected menu item as selectedLink.
  // This is needed because setSelectedLink only accepts ref but at the time of setting selected menu item as selectedLink, its ref as a list item is not available

  const [selectedLinkText, setSelectedLinkText] = React.useState(''); // Capture the mouse/keyboard event when a menu item is selected so that we can use it to fire the onSelect callback after the menu item is swapped with the list item

  const [selectEvent, setSelectEvent] = React.useState(null);
  const [iconsVisible, setIconsVisible] = React.useState(true);
  const [scrollValues, setScrollValues] = React.useState({
    scrollLeft: 0,
    scrollRight: 0
  });

  const afterSelectHandler = event => {
    if (!event.defaultPrevented) {
      if (typeof afterSelect === 'function') afterSelect(event);
    }
  };

  const [responsiveProps, setResponsiveProps] = React.useState({
    items: getValidChildren(children),
    actions: [],
    overflowStyles: {}
  });
  const updateListAndMenu = React.useCallback((props, displayIcons) => {
    setResponsiveProps(props);
    setIconsVisible(displayIcons);
  }, []);
  const updateOffsetValues = React.useCallback(scrollOffsets => {
    setScrollValues(scrollOffsets);
  }, []);
  const scrollOnList = React.useCallback(() => {
    handleArrowBtnsVisibility(listRef, updateOffsetValues);
  }, [updateOffsetValues]);

  const onScrollWithButton = (event, direction) => {
    if (!listRef.current) return;
    const ScrollAmount = direction * 200;
    listRef.current.scrollBy({
      left: ScrollAmount,
      top: 0,
      behavior: 'smooth'
    });
  };

  const actions = responsiveProps.actions;
  const [childWidthArray, setChildWidthArray] = React.useState([]);
  const setChildrenWidth = React.useCallback(size => {
    setChildWidthArray(arr => {
      const newArr = [...arr, size];
      return newArr;
    });
  }, []);
  const [noIconChildWidthArray, setNoIconChildWidthArray] = React.useState([]);
  const setNoIconChildrenWidth = React.useCallback(size => {
    setNoIconChildWidthArray(arr => {
      const newArr = [...arr, size];
      return newArr;
    });
  }, []);
  useResizeObserver.useResizeObserver(resizeObserverEntries => {
    var _moreMenuRef$current$, _moreMenuRef$current;

    const childArray = getValidChildren(children);
    const navWidth = resizeObserverEntries[0].contentRect.width;
    const moreMenuWidth = (_moreMenuRef$current$ = (_moreMenuRef$current = moreMenuRef.current) === null || _moreMenuRef$current === void 0 ? void 0 : _moreMenuRef$current.getBoundingClientRect().width) !== null && _moreMenuRef$current$ !== void 0 ? _moreMenuRef$current$ : 0;
    overflowEffect(navWidth, moreMenuWidth, childArray, childWidthArray, noIconChildWidthArray, isCoarsePointer, updateListAndMenu);
    handleArrowBtnsVisibility(listRef, updateOffsetValues);
  }, navRef);
  React.useEffect(() => {
    const listEl = listRef.current; // eslint-disable-next-line github/prefer-observers

    listEl === null || listEl === void 0 ? void 0 : listEl.addEventListener('scroll', scrollOnList);
    return () => listEl === null || listEl === void 0 ? void 0 : listEl.removeEventListener('scroll', scrollOnList);
  }, [scrollOnList]);

  function scrollLinkIntoView(link) {
    if (link.current && listRef.current) {
      behaviors.scrollIntoView(link.current, listRef.current, underlineNavScrollMargins);
      return;
    }
  }

  React.useEffect(() => {
    // scroll the selected link into the view (coarse pointer behaviour)
    (selectedLink === null || selectedLink === void 0 ? void 0 : selectedLink.current) && isCoarsePointer && scrollLinkIntoView(selectedLink);
  }, [selectedLink, isCoarsePointer]);
  React.useEffect(() => {
    // scroll the focused link into the view (coarse pointer behaviour)
    (focusedLink === null || focusedLink === void 0 ? void 0 : focusedLink.current) && isCoarsePointer && scrollLinkIntoView(focusedLink);
  }, [focusedLink, isCoarsePointer]);

  if (!ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology');
  }

  return /*#__PURE__*/React__default["default"].createElement(UnderlineNavContext.UnderlineNavContext.Provider, {
    value: {
      theme,
      setChildrenWidth,
      setNoIconChildrenWidth,
      selectedLink,
      setSelectedLink,
      selectedLinkText,
      setSelectedLinkText,
      setFocusedLink,
      selectEvent,
      afterSelect: afterSelectHandler,
      variant,
      loadingCounters,
      iconsVisible
    }
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
    as: as,
    sx: merge__default["default"](styles.getNavStyles(theme, {
      align
    }), sxProp),
    "aria-label": ariaLabel,
    ref: navRef
  }, isCoarsePointer && /*#__PURE__*/React__default["default"].createElement(UnderlineNavArrowButton.ArrowButton, {
    scrollValue: scrollValues.scrollLeft,
    type: "left",
    show: scrollValues.scrollLeft > 0,
    onScrollWithButton: onScrollWithButton,
    "aria-label": ariaLabel
  }), /*#__PURE__*/React__default["default"].createElement(NavigationList, {
    sx: merge__default["default"](responsiveProps.overflowStyles, styles.ulStyles),
    ref: listRef
  }, responsiveProps.items, actions.length > 0 && /*#__PURE__*/React__default["default"].createElement(MoreMenuListItem, {
    ref: moreMenuRef
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
    sx: styles.getDividerStyle(theme)
  }), /*#__PURE__*/React__default["default"].createElement(ActionMenu.ActionMenu, null, /*#__PURE__*/React__default["default"].createElement(ActionMenu.ActionMenu.Button, {
    sx: styles.moreBtnStyles
  }, "More"), /*#__PURE__*/React__default["default"].createElement(ActionMenu.ActionMenu.Overlay, {
    align: "end"
  }, /*#__PURE__*/React__default["default"].createElement(index.ActionList, {
    selectionVariant: "single"
  }, actions.map((action, index$1) => {
    const {
      children: actionElementChildren,
      ...actionElementProps
    } = action.props;
    return /*#__PURE__*/React__default["default"].createElement(index.ActionList.Item, _extends({
      sx: styles.menuItemStyles,
      key: index$1
    }, actionElementProps, {
      onSelect: event => {
        swapMenuItemWithListItem(action, index$1, event, updateListAndMenu);
        setSelectEvent(event);
      }
    }), /*#__PURE__*/React__default["default"].createElement(Box, {
      as: "span",
      sx: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, actionElementChildren, loadingCounters ? /*#__PURE__*/React__default["default"].createElement(LoadingCounter.LoadingCounter, null) : /*#__PURE__*/React__default["default"].createElement(CounterLabel, null, actionElementProps.counter)));
  })))))), isCoarsePointer && /*#__PURE__*/React__default["default"].createElement(UnderlineNavArrowButton.ArrowButton, {
    scrollValue: scrollValues.scrollRight,
    type: "right",
    show: scrollValues.scrollRight > 0,
    onScrollWithButton: onScrollWithButton,
    "aria-label": ariaLabel
  })));
});

exports.UnderlineNav = UnderlineNav;
