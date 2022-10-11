import React from 'react';
import styled from 'styled-components';
import { width } from 'styled-system';
import { get } from './constants.js';
import sx from './sx.js';

const Bar = styled.span.withConfig({
  displayName: "ProgressBar__Bar",
  componentId: "sc-bfftmc-0"
})(["width:", ";", ";"], props => props.progress ? `${props.progress}%` : 0, sx);
const sizeMap = {
  small: '5px',
  large: '10px',
  default: '8px'
};
const ProgressContainer = styled.span.withConfig({
  displayName: "ProgressBar__ProgressContainer",
  componentId: "sc-bfftmc-1"
})(["display:", ";overflow:hidden;background-color:", ";border-radius:", ";height:", ";", " ", ";"], props => props.inline ? 'inline-flex' : 'flex', get('colors.border.default'), get('radii.1'), props => sizeMap[props.barSize || 'default'], width, sx);

function ProgressBar({
  progress,
  bg,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(ProgressContainer, rest, /*#__PURE__*/React.createElement(Bar, {
    progress: progress,
    sx: {
      bg
    }
  }));
}

ProgressBar.displayName = "ProgressBar";
ProgressBar.defaultProps = {
  bg: 'success.emphasis',
  barSize: 'default'
};

export { ProgressBar as default };
