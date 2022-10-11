'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var octiconsReact = require('@primer/octicons-react');
var ssr = require('@react-aria/ssr');
var React = require('react');
var styled = require('styled-components');
var index = require('../ActionList/index.js');
var Box = require('../Box.js');
var StyledOcticon = require('../StyledOcticon.js');
var sx = require('../sx.js');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// NavList

const NavBox = styled__default["default"].nav.withConfig({
  displayName: "NavList__NavBox",
  componentId: "sc-1c8ygf7-0"
})(sx["default"]);
const Root = /*#__PURE__*/React__default["default"].forwardRef(({
  children,
  ...props
}, ref) => {
  return /*#__PURE__*/React__default["default"].createElement(NavBox, _extends({}, props, {
    ref: ref
  }), /*#__PURE__*/React__default["default"].createElement(index.ActionList, null, children));
});
Root.displayName = 'NavList'; // ----------------------------------------------------------------------------
// NavList.Item

const Item = /*#__PURE__*/React__default["default"].forwardRef(({
  'aria-current': ariaCurrent,
  children,
  sx: sxProp = {},
  ...props
}, ref) => {
  const {
    depth
  } = React__default["default"].useContext(SubNavContext); // Get SubNav from children

  const subNav = React__default["default"].Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === SubNav); // Get children without SubNav

  const childrenWithoutSubNav = React__default["default"].Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child) ? child.type !== SubNav : true); // Render ItemWithSubNav if SubNav is present

  if (subNav && /*#__PURE__*/React.isValidElement(subNav) && depth < 1) {
    return /*#__PURE__*/React__default["default"].createElement(ItemWithSubNav, {
      subNav: subNav,
      sx: sxProp
    }, childrenWithoutSubNav);
  }

  return /*#__PURE__*/React__default["default"].createElement(index.ActionList.LinkItem, _extends({
    ref: ref,
    "aria-current": ariaCurrent,
    active: Boolean(ariaCurrent) && ariaCurrent !== 'false',
    sx: merge__default["default"]({
      paddingLeft: depth > 0 ? 5 : null,
      // Indent sub-items
      fontSize: depth > 0 ? 0 : null,
      // Reduce font size of sub-items
      fontWeight: depth > 0 ? 'normal' : null // Sub-items don't get bolded

    }, sxProp)
  }, props), children);
});
Item.displayName = 'NavList.Item'; // ----------------------------------------------------------------------------
// ItemWithSubNav (internal)

const ItemWithSubNavContext = /*#__PURE__*/React__default["default"].createContext({
  buttonId: '',
  subNavId: '',
  isOpen: false
}); // TODO: ref prop
// TODO: Animate open/close transition

function ItemWithSubNav({
  children,
  subNav,
  sx: sxProp = {}
}) {
  const buttonId = ssr.useSSRSafeId();
  const subNavId = ssr.useSSRSafeId();
  const [isOpen, setIsOpen] = React__default["default"].useState(false);
  const subNavRef = React__default["default"].useRef(null);
  const [containsCurrentItem, setContainsCurrentItem] = React__default["default"].useState(false);
  React__default["default"].useLayoutEffect(() => {
    if (subNavRef.current) {
      // Check if SubNav contains current item
      const currentItem = subNavRef.current.querySelector('[aria-current]');

      if (currentItem && currentItem.getAttribute('aria-current') !== 'false') {
        setContainsCurrentItem(true);
        setIsOpen(true);
      }
    }
  }, [subNav]);
  return /*#__PURE__*/React__default["default"].createElement(ItemWithSubNavContext.Provider, {
    value: {
      buttonId,
      subNavId,
      isOpen
    }
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "li",
    "aria-labelledby": buttonId,
    sx: {
      listStyle: 'none'
    }
  }, /*#__PURE__*/React__default["default"].createElement(index.ActionList.Item, {
    as: "button",
    id: buttonId,
    "aria-expanded": isOpen,
    "aria-controls": subNavId // When the subNav is closed, how should we indicated that the subNav contains the current item?
    ,
    active: !isOpen && containsCurrentItem,
    onClick: () => setIsOpen(open => !open),
    sx: merge__default["default"]({
      fontWeight: containsCurrentItem ? 'bold' : null // Parent item is bold if any of it's sub-items are current

    }, sxProp)
  }, children, /*#__PURE__*/React__default["default"].createElement(index.ActionList.TrailingVisual, null, /*#__PURE__*/React__default["default"].createElement(StyledOcticon, {
    icon: octiconsReact.ChevronDownIcon,
    sx: {
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
    }
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    ref: subNavRef
  }, subNav)));
}

ItemWithSubNav.displayName = "ItemWithSubNav";
const SubNavContext = /*#__PURE__*/React__default["default"].createContext({
  depth: 0
}); // TODO: ref prop
// NOTE: SubNav must be a direct child of an Item

const SubNav = ({
  children,
  sx: sxProp = {}
}) => {
  const {
    buttonId,
    subNavId,
    isOpen
  } = React__default["default"].useContext(ItemWithSubNavContext);
  const {
    depth
  } = React__default["default"].useContext(SubNavContext);

  if (!buttonId || !subNavId) {
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav must be a child of a NavList.Item');
  }

  if (depth > 0) {
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav only supports one level of nesting');
    return null;
  }

  return /*#__PURE__*/React__default["default"].createElement(SubNavContext.Provider, {
    value: {
      depth: depth + 1
    }
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
    as: "ul",
    id: subNavId,
    "aria-labelledby": buttonId,
    sx: merge__default["default"]({
      padding: 0,
      margin: 0,
      display: isOpen ? 'block' : 'none'
    }, sxProp)
  }, children));
};

SubNav.displayName = "SubNav";
SubNav.displayName = 'NavList.SubNav'; // ----------------------------------------------------------------------------
// NavList.LeadingVisual

const LeadingVisual = index.ActionList.LeadingVisual;
LeadingVisual.displayName = 'NavList.LeadingVisual'; // ----------------------------------------------------------------------------
// NavList.TrailingVisual

const TrailingVisual = index.ActionList.TrailingVisual;
TrailingVisual.displayName = 'NavList.TrailingVisual'; // ----------------------------------------------------------------------------
// NavList.Divider

const Divider = index.ActionList.Divider;
Divider.displayName = 'NavList.Divider'; // ----------------------------------------------------------------------------
// NavList.Group

const defaultSx = {}; // TODO: ref prop

const Group = ({
  title,
  children,
  sx: sxProp = defaultSx,
  ...props
}) => {
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(index.ActionList.Divider, {
    sx: {
      '&:first-child': {
        display: 'none'
      }
    }
  }), /*#__PURE__*/React__default["default"].createElement(index.ActionList.Group, _extends({}, props, {
    title: title,
    sx: sxProp
  }), children));
};

Group.displayName = 'NavList.Group'; // ----------------------------------------------------------------------------
// Export

const NavList = Object.assign(Root, {
  Item,
  SubNav,
  LeadingVisual,
  TrailingVisual,
  Divider,
  Group
});

exports.NavList = NavList;
