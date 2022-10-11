'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

// Inspired from reach-ui: https://github.com/reach/reach-ui/blob/develop/packages/utils/src/use-force-update.ts
const useForceUpdate = () => {
  const [, rerender] = React__default["default"].useState({});
  return React__default["default"].useCallback(() => rerender({}), []);
};

exports.useForceUpdate = useForceUpdate;
