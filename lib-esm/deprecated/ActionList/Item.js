import { CheckIcon } from '@primer/octicons-react';
import React, { useCallback } from 'react';
import { get } from '../../constants.js';
import sx from '../../sx.js';
import Truncate from '../../Truncate.js';
import styled from 'styled-components';
import { StyledHeader } from './Header.js';
import { StyledDivider } from './Divider.js';
import { useTheme } from '../../ThemeProvider.js';
import { isActiveDescendantAttribute, activeDescendantActivatedDirectly, activeDescendantActivatedIndirectly } from '@primer/behaviors';
import { useSSRSafeId } from '@react-aria/ssr';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const getItemVariant = (variant = 'default', disabled) => {
  if (disabled) {
    return {
      color: get('colors.primer.fg.disabled'),
      iconColor: get('colors.primer.fg.disabled'),
      annotationColor: get('colors.primer.fg.disabled'),
      hoverCursor: 'default'
    };
  }

  switch (variant) {
    case 'danger':
      return {
        color: get('colors.danger.fg'),
        iconColor: get('colors.danger.fg'),
        annotationColor: get('colors.fg.muted'),
        hoverCursor: 'pointer',
        hoverBg: get('colors.actionListItem.danger.hoverBg'),
        focusBg: get('colors.actionListItem.danger.activeBg'),
        hoverText: get('colors.actionListItem.danger.hoverText')
      };

    default:
      return {
        color: get('colors.fg.default'),
        iconColor: get('colors.fg.muted'),
        annotationColor: get('colors.fg.muted'),
        hoverCursor: 'pointer',
        hoverBg: get('colors.actionListItem.default.hoverBg'),
        focusBg: get('colors.actionListItem.default.activeBg')
      };
  }
};

const DividedContent = styled.div.withConfig({
  displayName: "Item__DividedContent",
  componentId: "sc-y6iv6t-0"
})(["display:flex;min-width:0;position:relative;flex-grow:1;"]);
const MainContent = styled.div.withConfig({
  displayName: "Item__MainContent",
  componentId: "sc-y6iv6t-1"
})(["align-items:baseline;display:flex;min-width:0;flex-direction:var(--main-content-flex-direction);flex-grow:1;"]);
const StyledItem = styled.div.withConfig({
  displayName: "Item__StyledItem",
  componentId: "sc-y6iv6t-2"
})(["padding:6px ", ";display:flex;border-radius:", ";color:", ";transition:background 33.333ms linear;text-decoration:none;@media (hover:hover) and (pointer:fine){:hover{background:var( --item-hover-bg-override,", " );color:", ";cursor:", ";}}:not(:first-of-type):not(", " + &):not(", " + &){margin-top:", ";", "::before{content:' ';display:block;position:absolute;width:100%;top:-7px;border:0 solid ", ";border-top-width:", ";}}&:hover ", "::before,:hover + * ", "::before{border-color:var(--item-hover-divider-border-color-override,transparent) !important;}&:focus ", "::before,:focus + * ", "::before,&[", "] ", "::before,[", "] + & ", "::before{border-color:transparent !important;}&[", "='", "']{background:", ";}&[", "='", "']{background:", ";}&:focus{background:", ";outline:none;}&:active{background:", ";}", ""], get('space.2'), get('radii.2'), ({
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
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).hoverCursor, StyledDivider, StyledHeader, ({
  showDivider
}) => showDivider ? `1px` : '0', DividedContent, get('colors.border.muted'), ({
  showDivider
}) => showDivider ? `1px` : '0', DividedContent, DividedContent, DividedContent, DividedContent, isActiveDescendantAttribute, DividedContent, isActiveDescendantAttribute, DividedContent, isActiveDescendantAttribute, activeDescendantActivatedDirectly, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).focusBg, isActiveDescendantAttribute, activeDescendantActivatedIndirectly, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).hoverBg, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).focusBg, ({
  variant,
  item
}) => getItemVariant(variant, item === null || item === void 0 ? void 0 : item.disabled).focusBg, sx);
const TextContainer = styled.span.withConfig({
  displayName: "Item__TextContainer",
  componentId: "sc-y6iv6t-3"
})([""]);
const BaseVisualContainer = styled.div.withConfig({
  displayName: "Item__BaseVisualContainer",
  componentId: "sc-y6iv6t-4"
})(["height:20px;width:", ";margin-right:", ";display:flex;justify-content:center;align-items:center;flex-shrink:0;"], get('space.3'), get('space.2'));
const ColoredVisualContainer = styled(BaseVisualContainer).withConfig({
  displayName: "Item__ColoredVisualContainer",
  componentId: "sc-y6iv6t-5"
})(["svg{fill:", ";font-size:", ";}"], ({
  variant,
  disabled
}) => getItemVariant(variant, disabled).iconColor, get('fontSizes.0'));
const LeadingVisualContainer = styled(ColoredVisualContainer).withConfig({
  displayName: "Item__LeadingVisualContainer",
  componentId: "sc-y6iv6t-6"
})(["display:flex;flex-direction:column;justify-content:center;"]);
const TrailingContent = styled(ColoredVisualContainer).withConfig({
  displayName: "Item__TrailingContent",
  componentId: "sc-y6iv6t-7"
})(["color:", "};margin-left:", ";margin-right:0;width:auto;div:nth-child(2){margin-left:", ";}"], ({
  variant,
  disabled
}) => getItemVariant(variant, disabled).annotationColor, get('space.2'), get('space.2'));
const DescriptionContainer = styled.span.withConfig({
  displayName: "Item__DescriptionContainer",
  componentId: "sc-y6iv6t-8"
})(["color:", ";font-size:", ";line-height:16px;margin-left:var(--description-container-margin-left);min-width:0;flex-grow:1;flex-basis:var(--description-container-flex-basis);"], get('colors.fg.muted'), get('fontSizes.0'));
const MultiSelectIcon = styled.svg.withConfig({
  displayName: "Item__MultiSelectIcon",
  componentId: "sc-y6iv6t-9"
})(["rect{fill:", ";stroke:", ";shape-rendering:auto;}path{fill:", ";boxshadow:", ";opacity:", ";}"], ({
  selected
}) => selected ? get('colors.accent.fg') : get('colors.canvas.default'), ({
  selected
}) => selected ? get('colors.accent.fg') : get('colors.border.default'), get('colors.fg.onEmphasis'), get('shadow.small'), ({
  selected
}) => selected ? 1 : 0);
/**
 * An actionable or selectable `Item` with an optional icon and description.
 */

const Item = /*#__PURE__*/React.forwardRef((itemProps, ref) => {
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
  const labelId = useSSRSafeId();
  const descriptionId = useSSRSafeId();
  const keyPressHandler = useCallback(event => {
    if (disabled) {
      return;
    }

    onKeyPress === null || onKeyPress === void 0 ? void 0 : onKeyPress(event);

    if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
      onAction === null || onAction === void 0 ? void 0 : onAction(itemProps, event);
    }
  }, [onAction, disabled, itemProps, onKeyPress]);
  const clickHandler = useCallback(event => {
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
  } = useTheme();
  return /*#__PURE__*/React.createElement(StyledItem, _extends({
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
  }), !!selected === selected && /*#__PURE__*/React.createElement(BaseVisualContainer, null, selectionVariant === 'multiple' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MultiSelectIcon, {
    selected: selected,
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "12",
    height: "12",
    rx: "4"
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    strokeWidth: "0",
    d: "M4.03231 8.69862C3.84775 8.20646 4.49385 7.77554 4.95539 7.77554C5.41693 7.77554 6.80154 9.85246 6.80154 9.85246C6.80154 9.85246 10.2631 4.314 10.4938 4.08323C10.7246 3.85246 11.8785 4.08323 11.4169 5.00631C11.0081 5.82388 7.26308 11.4678 7.26308 11.4678C7.26308 11.4678 6.80154 12.1602 6.34 11.4678C5.87846 10.7755 4.21687 9.19077 4.03231 8.69862Z"
  }))) : selected && /*#__PURE__*/React.createElement(CheckIcon, {
    fill: theme === null || theme === void 0 ? void 0 : theme.colors.fg.default
  })), LeadingVisual && /*#__PURE__*/React.createElement(LeadingVisualContainer, {
    variant: variant,
    disabled: disabled
  }, /*#__PURE__*/React.createElement(LeadingVisual, null)), /*#__PURE__*/React.createElement(DividedContent, null, /*#__PURE__*/React.createElement(MainContent, {
    style: {
      '--main-content-flex-direction': descriptionVariant === 'inline' ? 'row' : 'column'
    }
  }, children, text ? /*#__PURE__*/React.createElement(TextContainer, {
    id: labelId
  }, text) : null, description ? /*#__PURE__*/React.createElement(DescriptionContainer, {
    id: descriptionId,
    style: {
      '--description-container-margin-left': descriptionVariant === 'inline' ? get('space.2')(theme) : 0,
      '--description-container-flex-basis': descriptionVariant === 'inline' ? 0 : 'auto'
    }
  }, descriptionVariant === 'block' ? description : /*#__PURE__*/React.createElement(Truncate, {
    title: description,
    inline: true,
    maxWidth: "100%"
  }, description)) : null), TrailingVisual ? /*#__PURE__*/React.createElement(TrailingContent, {
    variant: variant,
    disabled: disabled
  }, typeof TrailingVisual === 'function' ? /*#__PURE__*/React.createElement(TrailingVisual, null) : TrailingVisual) : TrailingIcon || trailingText ? /*#__PURE__*/React.createElement(TrailingContent, {
    variant: variant,
    disabled: disabled
  }, trailingText, TrailingIcon && /*#__PURE__*/React.createElement(TrailingIcon, null)) : null));
});
Item.displayName = 'ActionList.Item';

export { Item, TextContainer };
