import React from 'react';
import styled from 'styled-components';
import sx from './sx.js';

function Octicon({
  icon: IconComponent,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(IconComponent, rest);
}

Octicon.displayName = "Octicon";
const StyledOcticon = styled(Octicon).withConfig({
  displayName: "StyledOcticon",
  componentId: "sc-1lhyyr-0"
})(["", ""], ({
  color,
  sx: sxProp
}) => sx({
  sx: {
    color,
    ...sxProp
  }
}));
StyledOcticon.defaultProps = {
  size: 16
};
var StyledOcticon$1 = StyledOcticon;

export { StyledOcticon$1 as default };
