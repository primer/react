import React from 'react';
import { ThemeProvider as ThemeProvider$2 } from 'styled-components';
import theme from './theme-preval.js';
import merge from 'deepmerge';

const defaultColorMode = 'day';
const defaultDayScheme = 'light';
const defaultNightScheme = 'dark'; // eslint-disable-next-line @typescript-eslint/no-explicit-any

const ThemeContext = /*#__PURE__*/React.createContext({
  setColorMode: () => null,
  setDayScheme: () => null,
  setNightScheme: () => null
}); // inspired from __NEXT_DATA__, we use application/json to avoid CSRF policy with inline scripts

const getServerHandoff = () => {
  try {
    var _document$getElementB;

    const serverData = (_document$getElementB = document.getElementById('__PRIMER_DATA__')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.textContent;
    if (serverData) return JSON.parse(serverData);
  } catch (error) {// if document/element does not exist or JSON is invalid, supress error
  }

  return {};
};

const ThemeProvider = ({
  children,
  ...props
}) => {
  var _ref, _props$theme, _ref2, _props$colorMode, _ref3, _props$dayScheme, _ref4, _props$nightScheme;

  // Get fallback values from parent ThemeProvider (if exists)
  const {
    theme: fallbackTheme,
    colorMode: fallbackColorMode,
    dayScheme: fallbackDayScheme,
    nightScheme: fallbackNightScheme
  } = useTheme(); // Initialize state

  const theme$1 = (_ref = (_props$theme = props.theme) !== null && _props$theme !== void 0 ? _props$theme : fallbackTheme) !== null && _ref !== void 0 ? _ref : theme;
  const {
    resolvedServerColorMode
  } = getServerHandoff();
  const resolvedColorModePassthrough = React.useRef(resolvedServerColorMode);
  const [colorMode, setColorMode] = React.useState((_ref2 = (_props$colorMode = props.colorMode) !== null && _props$colorMode !== void 0 ? _props$colorMode : fallbackColorMode) !== null && _ref2 !== void 0 ? _ref2 : defaultColorMode);
  const [dayScheme, setDayScheme] = React.useState((_ref3 = (_props$dayScheme = props.dayScheme) !== null && _props$dayScheme !== void 0 ? _props$dayScheme : fallbackDayScheme) !== null && _ref3 !== void 0 ? _ref3 : defaultDayScheme);
  const [nightScheme, setNightScheme] = React.useState((_ref4 = (_props$nightScheme = props.nightScheme) !== null && _props$nightScheme !== void 0 ? _props$nightScheme : fallbackNightScheme) !== null && _ref4 !== void 0 ? _ref4 : defaultNightScheme);
  const systemColorMode = useSystemColorMode();
  const resolvedColorMode = resolvedColorModePassthrough.current || resolveColorMode(colorMode, systemColorMode);
  const colorScheme = chooseColorScheme(resolvedColorMode, dayScheme, nightScheme);
  const {
    resolvedTheme,
    resolvedColorScheme
  } = React.useMemo(() => applyColorScheme(theme$1, colorScheme), [theme$1, colorScheme]); // this effect will only run on client

  React.useEffect(function updateColorModeAfterServerPassthrough() {
    const resolvedColorModeOnClient = resolveColorMode(colorMode, systemColorMode);

    if (resolvedColorModePassthrough.current) {
      // if the resolved color mode passed on from the server is not the resolved color mode on client, change it!
      if (resolvedColorModePassthrough.current !== resolvedColorModeOnClient) {
        window.setTimeout(() => {
          // override colorMode to whatever is resolved on the client to get a re-render
          setColorMode(resolvedColorModeOnClient); // immediately after that, set the colorMode to what the user passed to respond to system color mode changes

          setColorMode(colorMode);
        });
      }

      resolvedColorModePassthrough.current = null;
    }
  }, [colorMode, systemColorMode]); // Update state if props change

  React.useEffect(() => {
    var _ref5, _props$colorMode2;

    setColorMode((_ref5 = (_props$colorMode2 = props.colorMode) !== null && _props$colorMode2 !== void 0 ? _props$colorMode2 : fallbackColorMode) !== null && _ref5 !== void 0 ? _ref5 : defaultColorMode);
  }, [props.colorMode, fallbackColorMode]);
  React.useEffect(() => {
    var _ref6, _props$dayScheme2;

    setDayScheme((_ref6 = (_props$dayScheme2 = props.dayScheme) !== null && _props$dayScheme2 !== void 0 ? _props$dayScheme2 : fallbackDayScheme) !== null && _ref6 !== void 0 ? _ref6 : defaultDayScheme);
  }, [props.dayScheme, fallbackDayScheme]);
  React.useEffect(() => {
    var _ref7, _props$nightScheme2;

    setNightScheme((_ref7 = (_props$nightScheme2 = props.nightScheme) !== null && _props$nightScheme2 !== void 0 ? _props$nightScheme2 : fallbackNightScheme) !== null && _ref7 !== void 0 ? _ref7 : defaultNightScheme);
  }, [props.nightScheme, fallbackNightScheme]);
  return /*#__PURE__*/React.createElement(ThemeContext.Provider, {
    value: {
      theme: resolvedTheme,
      colorScheme,
      colorMode,
      resolvedColorMode,
      resolvedColorScheme,
      dayScheme,
      nightScheme,
      setColorMode,
      setDayScheme,
      setNightScheme
    }
  }, /*#__PURE__*/React.createElement(ThemeProvider$2, {
    theme: resolvedTheme
  }, children, props.preventSSRMismatch ? /*#__PURE__*/React.createElement("script", {
    type: "application/json",
    id: "__PRIMER_DATA__",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify({
        resolvedServerColorMode: resolvedColorMode
      })
    }
  }) : null));
};
ThemeProvider.displayName = "ThemeProvider";
function useTheme() {
  return React.useContext(ThemeContext);
}
function useColorSchemeVar(values, fallback) {
  var _values$colorScheme;

  const {
    colorScheme = ''
  } = useTheme();
  return (_values$colorScheme = values[colorScheme]) !== null && _values$colorScheme !== void 0 ? _values$colorScheme : fallback;
}

function useSystemColorMode() {
  const [systemColorMode, setSystemColorMode] = React.useState(getSystemColorMode);
  React.useEffect(() => {
    var _window, _window$matchMedia;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const media = (_window = window) === null || _window === void 0 ? void 0 : (_window$matchMedia = _window.matchMedia) === null || _window$matchMedia === void 0 ? void 0 : _window$matchMedia.call(_window, '(prefers-color-scheme: dark)');

    function handleChange(event) {
      const isNight = event.matches;
      setSystemColorMode(isNight ? 'night' : 'day');
    } // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition


    if (media) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (media.addEventListener !== undefined) {
        media.addEventListener('change', handleChange);
        return function cleanup() {
          media.removeEventListener('change', handleChange);
        };
      } // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      else if (media.addListener !== undefined) {
        media.addListener(handleChange);
        return function cleanup() {
          media.removeListener(handleChange);
        };
      }
    }
  }, []);
  return systemColorMode;
}

function getSystemColorMode() {
  var _window$matchMedia2, _window2, _window$matchMedia2$c;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof window !== 'undefined' && (_window$matchMedia2 = (_window2 = window).matchMedia) !== null && _window$matchMedia2 !== void 0 && (_window$matchMedia2$c = _window$matchMedia2.call(_window2, '(prefers-color-scheme: dark)')) !== null && _window$matchMedia2$c !== void 0 && _window$matchMedia2$c.matches) {
    return 'night';
  }

  return 'day';
}

function resolveColorMode(colorMode, systemColorMode) {
  switch (colorMode) {
    case 'auto':
      return systemColorMode;

    default:
      return colorMode;
  }
}

function chooseColorScheme(colorMode, dayScheme, nightScheme) {
  switch (colorMode) {
    case 'day':
    case 'light':
      return dayScheme;

    case 'dark':
    case 'night':
      return nightScheme;
  }
}

function applyColorScheme(theme, colorScheme) {
  if (!theme.colorSchemes) {
    return {
      resolvedTheme: theme,
      resolvedColorScheme: undefined
    };
  }

  if (!theme.colorSchemes[colorScheme]) {
    // eslint-disable-next-line no-console
    console.error(`\`${colorScheme}\` scheme not defined in \`theme.colorSchemes\``); // Apply the first defined color scheme

    const defaultColorScheme = Object.keys(theme.colorSchemes)[0];
    return {
      resolvedTheme: merge(theme, theme.colorSchemes[defaultColorScheme]),
      resolvedColorScheme: defaultColorScheme
    };
  }

  return {
    resolvedTheme: merge(theme, theme.colorSchemes[colorScheme]),
    resolvedColorScheme: colorScheme
  };
}

var ThemeProvider$1 = ThemeProvider;

export { ThemeProvider, ThemeProvider$1 as default, useColorSchemeVar, useTheme };
