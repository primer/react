import {forwardRef, useId, useMemo, type ComponentPropsWithoutRef, type PropsWithChildren} from 'react'
import {BaseDialogContext, useBaseDialog} from './BaseDialogContext'
import {ScrollableRegion} from '../ScrollableRegion'
import {VisuallyHidden} from '../VisuallyHidden'
import './polyfill'

type RootProps = PropsWithChildren<{
  nonmodal?: boolean
}>

function Root({children, nonmodal = false}: RootProps) {
  const id = useId()
  const titleId = useId()
  const value = useMemo(() => {
    return {
      id,
      titleId,
      command: nonmodal ? 'show' : 'show-modal',
    } as const
  }, [id, nonmodal, titleId])
  return <BaseDialogContext.Provider value={value}>{children}</BaseDialogContext.Provider>
}

type TriggerProps = ComponentPropsWithoutRef<'button'> & {
  commandfor?: string
  command?: string
}

function Trigger({children, commandfor, command, type = 'button', ...rest}: TriggerProps) {
  const {id, command: parentCommand} = useBaseDialog()
  return (
    // eslint-disable-next-line react/button-has-type, react/no-unknown-property
    <button {...rest} type={type} commandfor={commandfor ?? id} command={command ?? parentCommand}>
      {children}
    </button>
  )
}

type DialogProps = ComponentPropsWithoutRef<'dialog'>

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  {'aria-labelledby': labelledby, children, ...rest},
  ref,
) {
  const {id, titleId} = useBaseDialog()
  return (
    <dialog {...rest} ref={ref} id={id} aria-labelledby={labelledby ?? titleId}>
      {children}
    </dialog>
  )
})

type CloseProps = ComponentPropsWithoutRef<'button'> & {
  commandfor?: string
  command?: string
}

function Close({children, commandfor, command, type = 'button', ...rest}: CloseProps) {
  const {id} = useBaseDialog()
  return (
    // eslint-disable-next-line react/button-has-type, react/no-unknown-property
    <button {...rest} type={type} commandfor={commandfor ?? id} command={command ?? 'close'}>
      {children}
    </button>
  )
}

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>

function Heading({children, id, autoFocus, tabIndex, ...rest}: HeadingProps) {
  const {titleId} = useBaseDialog()

  return (
    <h2 {...rest} id={id ?? titleId} autoFocus={autoFocus} tabIndex={autoFocus ? (tabIndex ?? -1) : tabIndex}>
      {children}
    </h2>
  )
}

type ContentProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'aria-label' | 'aria-labelledby'> & {
  'aria-label'?: string
  'aria-labelledby'?: string
}

function Content({'aria-label': label, 'aria-labelledby': labelledby, children, ...rest}: ContentProps) {
  const {titleId} = useBaseDialog()
  const contentLabelId = useId()

  if (label) {
    return (
      <ScrollableRegion aria-label={label} {...rest}>
        {children}
      </ScrollableRegion>
    )
  }

  if (labelledby) {
    return (
      <ScrollableRegion aria-labelledby={labelledby} {...rest}>
        {children}
      </ScrollableRegion>
    )
  }

  return (
    <>
      <VisuallyHidden id={contentLabelId}>content</VisuallyHidden>
      <ScrollableRegion aria-labelledby={`${titleId} ${contentLabelId}`} {...rest}>
        {children}
      </ScrollableRegion>
    </>
  )
}

export {Root, Trigger, Dialog, Close, Heading, Content}
export type {RootProps, TriggerProps, DialogProps, CloseProps, HeadingProps, ContentProps}
