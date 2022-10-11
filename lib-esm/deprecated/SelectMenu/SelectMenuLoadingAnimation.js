import React from 'react';
import styled from 'styled-components';
import { get } from '../../constants.js';
import Spinner from '../../Spinner.js';
import sx from '../../sx.js';

const Animation = styled.div.withConfig({
  displayName: "SelectMenuLoadingAnimation__Animation",
  componentId: "sc-j2647v-0"
})(["padding:", " ", ";text-align:center;background-color:", ";", ""], get('space.6'), get('space.4'), get('colors.canvas.overlay'), sx);

const SelectMenuLoadingAnimation = props => {
  return /*#__PURE__*/React.createElement(Animation, props, /*#__PURE__*/React.createElement(Spinner, null));
};

SelectMenuLoadingAnimation.displayName = "SelectMenuLoadingAnimation";
var SelectMenuLoadingAnimation$1 = SelectMenuLoadingAnimation;

export { SelectMenuLoadingAnimation$1 as default };
