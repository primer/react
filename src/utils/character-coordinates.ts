import getCaretCoordinates from '@koddsson/textarea-caret'

export type Coordinates = {
  top: number
  left: number
}

/**
 * Obtain the coordinates (px) of the bottom left of a character in an input, relative to the
 * top-left corner of the input itself.
 * @param input The target input element.
 * @param index The index of the character to calculate for.
 * @param adjustForScroll Control whether the returned value is adjusted based on scroll position.
 */
export const getCharacterCoordinates = (
  input: HTMLTextAreaElement | HTMLInputElement | null,
  index: number,
  adjustForScroll = true
): Coordinates => {
  if (!input) return {top: 0, left: 0}

  // word-wrap:break-word breaks the getCaretCoordinates calculations (a bug), and word-wrap has
  // no effect on input element anyway
  if (input instanceof HTMLInputElement) input.style.wordWrap = ''

  let coords = getCaretCoordinates(input, index)

  // The library calls parseInt on the computed line-height of the element, failing to account for
  // the possibility of it being 'normal' (another bug). In that case, fall back to a rough guess
  // of 1.2 based on MDN: "Desktop browsers use a default value of roughly 1.2".
  if (isNaN(coords.height)) coords.height = parseInt(getComputedStyle(input).fontSize) * 1.2

  // For some single-line inputs, the rightmost character can be accidentally wrapped even with the
  // wordWrap fix above. If this happens, go back to the last usable index
  let adjustedIndex = index
  while (input instanceof HTMLInputElement && coords.top > coords.height) {
    coords = getCaretCoordinates(input, --adjustedIndex)
  }

  const scrollTopOffset = adjustForScroll ? -input.scrollTop : 0
  const scrollLeftOffset = adjustForScroll ? -input.scrollLeft : 0

  return {top: coords.top + coords.height + scrollTopOffset, left: coords.left + scrollLeftOffset}
}

/**
 * Obtain the coordinates of the bottom left of a character in an input relative to the top-left
 * of the page.
 * @param input The target input element.
 * @param index The index of the character to calculate for.
 */
export const getAbsoluteCharacterCoordinates = (
  input: HTMLTextAreaElement | HTMLInputElement | null,
  index: number
): Coordinates => {
  const {top: relativeTop, left: relativeLeft} = getCharacterCoordinates(input, index, true)
  const {top: viewportOffsetTop, left: viewportOffsetLeft} = input?.getBoundingClientRect() ?? {top: 0, left: 0}

  return {
    top: viewportOffsetTop + relativeTop,
    left: viewportOffsetLeft + relativeLeft
  }
}
