import React from 'react'
import {XIcon} from '@primer/octicons-react'
import {IconButton, type IconButtonProps} from '../Button'
import {useSelectPanelContext} from './SelectPanelContext'
import {NativeSelectPanelDismissContext} from './platform/NativeSelectPanelContext'

export type SelectPanelCloseButtonProps = Omit<
  IconButtonProps,
  'icon' | 'aria-label' | 'aria-labelledby' | 'children'
> & {
  'aria-label'?: string
  'aria-labelledby'?: string
}

export const SelectPanelCloseButton = React.forwardRef<HTMLButtonElement, SelectPanelCloseButtonProps>(
  function SelectPanelCloseButton(
    {
      onClick,
      'aria-label': ariaLabel = 'Close',
      'aria-labelledby': ariaLabelledBy,
      type = 'button',
      variant = 'invisible',
      ...props
    },
    ref,
  ) {
    const state = useSelectPanelContext()
    const host = React.useContext(NativeSelectPanelDismissContext)
    const dismiss = host?.id === state.id ? host.dismiss : state.dismiss
    return (
      <IconButton
        {...props}
        icon={XIcon}
        {...(ariaLabelledBy ? {'aria-labelledby': ariaLabelledBy, 'aria-label': undefined} : {'aria-label': ariaLabel})}
        variant={variant}
        type={props.loading ? 'button' : type}
        ref={ref}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented && !props.disabled) {
            event.preventDefault()
            dismiss('close', event.nativeEvent)
          }
        }}
      />
    )
  },
)
