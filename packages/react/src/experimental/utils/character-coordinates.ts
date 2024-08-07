export type CharacterCoordinates = {
  /** Number of pixels from the origin down to the top edge of the character. */
  top: number
  /** Number of pixels from the origin right to the left edge of the character. */
  left: number
  /** Height of the character. */
  height: number
}

// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
const propertiesToCopy = [
  'direction', // RTL support
  'boxSizing',
  'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY', // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration', // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize' as 'tabSize', // prefixed version for Firefox <= 52
] as const

/**
 * Obtain the coordinates (px) of the bottom left of a character in an input, relative to the
 * top-left corner of the interior of the input (not adjusted for scroll).
 *
 * Adapted from https://github.com/koddsson/textarea-caret-position, which was itself
 * forked from https://github.com/component/textarea-caret-position.
 *
 * @param element The target input element.
 * @param index The index of the character to calculate.
 */
export function getCharacterCoordinates(
  element: HTMLTextAreaElement | HTMLInputElement,
  index: number,
): CharacterCoordinates {
  const isFirefox = 'mozInnerScreenX' in window

  // The mirror div will replicate the textarea's style
  const div = document.createElement('div')
  div.id = 'input-textarea-caret-position-mirror-div'
  document.body.appendChild(div)

  const style = div.style
  const computed = window.getComputedStyle(element)

  // Lineheight is either a number or the string 'normal'. In that case, fall back to a
  // rough guess of 1.2 based on MDN: "Desktop browsers use a default value of roughly 1.2".
  const lineHeight = isNaN(parseInt(computed.lineHeight))
    ? parseInt(computed.fontSize) * 1.2
    : parseInt(computed.lineHeight)

  const isInput = element instanceof HTMLInputElement

  // Default wrapping styles
  style.whiteSpace = isInput ? 'nowrap' : 'pre-wrap'
  style.wordWrap = isInput ? '' : 'break-word'

  // Position off-screen
  style.position = 'absolute' // required to return coordinates properly

  // Transfer the element's properties to the div
  for (const prop of propertiesToCopy) {
    if (isInput && prop === 'lineHeight') {
      // Special case for <input>s because text is rendered centered and line height may be != height
      if (computed.boxSizing === 'border-box') {
        const height = parseInt(computed.height)
        const outerHeight =
          parseInt(computed.paddingTop) +
          parseInt(computed.paddingBottom) +
          parseInt(computed.borderTopWidth) +
          parseInt(computed.borderBottomWidth)
        const targetHeight = outerHeight + lineHeight

        if (height > targetHeight) {
          style.lineHeight = `${height - outerHeight}px`
        } else if (height === targetHeight) {
          style.lineHeight = computed.lineHeight
        } else {
          style.lineHeight = '0'
        }
      } else {
        style.lineHeight = computed.height
      }
    } else if (!isInput && prop === 'width' && computed.boxSizing === 'border-box') {
      // With box-sizing: border-box we need to offset the size slightly inwards.  This small difference can compound
      // greatly in long textareas with lots of wrapping, leading to very innacurate results if not accounted for.
      // Firefox will return computed styles in floats, like `0.9px`, while chromium might return `1px` for the same element.
      // Either way we use `parseFloat` to turn `0.9px` into `0.9` and `1px` into `1`
      const totalBorderWidth = parseFloat(computed.borderLeftWidth) + parseFloat(computed.borderRightWidth)
      // When a vertical scrollbar is present it shrinks the content. We need to account for this by using clientWidth
      // instead of width in everything but Firefox. When we do that we also have to account for the border width.
      const width = isFirefox ? parseFloat(computed.width) - totalBorderWidth : element.clientWidth + totalBorderWidth
      style.width = `${width}px`
    } else {
      style[prop] = computed[prop]
    }
  }

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height)) style.overflowY = 'scroll'
  } else {
    style.overflow = 'hidden' // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, index)

  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput) div.textContent = div.textContent.replace(/\s/g, '\u00a0')

  const span = document.createElement('span')
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, '.' is enough because there is no wrapping.
  span.textContent = isInput ? '.' : element.value.substring(index) || '.' // because a completely empty faux span doesn't render at all
  div.appendChild(span)

  const coordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth),
    height: lineHeight,
  }

  document.body.removeChild(div)

  return coordinates
}

/**
 * Obtain the coordinates (px) of the bottom left of a character in an input, relative to the
 * top-left corner of the input element (adjusted for scroll). This includes horizontal
 * scroll in single-line inputs.
 * @param input The target input element.
 * @param index The index of the character to calculate for.
 */
export const getScrollAdjustedCharacterCoordinates = (
  input: HTMLTextAreaElement | HTMLInputElement,
  index: number,
): CharacterCoordinates => {
  const {height, top, left} = getCharacterCoordinates(input, index)

  return {height, top: top - input.scrollTop, left: left - input.scrollLeft}
}

/**
 * Obtain the coordinates (px) of the bottom left of a character in an input, relative to the
 * top-left corner of the document. Since this is relative to the document, it is also adjusted
 * for the input's scroll.
 * @param input The target input element.
 * @param index The index of the character to calculate for.
 */
export const getAbsoluteCharacterCoordinates = (
  input: HTMLTextAreaElement | HTMLInputElement,
  index: number,
): CharacterCoordinates => {
  const {top: relativeTop, left: relativeLeft, height} = getScrollAdjustedCharacterCoordinates(input, index)
  const {top: viewportOffsetTop, left: viewportOffsetLeft} = input.getBoundingClientRect()

  return {
    height,
    top: viewportOffsetTop + relativeTop,
    left: viewportOffsetLeft + relativeLeft,
  }
}
