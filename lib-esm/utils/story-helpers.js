import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { get } from '../constants.js';
import theme from '../theme-preval.js';
import Box from '../Box.js';
import ThemeProvider from '../ThemeProvider.js';
import BaseStyles from '../BaseStyles.js';

// set global theme styles for each story
const GlobalStyle = createGlobalStyle(["body{background-color:", ";color:", ";}"], get('colors.canvas.default'), get('colors.fg.default')); // only remove padding for multi-theme view grid

const GlobalStyleMultiTheme = createGlobalStyle(["body{padding:0 !important;}"]);
const withThemeProvider = (Story, context) => {
  // used for testing ThemeProvider.stories.tsx
  if (context.parameters.disableThemeDecorator) return /*#__PURE__*/React.createElement(Story, context);
  const {
    colorScheme
  } = context.globals;

  if (colorScheme === 'all') {
    return /*#__PURE__*/React.createElement(Box, {
      sx: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
        height: '100vh'
      }
    }, /*#__PURE__*/React.createElement(GlobalStyleMultiTheme, null), Object.keys(theme.colorSchemes).map(scheme => /*#__PURE__*/React.createElement(ThemeProvider, {
      key: scheme,
      colorMode: "day",
      dayScheme: scheme
    }, /*#__PURE__*/React.createElement(BaseStyles, null, /*#__PURE__*/React.createElement(Box, {
      sx: {
        padding: '1rem',
        height: '100%',
        backgroundColor: 'canvas.default',
        color: 'fg.default'
      }
    }, /*#__PURE__*/React.createElement("div", {
      id: `html-addon-root-${scheme}`
    }, /*#__PURE__*/React.createElement(Story, context)))))));
  }

  return /*#__PURE__*/React.createElement(ThemeProvider, {
    colorMode: "day",
    dayScheme: colorScheme
  }, /*#__PURE__*/React.createElement(GlobalStyle, null), /*#__PURE__*/React.createElement(BaseStyles, null, /*#__PURE__*/React.createElement("div", {
    id: "html-addon-root"
  }, /*#__PURE__*/React.createElement(Story, context))));
};
withThemeProvider.displayName = "withThemeProvider";
const toolbarTypes = {
  colorScheme: {
    name: 'Color scheme',
    description: 'Switch color scheme',
    defaultValue: 'light',
    toolbar: {
      icon: 'photo',
      items: [...Object.keys(theme.colorSchemes), 'all'],
      showName: true
    }
  }
};
const inputWrapperArgTypes = {
  block: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  },
  contrast: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  },
  disabled: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  },
  placeholder: {
    defaultValue: '',
    control: {
      type: 'text'
    }
  },
  size: {
    name: 'size (input)',
    // TODO: remove '(input)'
    defaultValue: 'medium',
    options: ['small', 'medium', 'large'],
    control: {
      type: 'radio'
    }
  },
  validationStatus: {
    defaultValue: undefined,
    options: ['error', 'success', 'warning', undefined],
    control: {
      type: 'radio'
    }
  }
};
const textInputArgTypesUnsorted = { ...inputWrapperArgTypes,
  loading: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  },
  loaderPosition: {
    defaultValue: 'auto',
    options: ['auto', 'leading', 'trailing'],
    control: {
      type: 'radio'
    }
  },
  monospace: {
    defaultValue: false,
    control: {
      type: 'boolean'
    }
  }
}; // Alphabetize and optionally categorize the props

const getTextInputArgTypes = category => Object.keys(textInputArgTypesUnsorted).sort().reduce((obj, key) => {
  obj[key] = category ? { // have to do weird type casting so we can spread the object
    ...textInputArgTypesUnsorted[key],
    table: {
      category
    }
  } : textInputArgTypesUnsorted[key];
  return obj;
}, {});
const textInputExcludedControlKeys = ['as', 'icon', 'leadingVisual', 'sx', 'trailingVisual', 'trailingAction'];
const textInputWithTokensArgTypes = {
  hideTokenRemoveButtons: {
    defaultValue: false,
    type: 'boolean',
    table: {
      category: 'TextInputWithTokens props'
    }
  },
  maxHeight: {
    type: 'string',
    defaultValue: 'none',
    description: 'Any valid value for the CSS max-height property',
    table: {
      category: 'TextInputWithTokens props'
    }
  },
  preventTokenWrapping: {
    defaultValue: false,
    type: 'boolean',
    table: {
      category: 'TextInputWithTokens props'
    }
  },
  size: {
    name: 'size (token size)',
    defaultValue: 'xlarge',
    options: ['small', 'medium', 'large', 'xlarge'],
    control: {
      type: 'radio'
    },
    table: {
      category: 'TextInputWithTokens props'
    }
  },
  visibleTokenCount: {
    defaultValue: 999,
    type: 'number',
    table: {
      category: 'TextInputWithTokens props'
    }
  }
};
const formControlArgTypes = {
  // FormControl
  required: {
    defaultValue: false,
    control: {
      type: 'boolean'
    },
    table: {
      category: 'FormControl'
    }
  },
  disabled: {
    defaultValue: false,
    control: {
      type: 'boolean'
    },
    table: {
      category: 'FormControl'
    }
  },
  // FormControl.Label
  labelChildren: {
    name: 'children',
    type: 'string',
    defaultValue: 'Label',
    table: {
      category: 'FormControl.Label'
    }
  },
  visuallyHidden: {
    defaultValue: false,
    type: 'boolean',
    table: {
      category: 'FormControl.Label'
    }
  },
  // FormControl.Caption
  captionChildren: {
    name: 'children',
    type: 'string',
    defaultValue: '',
    table: {
      category: 'FormControl.Caption'
    }
  },
  // FormControl.Validation
  validationChildren: {
    name: 'children',
    type: 'string',
    defaultValue: '',
    table: {
      category: 'FormControl.Validation'
    }
  },
  variant: {
    defaultValue: 'error',
    control: {
      type: 'radio',
      options: ['error', 'success', 'warning']
    },
    table: {
      category: 'FormControl.Validation'
    }
  }
};
const formControlArgTypeKeys = Object.keys(formControlArgTypes);
const formControlArgTypesWithoutValidation = formControlArgTypeKeys.reduce((acc, key) => {
  if (formControlArgTypes[key].table.category !== 'FormControl.Validation') {
    acc[key] = formControlArgTypes[key];
  }

  return acc;
}, {});
const getFormControlArgsByChildComponent = ({
  captionChildren,
  disabled,
  labelChildren,
  required,
  validationChildren,
  variant,
  visuallyHidden
}) => ({
  parentArgs: {
    disabled,
    required
  },
  labelArgs: {
    visuallyHidden,
    children: labelChildren
  },
  captionArgs: {
    children: captionChildren
  },
  validationArgs: {
    children: validationChildren,
    variant
  }
});

export { formControlArgTypes, formControlArgTypesWithoutValidation, getFormControlArgsByChildComponent, getTextInputArgTypes, inputWrapperArgTypes, textInputExcludedControlKeys, textInputWithTokensArgTypes, toolbarTypes, withThemeProvider };
