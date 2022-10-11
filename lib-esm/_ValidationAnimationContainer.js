import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Box from './Box.js';

const fadeIn = keyframes(["0%{opacity:0;transform:translateY(-100%);}100%{opacity:1;transform:translateY(0);}"]); // using easeOutQuint easing fn https://easings.net/#easeOutQuint

const AnimatedElement = styled.div.withConfig({
  displayName: "_ValidationAnimationContainer__AnimatedElement",
  componentId: "sc-1gpqp3g-0"
})(["animation:", ";"], props => props.show && css(["170ms ", " cubic-bezier(0.44,0.74,0.36,1);"], fadeIn));

const ValidationAnimationContainer = ({
  show,
  children
}) => {
  const [shouldRender, setRender] = useState(show);
  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return shouldRender ? /*#__PURE__*/React.createElement(Box, {
    height: show ? 'auto' : 0,
    overflow: "hidden"
  }, /*#__PURE__*/React.createElement(AnimatedElement, {
    show: show,
    onAnimationEnd: onAnimationEnd
  }, children)) : null;
};

export { ValidationAnimationContainer as default };
