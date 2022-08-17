// Modified from https://github.com/koddsson/textarea-caret-position, which was
// itself forked from https://github.com/component/textarea-caret-position.

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
  'MozTabSize' as 'tabSize'
] as const

function getCaretCoordinates(
  element: HTMLTextAreaElement | HTMLInputElement,
  position: number,
  options?: {debug: boolean}
) {
  const debug = (options && options.debug) || false
  if (debug) {
    const el = document.querySelector('#input-textarea-caret-position-mirror-div')
    if (el) el.parentNode?.removeChild(el)
  }

  const isFirefox = 'mozInnerScreenX' in window

  // The mirror div will replicate the textarea's style
  const div = document.createElement('div')
  div.id = 'input-textarea-caret-position-mirror-div'
  document.body.appendChild(div)

  const style = div.style
  const computed = window.getComputedStyle(element)
  const isInput = element.nodeName === 'INPUT'

  // Default textarea styles
  style.whiteSpace = 'pre-wrap'
  if (!isInput) style.wordWrap = 'break-word' // only for textarea-s

  // Position off-screen
  style.position = 'absolute' // required to return coordinates properly
  if (!debug) style.visibility = 'hidden' // not 'display: none' because we want rendering

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
        const targetHeight = outerHeight + parseInt(computed.lineHeight)
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
      const width = isFirefox ? parseFloat(computed[prop]) - totalBorderWidth : element.clientWidth + totalBorderWidth
      style[prop] = `${width}px`
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

  div.textContent = element.value.substring(0, position)
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput) div.textContent = div.textContent.replace(/\s/g, '\u00a0')

  const span = document.createElement('span')
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  span.textContent = element.value.substring(position) || '.' // || because a completely empty faux span doesn't render at all
  div.appendChild(span)

  const coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  }

  if (debug) {
    span.style.backgroundColor = '#aaa'
  } else {
    document.body.removeChild(div)
  }

  return coordinates
}

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

  // Sometimes top is negative, incorrectly, because of the wierd line-height calculations around
  // border-box sized single-line inputs.
  coords.top = Math.abs(coords.top)

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
