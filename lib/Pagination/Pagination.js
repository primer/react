'use strict';

var React = require('react');
var styled = require('styled-components');
var Box = require('../Box.js');
var constants = require('../constants.js');
var sx = require('../sx.js');
var _getGlobalFocusStyles = require('../_getGlobalFocusStyles.js');
var model = require('./model.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Page = styled__default["default"].a.withConfig({
  displayName: "Pagination__Page",
  componentId: "sc-cp45c9-0"
})(["display:inline-block;min-width:32px;padding:5px 10px;font-style:normal;line-height:20px;color:", ";text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;user-select:none;text-decoration:none;margin-right:", ";&:last-child{margin-right:0;}border:", " solid transparent;border-radius:", ";transition:border-color 0.2s cubic-bezier(0.3,0,0.5,1);&:hover,&:focus{text-decoration:none;border-color:", ";outline:0;transition-duration:0.1s;}", ";&:active{border-color:", ";}&[rel='prev'],&[rel='next']{color:", ";}&[aria-current],&[aria-current]:hover{color:", ";background-color:", ";border-color:transparent;}&[aria-disabled],&[aria-disabled]:hover{color:", ";cursor:default;border-color:transparent;}@supports (clip-path:polygon(50% 0,100% 50%,50% 100%)){&[rel='prev']::before,&[rel='next']::after{display:inline-block;width:16px;height:16px;vertical-align:text-bottom;content:'';background-color:currentColor;}&[rel='prev']::before{margin-right:", ";clip-path:polygon( 9.8px 12.8px,8.7px 12.8px,4.5px 8.5px,4.5px 7.5px,8.7px 3.2px,9.8px 4.3px,6.1px 8px,9.8px 11.7px,9.8px 12.8px );}&[rel='next']::after{margin-left:", ";clip-path:polygon( 6.2px 3.2px,7.3px 3.2px,11.5px 7.5px,11.5px 8.5px,7.3px 12.8px,6.2px 11.7px,9.9px 8px,6.2px 4.3px,6.2px 3.2px );}}"], constants.get('colors.fg.default'), constants.get('space.1'), constants.get('borderWidths.1'), constants.get('radii.2'), constants.get('colors.border.default'), _getGlobalFocusStyles(0), constants.get('colors.border.muted'), constants.get('colors.accent.fg'), constants.get('colors.fg.onEmphasis'), constants.get('colors.accent.emphasis'), constants.get('colors.primer.fg.disabled'), constants.get('space.1'), constants.get('space.1'));

function usePaginationPages({
  theme,
  pageCount,
  currentPage,
  onPageChange,
  hrefBuilder,
  marginPageCount,
  showPages,
  surroundingPageCount
}) {
  const pageChange = React__default["default"].useCallback(n => e => onPageChange(e, n), [onPageChange]);
  const model$1 = React__default["default"].useMemo(() => {
    return model.buildPaginationModel(pageCount, currentPage, !!showPages, marginPageCount, surroundingPageCount);
  }, [pageCount, currentPage, showPages, marginPageCount, surroundingPageCount]);
  const children = React__default["default"].useMemo(() => {
    return model$1.map(page => {
      const {
        props,
        key,
        content
      } = model.buildComponentData(page, hrefBuilder, pageChange(page.num));
      return /*#__PURE__*/React__default["default"].createElement(Page, _extends({}, props, {
        key: key,
        theme: theme
      }), content);
    });
  }, [model$1, hrefBuilder, pageChange, theme]);
  return children;
}

const PaginationContainer = styled__default["default"].nav.withConfig({
  displayName: "Pagination__PaginationContainer",
  componentId: "sc-cp45c9-1"
})(["margin-top:20px;margin-bottom:15px;text-align:center;", ";"], sx["default"]);

function Pagination({
  theme,
  pageCount,
  currentPage,
  onPageChange = noop,
  hrefBuilder = defaultHrefBuilder,
  marginPageCount = 1,
  showPages = true,
  surroundingPageCount = 2,
  ...rest
}) {
  const pageElements = usePaginationPages({
    theme,
    pageCount,
    currentPage,
    onPageChange,
    hrefBuilder,
    marginPageCount,
    showPages,
    surroundingPageCount
  });
  return /*#__PURE__*/React__default["default"].createElement(PaginationContainer, _extends({
    "aria-label": "Pagination"
  }, rest, {
    theme: theme
  }), /*#__PURE__*/React__default["default"].createElement(Box, {
    display: "inline-block",
    theme: theme
  }, pageElements));
}

Pagination.displayName = "Pagination";

function defaultHrefBuilder(pageNum) {
  return `#${pageNum}`;
}

function noop() {}

Pagination.defaultProps = {
  hrefBuilder: defaultHrefBuilder,
  marginPageCount: 1,
  onPageChange: noop,
  showPages: true,
  surroundingPageCount: 2
};

module.exports = Pagination;
