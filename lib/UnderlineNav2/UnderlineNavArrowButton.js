'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var IconButton = require('../Button/IconButton.js');
var octiconsReact = require('@primer/octicons-react');
var styles = require('./styles.js');
var UnderlineNavContext = require('./UnderlineNavContext.js');
var Box = require('../Box.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const ArrowButton = ({
  scrollValue,
  type,
  show,
  onScrollWithButton,
  'aria-label': ariaLabel
}) => {
  const leftBtnRef = React__default["default"].useRef(null);
  const rightBtnRef = React__default["default"].useRef(null);
  const {
    theme
  } = React.useContext(UnderlineNavContext.UnderlineNavContext);
  const direction = type === 'left' ? -1 : 1;
  const ARROW_BTN_WIDTH = 44; // Min touch target size is 44px
  // re-trigger focus on the button with aria-disabled=true when it becomes hidden to communicate to screen readers that the button is no longer available

  React__default["default"].useEffect(() => {
    const currentBtn = type === 'left' ? leftBtnRef.current : rightBtnRef.current;

    if ((currentBtn === null || currentBtn === void 0 ? void 0 : currentBtn.getAttribute('aria-disabled')) === 'true') {
      currentBtn.focus();
    } else {
      // eslint-disable-next-line github/no-blur
      currentBtn === null || currentBtn === void 0 ? void 0 : currentBtn.blur();
    }
  }, [show, type]);
  let translateX = 0;
  let display = 'flex'; // Determine the translateX value to transform for the slide in/out effect

  if (scrollValue === 0) {
    // If the scrollValue is 0, the buttons should be hidden
    translateX = ARROW_BTN_WIDTH * direction; // This is mainly needed for the right arrow button. Because hiding translateX value for it is positive (44px) and this positive value was causing button to be visibly overflowed rathan than hiding.

    display = 'none';
  } else if (scrollValue <= ARROW_BTN_WIDTH) translateX = (ARROW_BTN_WIDTH - scrollValue) * direction;else translateX = 0;

  return /*#__PURE__*/React__default["default"].createElement(Box, {
    sx: styles.btnWrapperStyles(theme, type, show, translateX, display)
  }, /*#__PURE__*/React__default["default"].createElement(IconButton.IconButton, {
    tabIndex: show ? 0 : -1,
    ref: type === 'left' ? leftBtnRef : rightBtnRef,
    "aria-label": `Scroll ${ariaLabel} navigation ${type}`,
    onClick: e => onScrollWithButton(e, direction),
    icon: type === 'left' ? octiconsReact.ChevronLeftIcon : octiconsReact.ChevronRightIcon,
    sx: styles.getArrowBtnStyles(theme, type),
    "aria-disabled": !show
  }));
};

ArrowButton.displayName = "ArrowButton";

exports.ArrowButton = ArrowButton;
