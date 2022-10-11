'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var behaviors = require('@primer/behaviors');
var useProvidedRefOrCreate = require('./useProvidedRefOrCreate.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function useFocusZone(settings = {}, dependencies = []) {
  const containerRef = useProvidedRefOrCreate.useProvidedRefOrCreate(settings.containerRef);
  const useActiveDescendant = !!settings.activeDescendantFocus;
  const passedActiveDescendantRef = typeof settings.activeDescendantFocus === 'boolean' || !settings.activeDescendantFocus ? undefined : settings.activeDescendantFocus;
  const activeDescendantControlRef = useProvidedRefOrCreate.useProvidedRefOrCreate(passedActiveDescendantRef);
  const disabled = settings.disabled;
  const abortController = React__default["default"].useRef();
  React.useEffect(() => {
    if (containerRef.current instanceof HTMLElement && (!useActiveDescendant || activeDescendantControlRef.current instanceof HTMLElement)) {
      if (!disabled) {
        var _activeDescendantCont;

        const vanillaSettings = { ...settings,
          activeDescendantControl: (_activeDescendantCont = activeDescendantControlRef.current) !== null && _activeDescendantCont !== void 0 ? _activeDescendantCont : undefined
        };
        abortController.current = behaviors.focusZone(containerRef.current, vanillaSettings);
        return () => {
          var _abortController$curr;

          (_abortController$curr = abortController.current) === null || _abortController$curr === void 0 ? void 0 : _abortController$curr.abort();
        };
      } else {
        var _abortController$curr2;

        (_abortController$curr2 = abortController.current) === null || _abortController$curr2 === void 0 ? void 0 : _abortController$curr2.abort();
      }
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [disabled, ...dependencies]);
  return {
    containerRef,
    activeDescendantControlRef
  };
}

Object.defineProperty(exports, 'FocusKeys', {
  enumerable: true,
  get: function () { return behaviors.FocusKeys; }
});
exports.useFocusZone = useFocusZone;
