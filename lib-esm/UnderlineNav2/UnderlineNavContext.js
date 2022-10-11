import { createContext } from 'react';

const UnderlineNavContext = /*#__PURE__*/createContext({
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

export { UnderlineNavContext };
