import type {ComponentRenderFn, HTMLProps} from '@base-ui/react/types'
import React from 'react'

type ActivationCaptureHandlers = Pick<
  React.DOMAttributes<HTMLElement>,
  'onAuxClickCapture' | 'onClickCapture' | 'onKeyDownCapture' | 'onKeyUpCapture'
>

/** Prevents a disabled custom render from activating before Base UI's handlers run. */
export function getDisabledActivationHandlers(
  disabled: boolean,
  {onAuxClickCapture, onClickCapture, onKeyDownCapture, onKeyUpCapture}: ActivationCaptureHandlers,
): ActivationCaptureHandlers {
  if (!disabled) {
    return {
      ...(onAuxClickCapture ? {onAuxClickCapture} : {}),
      ...(onClickCapture ? {onClickCapture} : {}),
      ...(onKeyDownCapture ? {onKeyDownCapture} : {}),
      ...(onKeyUpCapture ? {onKeyUpCapture} : {}),
    }
  }

  const preventActivation = (event: React.SyntheticEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  const handleKeyCapture =
    (onCapture?: React.KeyboardEventHandler<HTMLElement>): React.KeyboardEventHandler<HTMLElement> =>
    event => {
      if (event.key === 'Enter' || event.key === ' ') {
        preventActivation(event)
      } else {
        onCapture?.(event)
      }
    }

  return {
    onAuxClickCapture: preventActivation,
    onClickCapture: preventActivation,
    onKeyDownCapture: handleKeyCapture(onKeyDownCapture),
    onKeyUpCapture: handleKeyCapture(onKeyUpCapture),
  }
}

export function guardDisabledRender<State>(
  disabled: boolean,
  render: React.ReactElement | ComponentRenderFn<HTMLProps, State> | undefined,
): React.ReactElement | ComponentRenderFn<HTMLProps, State> | undefined {
  if (!disabled || !render) return render

  const guardElement = (element: React.ReactElement) => {
    if (!React.isValidElement<ActivationCaptureHandlers>(element)) return element
    const {onAuxClickCapture, onClickCapture, onKeyDownCapture, onKeyUpCapture} = element.props
    if (!onAuxClickCapture && !onClickCapture && !onKeyDownCapture && !onKeyUpCapture) return element
    return React.cloneElement(element, getDisabledActivationHandlers(true, element.props))
  }

  return typeof render === 'function' ? (props, state) => guardElement(render(props, state)) : guardElement(render)
}
