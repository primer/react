'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

const UnderlineNavContext = /*#__PURE__*/React.createContext({
  theme: {},
  setChildrenWidth: () => null,
  setNoIconChildrenWidth: () => null,
  selectedLink: undefined,
  setSelectedLink: () => null,
  selectedLinkText: '',
  setSelectedLinkText: () => null,
  setFocusedLink: () => null,
  selectEvent: null,
  variant: 'default',
  loadingCounters: false,
  iconsVisible: true
});

exports.UnderlineNavContext = UnderlineNavContext;
