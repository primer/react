'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var environment = require('../utils/environment.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * `useMedia` will use the given `mediaQueryString` with `matchMedia` to
 * determine if the document matches the media query string.
 *
 * If `MatchMedia` is used as an ancestor, `useMedia` will instead use the
 * value of the media query string, if available
 *
 * @example
 * function Example() {
 *   const coarsePointer = useMedia('(pointer: coarse)');
 *   // ...
 * }
 */

function useMedia(mediaQueryString, defaultState) {
  const features = React.useContext(MatchMediaContext);
  const [matches, setMatches] = React__default["default"].useState(() => {
    if (features[mediaQueryString] !== undefined) {
      return features[mediaQueryString];
    } // Prevent a React hydration mismatch when a default value is provided by not defaulting to window.matchMedia(query).matches.


    if (defaultState !== undefined) {
      return defaultState;
    }

    if (environment.canUseDOM) {
      return window.matchMedia(mediaQueryString).matches;
    } // A default value has not been provided, and you are rendering on the server, warn of a possible hydration mismatch when defaulting to false.

    return false;
  });
  React.useEffect(() => {
    if (features[mediaQueryString] !== undefined) {
      setMatches(features[mediaQueryString]);
    }
  }, [features, mediaQueryString]);
  React.useEffect(() => {
    // If `mediaQueryString` is present in features through `context` defer to
    // the value present instead of checking with matchMedia
    if (features[mediaQueryString] !== undefined) {
      return;
    }

    function listener(event) {
      setMatches(event.matches);
    }

    const mediaQueryList = window.matchMedia(mediaQueryString); // Support fallback to `addListener` for broader browser support
    // @ts-ignore this is not present in Safari <14
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      mediaQueryList.addListener(listener);
    } // Make sure the media query list is in sync with the matches state


    setMatches(mediaQueryList.matches);
    return () => {
      // @ts-ignore this is not present in Safari <14
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (mediaQueryList.addEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [features, mediaQueryString]);
  return matches;
}
// Used to keep track of overrides to specific media query features, this should
// be used for development and demo purposes to emulate specific features if
// unavailable through devtools
const MatchMediaContext = /*#__PURE__*/React.createContext({});
const defaultFeatures = {};
/**
 * Use `MatchMedia` to emulate media conditions by passing in feature
 * queries to the `features` prop. If a component uses `useMedia` with the
 * feature passed in to `MatchMedia` it will force its value to match what is
 * provided to `MatchMedia`
 *
 * This should be used for development and documentation only in situations
 * where devtools cannot emulate this feature
 *
 * @example
 * <MatchMedia features={{ "(pointer: coarse)": true}}>
 *   <Children />
 * </MatchMedia>
 */

function MatchMedia({
  children,
  features = defaultFeatures
}) {
  const value = useShallowObject(features);
  return /*#__PURE__*/React__default["default"].createElement(MatchMediaContext.Provider, {
    value: value
  }, children);
}
MatchMedia.displayName = "MatchMedia";

/**
 * Utility hook to provide a stable identity for a "simple" object which
 * contains only primitive values. This provides a `useMemo`-esque signature
 * without dealing with shallow equality checks in the dependency array.
 *
 * Note (perf): this hook iterates through keys and values of the object if the
 * shallow equality check is false each time the hook is called
 */
function useShallowObject(object) {
  const [value, setValue] = React.useState(object);

  if (value !== object) {
    const match = Object.keys(object).every(key => {
      return object[key] === value[key];
    });

    if (!match) {
      setValue(object);
    }
  }

  return value;
}

exports.MatchMedia = MatchMedia;
exports.useMedia = useMedia;
