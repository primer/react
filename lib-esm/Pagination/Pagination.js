import React from 'react';
import styled from 'styled-components';
import Box from '../Box.js';
import { get } from '../constants.js';
import sx from '../sx.js';
import getGlobalFocusStyles from '../_getGlobalFocusStyles.js';
import { buildPaginationModel, buildComponentData } from './model.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Page = styled.a.withConfig({
  displayName: "Pagination__Page",
  componentId: "sc-cp45c9-0"
})(["display:inline-block;min-width:32px;padding:5px 10px;font-style:normal;line-height:20px;color:", ";text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;user-select:none;text-decoration:none;margin-right:", ";&:last-child{margin-right:0;}border:", " solid transparent;border-radius:", ";transition:border-color 0.2s cubic-bezier(0.3,0,0.5,1);&:hover,&:focus{text-decoration:none;border-color:", ";outline:0;transition-duration:0.1s;}", ";&:active{border-color:", ";}&[rel='prev'],&[rel='next']{color:", ";}&[aria-current],&[aria-current]:hover{color:", ";background-color:", ";border-color:transparent;}&[aria-disabled],&[aria-disabled]:hover{color:", ";cursor:default;border-color:transparent;}@supports (clip-path:polygon(50% 0,100% 50%,50% 100%)){&[rel='prev']::before,&[rel='next']::after{display:inline-block;width:16px;height:16px;vertical-align:text-bottom;content:'';background-color:currentColor;}&[rel='prev']::before{margin-right:", ";clip-path:polygon( 9.8px 12.8px,8.7px 12.8px,4.5px 8.5px,4.5px 7.5px,8.7px 3.2px,9.8px 4.3px,6.1px 8px,9.8px 11.7px,9.8px 12.8px );}&[rel='next']::after{margin-left:", ";clip-path:polygon( 6.2px 3.2px,7.3px 3.2px,11.5px 7.5px,11.5px 8.5px,7.3px 12.8px,6.2px 11.7px,9.9px 8px,6.2px 4.3px,6.2px 3.2px );}}"], get('colors.fg.default'), get('space.1'), get('borderWidths.1'), get('radii.2'), get('colors.border.default'), getGlobalFocusStyles(0), get('colors.border.muted'), get('colors.accent.fg'), get('colors.fg.onEmphasis'), get('colors.accent.emphasis'), get('colors.primer.fg.disabled'), get('space.1'), get('space.1'));

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
  const pageChange = React.useCallback(n => e => onPageChange(e, n), [onPageChange]);
  const model = React.useMemo(() => {
    return buildPaginationModel(pageCount, currentPage, !!showPages, marginPageCount, surroundingPageCount);
  }, [pageCount, currentPage, showPages, marginPageCount, surroundingPageCount]);
  const children = React.useMemo(() => {
    return model.map(page => {
      const {
        props,
        key,
        content
      } = buildComponentData(page, hrefBuilder, pageChange(page.num));
      return /*#__PURE__*/React.createElement(Page, _extends({}, props, {
        key: key,
        theme: theme
      }), content);
    });
  }, [model, hrefBuilder, pageChange, theme]);
  return children;
}

const PaginationContainer = styled.nav.withConfig({
  displayName: "Pagination__PaginationContainer",
  componentId: "sc-cp45c9-1"
})(["margin-top:20px;margin-bottom:15px;text-align:center;", ";"], sx);

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
  return /*#__PURE__*/React.createElement(PaginationContainer, _extends({
    "aria-label": "Pagination"
  }, rest, {
    theme: theme
  }), /*#__PURE__*/React.createElement(Box, {
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

export { Pagination as default };
