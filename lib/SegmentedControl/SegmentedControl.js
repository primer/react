'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var SegmentedControlButton = require('./SegmentedControlButton.js');
var SegmentedControlIconButton = require('./SegmentedControlIconButton.js');
var index = require('../ActionList/index.js');
var ActionMenu = require('../ActionMenu.js');
var ThemeProvider = require('../ThemeProvider.js');
var sx = require('../sx.js');
var useResponsiveValue = require('../hooks/useResponsiveValue.js');
var styled = require('styled-components');
var merge = require('deepmerge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// Needed because passing a ref to `Box` causes a type error
const SegmentedControlList = styled__default["default"].ul.withConfig({
  displayName: "SegmentedControl__SegmentedControlList",
  componentId: "sc-1rzig82-0"
})(["", ";"], sx["default"]);

const getSegmentedControlStyles = props => ({
  backgroundColor: 'segmentedControl.bg',
  borderColor: 'border.default',
  borderRadius: 2,
  borderStyle: 'solid',
  borderWidth: 1,
  display: props.isFullWidth ? 'flex' : 'inline-flex',
  fontSize: props.size === 'small' ? 0 : 1,
  height: props.size === 'small' ? '28px' : '32px',
  // TODO: use primitive `control.{small|medium}.size` when it is available
  margin: 0,
  padding: 0,
  width: props.isFullWidth ? '100%' : undefined
});

const Root = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  fullWidth,
  onChange,
  size,
  sx: sxProp = {},
  variant,
  ...rest
}) => {
  const segmentedControlContainerRef = React.useRef(null);
  const {
    theme
  } = ThemeProvider.useTheme();
  const isUncontrolled = onChange === undefined || React__default["default"].Children.toArray(children).some(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.props.defaultSelected !== undefined);
  const responsiveVariant = useResponsiveValue.useResponsiveValue(variant, 'default');
  const isFullWidth = useResponsiveValue.useResponsiveValue(fullWidth, false);
  const selectedSegments = React__default["default"].Children.toArray(children).map(child => /*#__PURE__*/React__default["default"].isValidElement(child) && child.props.selected);
  const hasSelectedButton = selectedSegments.some(isSelected => isSelected);
  const selectedIndexExternal = hasSelectedButton ? selectedSegments.indexOf(true) : 0;
  const [selectedIndexInternalState, setSelectedIndexInternalState] = React.useState(selectedIndexExternal);
  const selectedIndex = isUncontrolled ? selectedIndexInternalState : selectedIndexExternal;
  const selectedChild = /*#__PURE__*/React__default["default"].isValidElement(React__default["default"].Children.toArray(children)[selectedIndex]) ? React__default["default"].Children.toArray(children)[selectedIndex] : undefined;

  const getChildIcon = childArg => {
    if ( /*#__PURE__*/React__default["default"].isValidElement(childArg) && childArg.type === SegmentedControlButton && childArg.props.leadingIcon) {
      return childArg.props.leadingIcon;
    }

    return /*#__PURE__*/React__default["default"].isValidElement(childArg) ? childArg.props.icon : null;
  };

  const getChildText = childArg => {
    if ( /*#__PURE__*/React__default["default"].isValidElement(childArg) && childArg.type === SegmentedControlButton) {
      return childArg.props.children;
    }

    return /*#__PURE__*/React__default["default"].isValidElement(childArg) ? childArg.props['aria-label'] : null;
  };

  const listSx = merge__default["default"](getSegmentedControlStyles({
    isFullWidth,
    size
  }), sxProp);

  if (!ariaLabel && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn('Use the `aria-label` or `aria-labelledby` prop to provide an accessible label for assistive technology');
  }

  return responsiveVariant === 'dropdown' ?
  /*#__PURE__*/
  // Render the 'dropdown' variant of the SegmentedControlButton or SegmentedControlIconButton
  React__default["default"].createElement(ActionMenu.ActionMenu, null, /*#__PURE__*/React__default["default"].createElement(ActionMenu.ActionMenu.Button, {
    leadingIcon: getChildIcon(selectedChild)
  }, getChildText(selectedChild)), /*#__PURE__*/React__default["default"].createElement(ActionMenu.ActionMenu.Overlay, null, /*#__PURE__*/React__default["default"].createElement(index.ActionList, {
    selectionVariant: "single"
  }, React__default["default"].Children.map(children, (child, index$1) => {
    const ChildIcon = getChildIcon(child); // Not a valid child element - skip rendering

    if (! /*#__PURE__*/React__default["default"].isValidElement(child)) {
      return null;
    }

    return /*#__PURE__*/React__default["default"].createElement(index.ActionList.Item, {
      key: `segmented-control-action-btn-${index$1}`,
      selected: index$1 === selectedIndex,
      onSelect: event => {
        isUncontrolled && setSelectedIndexInternalState(index$1);
        onChange && onChange(index$1);
        child.props.onClick && child.props.onClick(event);
      }
    }, ChildIcon && /*#__PURE__*/React__default["default"].createElement(ChildIcon, null), " ", getChildText(child));
  })))) :
  /*#__PURE__*/
  // Render a segmented control
  React__default["default"].createElement(SegmentedControlList, _extends({
    sx: listSx,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ref: segmentedControlContainerRef
  }, rest), React__default["default"].Children.map(children, (child, index) => {
    // Not a valid child element - skip rendering child
    if (! /*#__PURE__*/React__default["default"].isValidElement(child)) {
      return null;
    }

    const sharedChildProps = {
      onClick: onChange ? event => {
        onChange(index);
        isUncontrolled && setSelectedIndexInternalState(index);
        child.props.onClick && child.props.onClick(event);
      } : event => {
        child.props.onClick && child.props.onClick(event);
        isUncontrolled && setSelectedIndexInternalState(index);
      },
      selected: index === selectedIndex,
      sx: {
        '--separator-color': index === selectedIndex || index === selectedIndex - 1 ? 'transparent' : theme === null || theme === void 0 ? void 0 : theme.colors.border.default,
        ...child.props.sx
      }
    }; // Render the 'hideLabels' variant of the SegmentedControlButton

    if (responsiveVariant === 'hideLabels' && /*#__PURE__*/React__default["default"].isValidElement(child) && child.type === SegmentedControlButton) {
      const {
        'aria-label': childAriaLabel,
        leadingIcon,
        children: childPropsChildren,
        ...restChildProps
      } = child.props;
      const {
        sx: sharedSxProp,
        ...restSharedChildProps
      } = sharedChildProps;

      if (!leadingIcon) {
        // eslint-disable-next-line no-console
        console.warn('A `leadingIcon` prop is required when hiding visible labels');
      } else {
        return /*#__PURE__*/React__default["default"].createElement(SegmentedControlIconButton["default"], _extends({
          "aria-label": childAriaLabel || childPropsChildren,
          icon: leadingIcon,
          sx: { ...sharedSxProp,
            // setting width here avoids having to pass `isFullWidth` directly to child components
            width: !isFullWidth ? '32px' : '100%' // TODO: use primitive `control.medium.size` when it is available instead of '32px'

          }
        }, restSharedChildProps, restChildProps));
      }
    } // Render the children as-is and add the shared child props


    return /*#__PURE__*/React__default["default"].cloneElement(child, sharedChildProps);
  }));
};

Root.displayName = 'SegmentedControl';
Root.defaultProps = {
  variant: 'default'
};
const SegmentedControl = Object.assign(Root, {
  Button: SegmentedControlButton,
  IconButton: SegmentedControlIconButton["default"]
});

exports.SegmentedControl = SegmentedControl;
