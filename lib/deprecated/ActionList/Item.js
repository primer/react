'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var constants = require('../../constants.js');
var sx = require('../../sx.js');
var Truncate = require('../../Truncate.js');
var styled = require('styled-components');
var Header = require('./Header.js');
var Divider = require('./Divider.js');
var ThemeProvider = require('../../ThemeProvider.js');
var behaviors = require('@primer/behaviors');
var ssr = require('@react-aria/ssr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const getItemVariant = (variant = 'default', disabled) => {
  if (disabled) {
    return {
      color: constants.get('colors.primer.fg.disabled'),
      iconColor: constants.get('colors.primer.fg.disabled'),
      annotationColor: constants.get('colors.primer.fg.disabled'),
      hoverCursor: 'default'
    };
  }

  switch (variant) {
    case 'danger':
      return {
        color: constants.get('colors.danger.fg'),
        iconColor: constants.get('colors.danger.fg'),
        annotationColor: constants.get('colors.fg.muted'),
        hoverCursor: 'pointer',
        hoverBg: constants.get('colors.actionListItem.danger.hoverBg'),
        focusBg: constants.get('colors.actionListItem.danger.activeBg'),
        hoverText: constants.get('colors.actionListItem.danger.hoverText')
      };

    default:
      return {
        color: constants.get('colors.fg.default'),
        iconColor: constants.get('colors.fg.muted'),
        annotationColor: constants.get('colors.fg.muted'),
        hoverCursor: 'pointer',
        hoverBg: constants.get('colors.actionListItem.default.hoverBg'),
        focusBg: constants.get('colors.actionListItem.default.activeBg')
      };
  }
};

const DividedContent = styled__default["default"].div.withConfig({
  displayName: "Item__DividedContent",
  componentId: "sc-y6iv6t-0"
})(["display:flex;min-width:0;position:relative;flex-grow:1;"]);
const MainContent = styled__default["default"].div.withConfig({
  displayName: "Item__MainContent",
  componentId: "sc-y6iv6t-1"
})(["align-items:baseline;display:flex;min-width:0;flex-direction:var(--main-content-flex-direction);flex-grow:1;"]);
const StyledItem = styled__default["default"].div.withConfig({
  displayName: "Item__StyledItem",
  componentId: "sc-y6iv6t-2"
})(["padding:6px ", ";display:flex;border-radius:", ";color:", ";transition:background 33.333ms linear;text-decoration:none;@media (hover:hover) and (pointer:fine){:hover{background:var( --item-hover-bg-override,", " );color:", ";cursor:", ";}}:not(:first-of-type):not(", " + &):not(", " + &){margin-top:", ";", "::before{content:' ';display:block;position:absolute;width:100%;top:-7px;border:0 solid ", ";border-top-width:", ";}}&:hover ", "::before,:hover + * ", "::before{border-color:var(--item-hover-divider-border-color-override,transparent) !important;}&:focus ", "::before,:focus + * ", "::before,&[", "] ", "::before,[", "] + & ", "::before{border-color:transparent !important;}&[", "='", "']{background:", ";}&[", "='", "']{background:", ";}&:focus{background:", ";outline:none;}&:active{background:", ";}", ""], constants.get('space.2'), constants.get('radii.2'), ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).color, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).hoverBg, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).hoverText, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).hoverCursor, Divider.StyledDivider, Header.StyledHeader, ({
  showDivider
}) => showDivider ? `1px` : '0', DividedContent, constants.get('colors.border.muted'), ({
  showDivider
}) => showDivider ? `1px` : '0', DividedContent, DividedContent, DividedContent, DividedContent, behaviors.isActiveDescendantAttribute, DividedContent, behaviors.isActiveDescendantAttribute, DividedContent, behaviors.isActiveDescendantAttribute, behaviors.activeDescendantActivatedDirectly, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).focusBg, behaviors.isActiveDescendantAttribute, behaviors.activeDescendantActivatedIndirectly, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).hoverBg, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).focusBg, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).focusBg, sx["default"]);
const TextContainer = styled__default["default"].span.withConfig({
  displayName: "Item__TextContainer",
  componentId: "sc-y6iv6t-3"
})([""]);
const BaseVisualContainer = styled__default["default"].div.withConfig({
  displayName: "Item__BaseVisualContainer",
  componentId: "sc-y6iv6t-4"
})(["height:20px;width:", ";margin-right:", ";display:flex;justify-content:center;align-items:center;flex-shrink:0;"], constants.get('space.3'), constants.get('space.2'));
const ColoredVisualContainer = styled__default["default"](BaseVisualContainer).withConfig({
  displayName: "Item__ColoredVisualContainer",
  componentId: "sc-y6iv6t-5"
})(["svg{fill:", ";font-size:", ";}"], ({
  variant,
  disabled
}) => getItemVariant(variant, disabled).iconColor, constants.get('fontSizes.0'));
const LeadingVisualContainer = styled__default["default"](ColoredVisualContainer).withConfig({
  displayName: "Item__LeadingVisualContainer",
  componentId: "sc-y6iv6t-6"
})(["display:flex;flex-direction:column;justify-content:center;"]);
const TrailingContent = styled__default["default"](ColoredVisualContainer).withConfig({
  displayName: "Item__TrailingContent",
  componentId: "sc-y6iv6t-7"
})(["color:", "};margin-left:", ";margin-right:0;width:auto;div:nth-child(2){margin-left:", ";}"], ({
  variant,
  disabled
}) => getItemVariant(variant, disabled).annotationColor, constants.get('space.2'), constants.get('space.2'));
const DescriptionContainer = styled__default["default"].span.withConfig({
  displayName: "Item__DescriptionContainer",
  componentId: "sc-y6iv6t-8"
})(["color:", ";font-size:", ";line-height:16px;margin-left:var(--description-container-margin-left);min-width:0;flex-grow:1;flex-basis:var(--description-container-flex-basis);"], constants.get('colors.fg.muted'), constants.get('fontSizes.0'));
const MultiSelectIcon = styled__default["default"].svg.withConfig({
  displayName: "Item__MultiSelectIcon",
  componentId: "sc-y6iv6t-9"
})(["rect{fill:", ";stroke:", ";shape-rendering:auto;}path{fill:", ";boxshadow:", ";opacity:", ";}"], ({
  selected
}) => selected ? constants.get('colors.accent.fg') : constants.get('colors.canvas.default'), ({
  selected
}) => selected ? constants.get('colors.accent.fg') : constants.get('colors.border.default'), constants.get('colors.fg.onEmphasis'), constants.get('shadow.small'), ({
  selected
}) => selected ? 1 : 0);
/**
 * An actionable or selectable `Item` with an optional icon and description.
 */

const Item = /*#__PURE__*/React__default["default"].forwardRef((itemProps, ref) => {
  const {
    as: Component,
    text,
    description,
    descriptionVariant = 'inline',
    selected,
    selectionVariant,
    leadingVisual: LeadingVisual,
    trailingIcon: TrailingIcon,
    trailingVisual: TrailingVisual,
    trailingText,
    variant = 'default',
    showDivider,
    disabled,
    onAction,
    onKeyPress,
    children,
    onClick,
    id,
    ...props
  } = itemProps;
  const labelId = ssr.useSSRSafeId();
  const descriptionId = ssr.useSSRSafeId();
  const keyPressHandler = React.useCallback(event => {
    if (disabled) {
      return;
    }

    onKeyPress === null || onKeyPress === void 0 ? void 0 : onKeyPress(event);

    if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
      onAction === null || onAction === void 0 ? void 0 : onAction(itemProps, event);
    }
  }, [onAction, disabled, itemProps, onKeyPress]);
  const clickHandler = React.useCallback(event => {
    if (disabled) {
      return;
    }

    onClick === null || onClick === void 0 ? void 0 : onClick(event);

    if (!event.defaultPrevented) {
      onAction === null || onAction === void 0 ? void 0 : onAction(itemProps, event);
    }
  }, [onAction, disabled, itemProps, onClick]);
  const {
    theme
  } = ThemeProvider.useTheme();
  return /*#__PURE__*/React__default["default"].createElement(StyledItem, _extends({
    ref: ref,
    as: Component,
    tabIndex: disabled ? undefined : -1,
    variant: variant,
    showDivider: showDivider,
    "aria-selected": selected,
    "aria-labelledby": text ? labelId : undefined,
    "aria-describedby": description ? descriptionId : undefined
  }, props, {
    "data-id": id,
    onKeyPress: keyPressHandler,
    onClick: clickHandler
  }), !!selected === selected && /*#__PURE__*/React__default["default"].createElement(BaseVisualContainer, null, selectionVariant === 'multiple' ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(MultiSelectIcon, {
    selected: selected,
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React__default["default"].createElement("rect", {
    x: "2",
    y: "2",
    width: "12",
    height: "12",
    rx: "4"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    fillRule: "evenodd",
    strokeWidth: "0",
    d: "M4.03231 8.69862C3.84775 8.20646 4.49385 7.77554 4.95539 7.77554C5.41693 7.77554 6.80154 9.85246 6.80154 9.85246C6.80154 9.85246 10.2631 4.314 10.4938 4.08323C10.7246 3.85246 11.8785 4.08323 11.4169 5.00631C11.0081 5.82388 7.26308 11.4678 7.26308 11.4678C7.26308 11.4678 6.80154 12.1602 6.34 11.4678C5.87846 10.7755 4.21687 9.19077 4.03231 8.69862Z"
  }))) : selected && /*#__PURE__*/React__default["default"].createElement(octiconsReact.CheckIcon, {
    fill: theme === null || theme === void 0 ? void 0 : theme.colors.fg.default
  })), LeadingVisual && /*#__PURE__*/React__default["default"].createElement(LeadingVisualContainer, {
    variant: variant,
    disabled: disabled
  }, /*#__PURE__*/React__default["default"].createElement(LeadingVisual, null)), /*#__PURE__*/React__default["default"].createElement(DividedContent, null, /*#__PURE__*/React__default["default"].createElement(MainContent, {
    style: {
      '--main-content-flex-direction': descriptionVariant === 'inline' ? 'row' : 'column'
    }
  }, children, text ? /*#__PURE__*/React__default["default"].createElement(TextContainer, {
    id: labelId
  }, text) : null, description ? /*#__PURE__*/React__default["default"].createElement(DescriptionContainer, {
    id: descriptionId,
    style: {
      '--description-container-margin-left': descriptionVariant === 'inline' ? constants.get('space.2')(theme) : 0,
      '--description-container-flex-basis': descriptionVariant === 'inline' ? 0 : 'auto'
    }
  }, descriptionVariant === 'block' ? description : /*#__PURE__*/React__default["default"].createElement(Truncate, {
    title: description,
    inline: true,
    maxWidth: "100%"
  }, description)) : null), TrailingVisual ? /*#__PURE__*/React__default["default"].createElement(TrailingContent, {
    variant: variant,
    disabled: disabled
  }, typeof TrailingVisual === 'function' ? /*#__PURE__*/React__default["default"].createElement(TrailingVisual, null) : TrailingVisual) : TrailingIcon || trailingText ? /*#__PURE__*/React__default["default"].createElement(TrailingContent, {
    variant: variant,
    disabled: disabled
  }, trailingText, TrailingIcon && /*#__PURE__*/React__default["default"].createElement(TrailingIcon, null)) : null));
});
Item.displayName = 'ActionList.Item';

exports.Item = Item;
exports.TextContainer = TextContainer;
