import { useState, useLayoutEffect } from 'react';
import { getCharacterCoordinates } from '../utils/character-coordinates.js';

/**
 * Calculates the optimal height of the textarea according to its content, automatically
 * resizing it as the user types. If the user manually resizes the textarea, their setting
 * will be respected.
 *
 * Returns an object to spread to the component's `sx` prop.
 *
 * NOTE: for the most accurate results, be sure that the `lineHeight` of the element is
 * explicitly set in CSS.
 */
const useDynamicTextareaHeight = ({
  minHeightLines,
  maxHeightLines,
  element,
  value
}) => {
  const [height, setHeight] = useState(undefined);
  const [minHeight, setMinHeight] = useState(undefined);
  const [maxHeight, setMaxHeight] = useState(undefined);
  useLayoutEffect(() => {
    if (!element) return;
    const computedStyles = getComputedStyle(element);
    const pt = computedStyles.paddingTop;
    const lastCharacterCoords = getCharacterCoordinates(element, element.value.length); // The calculator gives us the distance from the top border to the bottom of the caret, including
    // any top padding, so we need to delete the top padding to accurately get the height
    // We could also parse and subtract the top padding, but this is more reliable (no chance of NaN)

    element.style.paddingTop = '0'; // Somehow we come up 1 pixel too short and the scrollbar appears, so just add one

    setHeight(`${lastCharacterCoords.top + lastCharacterCoords.height + 1}px`);
    element.style.paddingTop = pt;
    const lineHeight = computedStyles.lineHeight === 'normal' ? `1.2 * ${computedStyles.fontSize}` : computedStyles.lineHeight; // Using CSS calculations is fast and prevents us from having to parse anything

    setMinHeight(`calc(${minHeightLines} * ${lineHeight})`);
    setMaxHeight(`calc(${maxHeightLines} * ${lineHeight})`); // `value` is an unnecessary dependency but it enables us to recalculate as the user types
  }, [minHeightLines, maxHeightLines, element, value]);
  return {
    height,
    minHeight,
    maxHeight,
    boxSizing: 'content-box'
  };
};

export { useDynamicTextareaHeight };
