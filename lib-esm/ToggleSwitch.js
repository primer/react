import React, { useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import Box from './Box.js';
import StyledSpinner from './Spinner.js';
import Text from './Text.js';
import { get } from './constants.js';
import sx from './sx.js';
import VisuallyHidden from './_VisuallyHidden.js';
import { useProvidedStateOrCreate } from './hooks/useProvidedStateOrCreate.js';

const TRANSITION_DURATION = '80ms';
const EASE_OUT_QUAD_CURVE = 'cubic-bezier(0.5, 1, 0.89, 1)';
const sizeVariants = variant({
  prop: 'size',
  variants: {
    small: {
      height: '24px',
      width: '48px'
    }
  }
});

const CircleIcon = ({
  size
}) => /*#__PURE__*/React.createElement("svg", {
  width: size === 'small' ? '12' : '16',
  height: size === 'small' ? '12' : '16',
  viewBox: "0 0 16 16",
  fill: "currentColor",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("path", {
  fillRule: "evenodd",
  d: "M8 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z"
}));

CircleIcon.displayName = "CircleIcon";

const LineIcon = ({
  size
}) => /*#__PURE__*/React.createElement("svg", {
  width: size === 'small' ? '12' : '16',
  height: size === 'small' ? '12' : '16',
  viewBox: "0 0 16 16",
  fill: "currentColor",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("path", {
  fillRule: "evenodd",
  d: "M8 2a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 8 2Z"
}));

LineIcon.displayName = "LineIcon";
const SwitchButton = styled.button.withConfig({
  displayName: "ToggleSwitch__SwitchButton",
  componentId: "sc-om7zet-0"
})(["vertical-align:middle;cursor:pointer;user-select:none;appearance:none;text-decoration:none;padding:0;transition-property:background-color,border-color;transition-duration:", ";transition-timing-function:", ";border-radius:", ";border-style:solid;border-width:1px;display:block;height:32px;width:64px;outline-offset:2px;position:relative;overflow:hidden;@media (pointer:coarse){&:before{content:'';position:absolute;left:0;right:0;transform:translateY(-50%);top:50%;min-height:44px;}}@media (prefers-reduced-motion){transition:none;*{transition:none;}}", " ", " ", ""], TRANSITION_DURATION, EASE_OUT_QUAD_CURVE, get('radii.2'), props => {
  if (props.disabled) {
    return css(["background-color:", ";border-color:", ";cursor:not-allowed;transition-property:none;"], get('colors.canvas.subtle'), get('colors.border.subtle'));
  }

  if (props.checked) {
    return css(["background-color:", ";border-color:", ";&:hover,&:focus:focus-visible{background-color:", ";}&:active,&:active:focus-visible{background-color:", ";}"], get('colors.switchTrack.checked.bg'), get('colors.switchTrack.checked.border'), get('colors.switchTrack.checked.hoverBg'), get('colors.switchTrack.checked.activeBg'));
  } else {
    return css(["background-color:", ";border-color:", ";&:hover,&:focus:focus-visible{.Toggle-knob{background-color:", ";}}&:active,&:active:focus-visible{.Toggle-knob{background-color:", ";}}"], get('colors.switchTrack.bg'), get('colors.switchTrack.border'), get('colors.btn.hoverBg'), get('colors.btn.activeBg'));
  }
}, sx, sizeVariants);
const ToggleKnob = styled.div.withConfig({
  displayName: "ToggleSwitch__ToggleKnob",
  componentId: "sc-om7zet-1"
})(["background-color:", ";border-width:1px;border-style:solid;border-color:", ";border-radius:calc(", " - 1px);box-shadow:", ";width:50%;position:absolute;top:-1px;bottom:-1px;transition-property:transform;transition-duration:", ";transition-timing-function:", ";transform:", ";z-index:1;@media (prefers-reduced-motion){transition:none;}", ""], get('colors.btn.bg'), props => props.disabled ? get('colors.border.default') : get('colors.switchTrack.border'), get('radii.2'), props => {
  var _props$theme, _props$theme$shadows, _props$theme2, _props$theme2$shadows;

  return props.disabled ? 'none' : `${(_props$theme = props.theme) === null || _props$theme === void 0 ? void 0 : (_props$theme$shadows = _props$theme.shadows) === null || _props$theme$shadows === void 0 ? void 0 : _props$theme$shadows.shadow.medium}, ${(_props$theme2 = props.theme) === null || _props$theme2 === void 0 ? void 0 : (_props$theme2$shadows = _props$theme2.shadows) === null || _props$theme2$shadows === void 0 ? void 0 : _props$theme2$shadows.btn.insetShadow}`;
}, TRANSITION_DURATION, EASE_OUT_QUAD_CURVE, props => `translateX(${props.checked ? 'calc(100% + 1px)' : '-1px'})`, props => {
  if (props.checked) {
    return css(["background-color:", ";border-color:", ";box-shadow:", ";"], props.disabled ? get('colors.switchKnob.checked.disabledBg') : get('colors.switchKnob.checked.bg'), props.disabled ? get('colors.switchKnob.checked.disabledBg') : get('colors.switchKnob.checked.bg'), get('shadows.shadow.small'));
  }
});
const hiddenTextStyles = {
  visibility: 'hidden',
  height: 0
};

const Switch = ({
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  defaultChecked,
  disabled,
  loading,
  checked,
  onChange,
  onClick,
  size,
  statusLabelPosition,
  sx: sxProp
}) => {
  const isControlled = typeof checked !== 'undefined';
  const [isOn, setIsOn] = useProvidedStateOrCreate(checked, onChange, Boolean(defaultChecked));
  const acceptsInteraction = !disabled && !loading;
  const handleToggleClick = useCallback(e => {
    if (!isControlled) {
      setIsOn(!isOn);
    }

    onClick && onClick(e);
  }, [onClick, isControlled, isOn, setIsOn]);
  useEffect(() => {
    if (onChange && isControlled) {
      onChange(Boolean(checked));
    }
  }, [onChange, checked, isControlled]);
  return /*#__PURE__*/React.createElement(Box, {
    display: "inline-flex",
    alignItems: "center",
    flexDirection: statusLabelPosition === 'start' ? 'row' : 'row-reverse',
    sx: sxProp
  }, loading ? /*#__PURE__*/React.createElement(StyledSpinner, {
    size: "small"
  }) : null, /*#__PURE__*/React.createElement(Text, {
    color: acceptsInteraction ? 'fg.default' : 'fg.muted',
    fontSize: size === 'small' ? 0 : 1,
    mx: 2,
    "aria-hidden": "true",
    sx: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Box, {
    textAlign: "right",
    sx: isOn ? null : hiddenTextStyles
  }, "On"), /*#__PURE__*/React.createElement(Box, {
    textAlign: "right",
    sx: isOn ? hiddenTextStyles : null
  }, "Off")), /*#__PURE__*/React.createElement(SwitchButton, {
    onClick: handleToggleClick,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-checked": isOn,
    "aria-disabled": !acceptsInteraction,
    role: "switch",
    checked: isOn,
    size: size,
    disabled: !acceptsInteraction
  }, /*#__PURE__*/React.createElement(VisuallyHidden, null, isOn ? 'On' : 'Off'), /*#__PURE__*/React.createElement(Box, {
    "aria-hidden": "true",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden"
  }, /*#__PURE__*/React.createElement(Box, {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "50%",
    color: acceptsInteraction ? 'accent.fg' : 'fg.subtle',
    lineHeight: "0",
    sx: {
      transform: `translateX(${isOn ? '0' : '-100%'})`,
      transitionProperty: 'transform',
      transitionDuration: TRANSITION_DURATION
    }
  }, /*#__PURE__*/React.createElement(LineIcon, {
    size: size
  })), /*#__PURE__*/React.createElement(Box, {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "50%",
    color: acceptsInteraction ? 'fg.default' : 'fg.subtle',
    lineHeight: "0",
    sx: {
      transform: `translateX(${isOn ? '100%' : '0'})`,
      transitionProperty: 'transform',
      transitionDuration: TRANSITION_DURATION
    }
  }, /*#__PURE__*/React.createElement(CircleIcon, {
    size: size
  }))), /*#__PURE__*/React.createElement(ToggleKnob, {
    "aria-hidden": "true",
    className: "Toggle-knob",
    disabled: !acceptsInteraction,
    checked: isOn
  })));
};

Switch.displayName = "Switch";
Switch.defaultProps = {
  statusLabelPosition: 'start',
  size: 'medium'
};

export { Switch as default };
