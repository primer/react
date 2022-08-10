import {useLayoutEffect, useState} from 'react'

import {SxProp} from '../../sx'
import {getCharacterCoordinates} from '../utils/character-coordinates'

type UseDynamicTextareaHeightSettings = {
  minHeightLines: number
  maxHeightLines: number
  element: HTMLTextAreaElement | null
  /** The current value of the input. */
  value: string
}

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
export const useDynamicTextareaHeight = ({
  minHeightLines,
  maxHeightLines,
  element,
  value
}: UseDynamicTextareaHeightSettings): SxProp['sx'] => {
  const [height, setHeight] = useState<string | undefined>(undefined)
  const [minHeight, setMinHeight] = useState<string | undefined>(undefined)
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined)

  useLayoutEffect(() => {
    if (!element) return

    const computedStyles = getComputedStyle(element)
    const pt = computedStyles.paddingTop

    // The calculator gives us the distance from the top border to the bottom of the caret, including
    // any top padding, so we need to delete the top padding to accurately get the height
    element.style.paddingTop = '0'
    // Somehow we come up 1 pixel too short and the scrollbar appears, so just add one
    setHeight(`${getCharacterCoordinates(element, element.value.length, false).top + 1}px`)
    element.style.paddingTop = pt

    const lineHeight =
      computedStyles.lineHeight === 'normal' ? `1.2 * ${computedStyles.fontSize}` : computedStyles.lineHeight
    setMinHeight(`calc(${minHeightLines} * ${lineHeight})`)
    setMaxHeight(`calc(${maxHeightLines} * ${lineHeight})`)
    // `value` is an unnecessary dependency but it enables us to recalculate as the user types
  }, [minHeightLines, maxHeightLines, element, value])

  return {height, minHeight, maxHeight, boxSizing: 'content-box'}
}
