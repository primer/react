import React from 'react';
import { useStickyPaneHeight } from './useStickyPaneHeight.js';
import Box from '../Box.js';
import { isResponsiveValue, useResponsiveValue } from '../hooks/useResponsiveValue.js';
import '../sx.js';
import merge from 'deepmerge';

const REGION_ORDER = {
  header: 0,
  paneStart: 1,
  content: 2,
  paneEnd: 3,
  footer: 4
};
const SPACING_MAP = {
  none: 0,
  condensed: 3,
  normal: [3, null, null, 4]
};
const PageLayoutContext = /*#__PURE__*/React.createContext({
  padding: 'normal',
  rowGap: 'normal',
  columnGap: 'normal'
}); // ----------------------------------------------------------------------------
// PageLayout

const containerWidths = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}; // TODO: refs

const Root = ({
  containerWidth = 'xlarge',
  padding = 'normal',
  rowGap = 'normal',
  columnGap = 'normal',
  children,
  sx = {}
}) => {
  const {
    rootRef,
    enableStickyPane,
    disableStickyPane,
    contentTopRef,
    contentBottomRef,
    stickyPaneHeight
  } = useStickyPaneHeight();
  return /*#__PURE__*/React.createElement(PageLayoutContext.Provider, {
    value: {
      padding,
      rowGap,
      columnGap,
      enableStickyPane,
      disableStickyPane,
      contentTopRef,
      contentBottomRef
    }
  }, /*#__PURE__*/React.createElement(Box, {
    ref: rootRef,
    style: {
      // @ts-ignore TypeScript doesn't know about CSS custom properties
      '--sticky-pane-height': stickyPaneHeight
    },
    sx: merge({
      padding: SPACING_MAP[padding]
    }, sx)
  }, /*#__PURE__*/React.createElement(Box, {
    sx: {
      maxWidth: containerWidths[containerWidth],
      marginX: 'auto',
      display: 'flex',
      flexWrap: 'wrap'
    }
  }, children)));
};

Root.displayName = "Root";
Root.displayName = 'PageLayout'; // ----------------------------------------------------------------------------
// Divider (internal)

const horizontalDividerVariants = {
  none: {
    display: 'none'
  },
  line: {
    display: 'block',
    height: 1,
    backgroundColor: 'border.default'
  },
  filled: {
    display: 'block',
    height: 8,
    backgroundColor: 'canvas.inset',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boxShadow: theme => `inset 0 -1px 0 0 ${theme.colors.border.default}, inset 0 1px 0 0 ${theme.colors.border.default}`
  }
};

function negateSpacingValue(value) {
  if (Array.isArray(value)) {
    // Not using recursion to avoid deeply nested arrays
    return value.map(v => v === null ? null : -v);
  }

  return value === null ? null : -value;
}

const HorizontalDivider = ({
  variant = 'none',
  sx = {}
}) => {
  const {
    padding
  } = React.useContext(PageLayoutContext);
  const responsiveVariant = useResponsiveValue(variant, 'none');
  return /*#__PURE__*/React.createElement(Box // eslint-disable-next-line @typescript-eslint/no-explicit-any
  , {
    sx: theme => merge({
      // Stretch divider to viewport edges on narrow screens
      marginX: negateSpacingValue(SPACING_MAP[padding]),
      ...horizontalDividerVariants[responsiveVariant],
      [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
        marginX: '0 !important'
      }
    }, sx)
  });
};

HorizontalDivider.displayName = "HorizontalDivider";
const verticalDividerVariants = {
  none: {
    display: 'none'
  },
  line: {
    display: 'block',
    width: 1,
    backgroundColor: 'border.default'
  },
  filled: {
    display: 'block',
    width: 8,
    backgroundColor: 'canvas.inset',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boxShadow: theme => `inset -1px 0 0 0 ${theme.colors.border.default}, inset 1px 0 0 0 ${theme.colors.border.default}`
  }
};

const VerticalDivider = ({
  variant = 'none',
  sx = {}
}) => {
  const responsiveVariant = useResponsiveValue(variant, 'none');
  return /*#__PURE__*/React.createElement(Box, {
    sx: merge({
      height: '100%',
      ...verticalDividerVariants[responsiveVariant]
    }, sx)
  });
};

VerticalDivider.displayName = "VerticalDivider";

const Header = ({
  'aria-label': label,
  'aria-labelledby': labelledBy,
  padding = 'none',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  sx = {}
}) => {
  // Combine divider and dividerWhenNarrow for backwards compatibility
  const dividerProp = !isResponsiveValue(divider) && dividerWhenNarrow !== 'inherit' ? {
    regular: divider,
    narrow: dividerWhenNarrow
  } : divider;
  const dividerVariant = useResponsiveValue(dividerProp, 'none');
  const isHidden = useResponsiveValue(hidden, false);
  const {
    rowGap
  } = React.useContext(PageLayoutContext);
  return /*#__PURE__*/React.createElement(Box, {
    as: "header",
    "aria-label": label,
    "aria-labelledby": labelledBy,
    hidden: isHidden,
    sx: merge({
      order: REGION_ORDER.header,
      width: '100%',
      marginBottom: SPACING_MAP[rowGap]
    }, sx)
  }, /*#__PURE__*/React.createElement(Box, {
    sx: {
      padding: SPACING_MAP[padding]
    }
  }, children), /*#__PURE__*/React.createElement(HorizontalDivider, {
    variant: dividerVariant,
    sx: {
      marginTop: SPACING_MAP[rowGap]
    }
  }));
};

Header.displayName = "Header";
Header.displayName = 'PageLayout.Header'; // ----------------------------------------------------------------------------
// PageLayout.Content

// TODO: Account for pane width when centering content
const contentWidths = {
  full: '100%',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
};

const Content = ({
  'aria-label': label,
  'aria-labelledby': labelledBy,
  width = 'full',
  padding = 'none',
  hidden = false,
  children,
  sx = {}
}) => {
  const isHidden = useResponsiveValue(hidden, false);
  const {
    contentTopRef,
    contentBottomRef
  } = React.useContext(PageLayoutContext);
  return /*#__PURE__*/React.createElement(Box, {
    as: "main",
    "aria-label": label,
    "aria-labelledby": labelledBy,
    sx: merge({
      display: isHidden ? 'none' : 'flex',
      flexDirection: 'column',
      order: REGION_ORDER.content,
      // Set flex-basis to 0% to allow flex-grow to control the width of the content region.
      // Without this, the content region could wrap onto a different line
      // than the pane region on wide viewports if its contents are too wide.
      flexBasis: 0,
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 1 // Hack to prevent overflowing content from pushing the pane region to the next line

    }, sx)
  }, /*#__PURE__*/React.createElement(Box, {
    ref: contentTopRef
  }), /*#__PURE__*/React.createElement(Box, {
    sx: {
      width: '100%',
      maxWidth: contentWidths[width],
      marginX: 'auto',
      flexGrow: 1,
      padding: SPACING_MAP[padding]
    }
  }, children), /*#__PURE__*/React.createElement(Box, {
    ref: contentBottomRef
  }));
};

Content.displayName = "Content";
Content.displayName = 'PageLayout.Content'; // ----------------------------------------------------------------------------
// PageLayout.Pane

const panePositions = {
  start: REGION_ORDER.paneStart,
  end: REGION_ORDER.paneEnd
};
const paneWidths = {
  small: ['100%', null, '240px', '256px'],
  medium: ['100%', null, '256px', '296px'],
  large: ['100%', null, '256px', '320px', '336px']
};
const Pane = /*#__PURE__*/React.forwardRef(({
  position: responsivePosition = 'end',
  positionWhenNarrow = 'inherit',
  width = 'medium',
  padding = 'none',
  divider: responsiveDivider = 'none',
  dividerWhenNarrow = 'inherit',
  sticky = false,
  offsetHeader = 0,
  hidden: responsiveHidden = false,
  children,
  sx = {}
}, forwardRef) => {
  // Combine position and positionWhenNarrow for backwards compatibility
  const positionProp = !isResponsiveValue(responsivePosition) && positionWhenNarrow !== 'inherit' ? {
    regular: responsivePosition,
    narrow: positionWhenNarrow
  } : responsivePosition;
  const position = useResponsiveValue(positionProp, 'end'); // Combine divider and dividerWhenNarrow for backwards compatibility

  const dividerProp = !isResponsiveValue(responsiveDivider) && dividerWhenNarrow !== 'inherit' ? {
    regular: responsiveDivider,
    narrow: dividerWhenNarrow
  } : responsiveDivider;
  const dividerVariant = useResponsiveValue(dividerProp, 'none');
  const isHidden = useResponsiveValue(responsiveHidden, false);
  const {
    rowGap,
    columnGap,
    enableStickyPane,
    disableStickyPane
  } = React.useContext(PageLayoutContext);
  React.useEffect(() => {
    if (sticky) {
      enableStickyPane === null || enableStickyPane === void 0 ? void 0 : enableStickyPane(offsetHeader);
    } else {
      disableStickyPane === null || disableStickyPane === void 0 ? void 0 : disableStickyPane();
    }
  }, [sticky, enableStickyPane, disableStickyPane, offsetHeader]);
  return /*#__PURE__*/React.createElement(Box // eslint-disable-next-line @typescript-eslint/no-explicit-any
  , {
    sx: theme => merge({
      // Narrow viewports
      display: isHidden ? 'none' : 'flex',
      order: panePositions[position],
      width: '100%',
      marginX: 0,
      ...(position === 'end' ? {
        flexDirection: 'column',
        marginTop: SPACING_MAP[rowGap]
      } : {
        flexDirection: 'column-reverse',
        marginBottom: SPACING_MAP[rowGap]
      }),
      // Regular and wide viewports
      [`@media screen and (min-width: ${theme.breakpoints[1]})`]: {
        width: 'auto',
        marginY: '0 !important',
        ...(sticky ? {
          position: 'sticky',
          // If offsetHeader has value, it will stick the pane to the position where the sticky top ends
          // else top will be 0 as the default value of offsetHeader
          top: typeof offsetHeader === 'number' ? `${offsetHeader}px` : offsetHeader,
          overflow: 'hidden',
          maxHeight: 'var(--sticky-pane-height)'
        } : {}),
        ...(position === 'end' ? {
          flexDirection: 'row',
          marginLeft: SPACING_MAP[columnGap]
        } : {
          flexDirection: 'row-reverse',
          marginRight: SPACING_MAP[columnGap]
        })
      }
    }, sx)
  }, /*#__PURE__*/React.createElement(HorizontalDivider, {
    variant: {
      narrow: dividerVariant,
      regular: 'none'
    },
    sx: {
      [position === 'end' ? 'marginBottom' : 'marginTop']: SPACING_MAP[rowGap]
    }
  }), /*#__PURE__*/React.createElement(VerticalDivider, {
    variant: {
      narrow: 'none',
      regular: dividerVariant
    },
    sx: {
      [position === 'end' ? 'marginRight' : 'marginLeft']: SPACING_MAP[columnGap]
    }
  }), /*#__PURE__*/React.createElement(Box, {
    ref: forwardRef,
    sx: {
      width: paneWidths[width],
      padding: SPACING_MAP[padding],
      overflow: 'auto'
    }
  }, children));
});
Pane.displayName = 'PageLayout.Pane'; // ----------------------------------------------------------------------------
// PageLayout.Footer

const Footer = ({
  'aria-label': label,
  'aria-labelledby': labelledBy,
  padding = 'none',
  divider = 'none',
  dividerWhenNarrow = 'inherit',
  hidden = false,
  children,
  sx = {}
}) => {
  // Combine divider and dividerWhenNarrow for backwards compatibility
  const dividerProp = !isResponsiveValue(divider) && dividerWhenNarrow !== 'inherit' ? {
    regular: divider,
    narrow: dividerWhenNarrow
  } : divider;
  const dividerVariant = useResponsiveValue(dividerProp, 'none');
  const isHidden = useResponsiveValue(hidden, false);
  const {
    rowGap
  } = React.useContext(PageLayoutContext);
  return /*#__PURE__*/React.createElement(Box, {
    as: "footer",
    "aria-label": label,
    "aria-labelledby": labelledBy,
    hidden: isHidden,
    sx: merge({
      order: REGION_ORDER.footer,
      width: '100%',
      marginTop: SPACING_MAP[rowGap]
    }, sx)
  }, /*#__PURE__*/React.createElement(HorizontalDivider, {
    variant: dividerVariant,
    sx: {
      marginBottom: SPACING_MAP[rowGap]
    }
  }), /*#__PURE__*/React.createElement(Box, {
    sx: {
      padding: SPACING_MAP[padding]
    }
  }, children));
};

Footer.displayName = "Footer";
Footer.displayName = 'PageLayout.Footer'; // ----------------------------------------------------------------------------
// Export

const PageLayout = Object.assign(Root, {
  Header,
  Content,
  Pane,
  Footer
});

export { PageLayout };
