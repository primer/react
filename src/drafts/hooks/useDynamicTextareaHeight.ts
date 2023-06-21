import {RefObject, useCallback, useEffect, useLayoutEffect, useState} from 'react'

import {SxProp} from '../../sx'
import {getCharacterCoordinates} from '../utils/character-coordinates'

type UseDynamicTextareaHeightSettings = {
  disabled?: boolean
  minHeightLines?: number
  maxHeightLines?: number
  elementRef: RefObject<HTMLTextAreaElement | null>
  /** The current value of the input. */
  value: string
}

/**
 * Calculates the optimal height of the textarea according to its content, automatically
 * resizing it as the user types. If the user manually resizes the textarea, their setting
 * will be respected.
 *
 * Returns an object to spread to the component's `sx` prop. If you are using `Textarea`,
 * apply this to the child `textarea` element: `<Textarea sx={{'& textarea': resultOfThisHook}} />`.
 *
 * NOTE: for the most accurate results, be sure that the `lineHeight` of the element is
 * explicitly set in CSS.
 */
export const useDynamicTextareaHeight = ({
  disabled,
  minHeightLines,
  maxHeightLines,
  elementRef,
  value,
}: UseDynamicTextareaHeightSettings): SxProp['sx'] => {
  const [height, setHeight] = useState<string | undefined>(undefined)
  const [minHeight, setMinHeight] = useState<string | undefined>(undefined)
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined)

  const refreshHeight = useCallback(() => {
    if (disabled) return

    const element = elementRef.current
    if (!element) return

    const computedStyles = getComputedStyle(element)
    const pt = computedStyles.paddingTop

    // The calculator gives us the distance from the top border to the bottom of the caret, including
    // any top padding, so we need to delete the top padding to accurately get the height
    // We could also parse and subtract the top padding, but this is more reliable (no chance of NaN)
    element.style.paddingTop = '0'

    const lastCharacterCoords = getCharacterCoordinates(element, element.value.length)

    // Somehow we come up 1 pixel too short and the scrollbar appears, so just add one
    setHeight(`${lastCharacterCoords.top + lastCharacterCoords.height + 1}px`)
    element.style.paddingTop = pt

    const lineHeight =
      computedStyles.lineHeight === 'normal' ? `1.2 * ${computedStyles.fontSize}` : computedStyles.lineHeight
    // Using CSS calculations is fast and prevents us from having to parse anything
    if (minHeightLines !== undefined) setMinHeight(`calc(${minHeightLines} * ${lineHeight})`)
    if (maxHeightLines !== undefined) setMaxHeight(`calc(${maxHeightLines} * ${lineHeight})`)
    // `value` is an unnecessary dependency but it enables us to recalculate as the user types
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minHeightLines, maxHeightLines, value, elementRef, disabled])

  useLayoutEffect(refreshHeight, [refreshHeight])

  // With Slots, initial render of the component is delayed and so the initial layout effect can occur
  // before the target element has actually been calculated in the DOM. But if we only use regular effects,
  // there will be a visible flash on initial render when not using slots
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshHeight, [])

  if (disabled) return {}

  return {height, minHeight, maxHeight, boxSizing: 'content-box'}
}
