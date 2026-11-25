import React from 'react'
import {ChevronLeftIcon, XIcon} from '@primer/octicons-react'
import {Button, IconButton, type ButtonProps, type IconButtonProps} from '../Button'
import {useMergedRefs} from '../hooks/useMergedRefs'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {useSelectPanelContext} from './SelectPanelContext'
import {nativeInvokerProps, useNativeSelectPanel} from './platform/NativeSelectPanelContext'

const SelectPanelFormContext = React.createContext<{
  rootId: string
  formRef: React.RefObject<HTMLFormElement>
} | null>(null)

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
    const native = useNativeSelectPanel()
    const invokers = native.invokers && native.targetId === state.panelId && type === 'button'
    return (
      <IconButton
        {...props}
        icon={XIcon}
        {...(ariaLabelledBy ? {'aria-labelledby': ariaLabelledBy, 'aria-label': undefined} : {'aria-label': ariaLabel})}
        variant={variant}
        type={props.loading ? 'button' : type}
        ref={ref}
        {...(invokers ? nativeInvokerProps(state.panelId, native.modal ? 'close' : 'hide-popover') : {})}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented && !props.disabled) {
            if (invokers) return
            event.preventDefault()
            state.dismiss('close')
          }
        }}
      />
    )
  },
)

export const SelectPanelCancelButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function SelectPanelCancelButton({onClick, children = 'Cancel', type = 'button', ...props}, ref) {
    const state = useSelectPanelContext()
    return (
      <Button
        {...props}
        type={props.loading ? 'button' : type}
        ref={ref}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented && !props.disabled) {
            event.preventDefault()
            state.cancel()
          }
        }}
      >
        {children}
      </Button>
    )
  },
)

export const SelectPanelSubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function SelectPanelSubmitButton({onClick, children = 'Save', type, ...props}, ref) {
    const state = useSelectPanelContext()
    const formContext = React.useContext(SelectPanelFormContext)
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const mergedRef = useMergedRefs(ref, buttonRef)
    const [associatedForm, setAssociatedForm] = React.useState<HTMLFormElement | null>(null)
    const isOwnForm = formContext?.rootId === state.id
    const canSubmitForm = isOwnForm && associatedForm !== null && associatedForm === formContext.formRef.current

    // Portals and form attributes can make the DOM association differ from React ancestry.
    useLayoutEffect(() => {
      setAssociatedForm(buttonRef.current?.form ?? null)
    }, [formContext, props.form])

    return (
      <Button
        {...props}
        type={props.loading ? 'button' : (type ?? (canSubmitForm ? 'submit' : 'button'))}
        ref={mergedRef}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented && !props.disabled) {
            const form = isOwnForm ? formContext.formRef.current : null
            if (form && event.currentTarget.form === form && event.currentTarget.type === 'submit') {
              return
            }
            // A portal or form attribute can associate the button with another form.
            event.preventDefault()
            state.submit()
          }
        }}
      >
        {children}
      </Button>
    )
  },
)

export const SelectPanelClearSelectionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function SelectPanelClearSelectionButton({onClick, children = 'Clear selection', type = 'button', ...props}, ref) {
    const state = useSelectPanelContext()
    return (
      <Button
        {...props}
        type={props.loading ? 'button' : type}
        ref={ref}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented && !props.disabled) {
            event.preventDefault()
            state.clearSelection()
          }
        }}
      >
        {children}
      </Button>
    )
  },
)

export const SelectPanelClearSearchButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function SelectPanelClearSearchButton({onClick, children = 'Clear search', type = 'button', ...props}, ref) {
    const state = useSelectPanelContext()
    return (
      <Button
        {...props}
        type={props.loading ? 'button' : type}
        ref={ref}
        onClick={event => {
          onClick?.(event)
          if (!event.defaultPrevented && !props.disabled) {
            event.preventDefault()
            state.setFilterValue('', null)
            state.inputRef.current?.focus()
          }
        }}
      >
        {children}
      </Button>
    )
  },
)

export const SelectPanelBackButton = React.forwardRef<HTMLButtonElement, ButtonProps>(function SelectPanelBackButton(
  {onClick, children = 'Back', type = 'button', leadingVisual = ChevronLeftIcon, ...props},
  ref,
) {
  const state = useSelectPanelContext()
  return (
    <Button
      {...props}
      type={props.loading ? 'button' : type}
      ref={ref}
      leadingVisual={leadingVisual}
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented && !props.disabled) {
          event.preventDefault()
          state.dismiss('back')
        }
      }}
    >
      {children}
    </Button>
  )
})

export type SelectPanelFormProps = React.ComponentPropsWithoutRef<'form'>

/**
 * An opt-in native form adapter. Omit this part when the panel is already inside
 * a form; action buttons do not require a form to submit the current selection.
 * Associated SubmitButtons use native submission and validation.
 */
export const SelectPanelForm = React.forwardRef<HTMLFormElement, SelectPanelFormProps>(function SelectPanelForm(
  {onSubmit, ...props},
  ref,
) {
  const state = useSelectPanelContext()
  const formRef = React.useRef<HTMLFormElement>(null)
  const mergedRef = useMergedRefs(ref, formRef)
  const context = React.useMemo(() => ({rootId: state.id, formRef}), [state.id])
  return (
    <SelectPanelFormContext.Provider value={context}>
      <form
        {...props}
        ref={mergedRef}
        onSubmit={event => {
          if (event.target !== event.currentTarget) return
          event.stopPropagation()
          onSubmit?.(event)
          if (event.defaultPrevented) return
          event.preventDefault()
          state.submit()
        }}
      />
    </SelectPanelFormContext.Provider>
  )
})
