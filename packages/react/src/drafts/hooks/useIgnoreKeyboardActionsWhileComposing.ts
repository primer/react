import {isMacOS} from '@primer/behaviors/utils'
import type {CompositionEventHandler, KeyboardEventHandler} from 'react'
import {useCallback, useMemo, useRef} from 'react'

/**
 * If the user is composing text, we don't want to respond to
 * the `Enter` key to perform a typical activation
 *
 * Composing text is a special case where the user is inputting
 * text from IME (e.g. Japanese) and we don't want to save the
 * item upon receiving the enter key as that may be part of the
 * selection of the character into the input.
 *
 * issue: https://github.com/github/memex/issues/5680
 * related: https://github.com/github/memex/issues/5680
 * related: https://github.com/facebook/react/issues/3926
 *
 * @param onKeyDown: A keyboard handler callback to wrap with a callback which ignores `ENTER` while
 * composing.
 *
 * @returns props which should be spread onto an `<input>` element
 *
 * @deprecated Will be removed in v37 (https://github.com/primer/react/issues/3604)
 **/
export const useIgnoreKeyboardActionsWhileComposing = (
  onKeyDown: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>,
) => {
  const isComposingRef = useRef(false)
  const hasCompositionEndedRef = useRef(false)

  const handleComposition: CompositionEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement> =
    useCallback(event => {
      if (event.type === 'compositionstart') {
        isComposingRef.current = true
        hasCompositionEndedRef.current = false
      }
      if (event.type === 'compositionend') {
        isComposingRef.current = false
        hasCompositionEndedRef.current = true
      }
    }, [])

  const wrappedOnKeyDown: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement> = useCallback(
    event => {
      if (event.key === 'Enter' && isComposingRef.current) {
        return
      }

      /*
       * Safari is known to fire the a unprintable keydown event of 229
       * after the `compositionend` event.
       * This is a workaround to prevent the keydown event from firing and causing
       * the input to be saved.
       *
       * Related: https://bugs.webkit.org/show_bug.cgi?id=165004
       * Related: https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/
       */
      if (isMacOS() && event.keyCode === 229 && hasCompositionEndedRef.current) {
        hasCompositionEndedRef.current = false
        return
      }
      onKeyDown(event)
    },
    [onKeyDown],
  )

  const inputProps = useMemo(() => {
    return {
      onCompositionStart: handleComposition,
      onCompositionEnd: handleComposition,
      onKeyDown: wrappedOnKeyDown,
    }
  }, [handleComposition, wrappedOnKeyDown])

  return inputProps
}
