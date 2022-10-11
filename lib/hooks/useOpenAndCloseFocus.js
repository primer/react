'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var utils = require('@primer/behaviors/utils');

function useOpenAndCloseFocus({
  initialFocusRef,
  returnFocusRef,
  containerRef,
  preventFocusOnOpen
}) {
  React.useEffect(() => {
    if (preventFocusOnOpen) {
      return;
    }

    const returnRef = returnFocusRef.current;

    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus();
    } else if (containerRef.current) {
      const firstItem = utils.iterateFocusableElements(containerRef.current).next().value;
      firstItem === null || firstItem === void 0 ? void 0 : firstItem.focus();
    }

    return function () {
      returnRef === null || returnRef === void 0 ? void 0 : returnRef.focus();
    };
  }, [initialFocusRef, returnFocusRef, containerRef, preventFocusOnOpen]);
}

exports.useOpenAndCloseFocus = useOpenAndCloseFocus;
