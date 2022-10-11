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

exports.useMedia = useMedia;
