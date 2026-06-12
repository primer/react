import {forwardRef, useId, useMemo, type ComponentPropsWithoutRef, type PropsWithChildren} from 'react'
import {BaseDialogContext, useBaseDialog} from './BaseDialogContext'
import {ScrollableRegion} from '../ScrollableRegion'
import type {Labelled} from '../ScrollableRegion'
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

function Heading({children, id, ...rest}: HeadingProps) {
  const {titleId} = useBaseDialog()

  return (
    <h2 {...rest} id={id ?? titleId}>
      {children}
    </h2>
  )
}

type ContentProps = React.HTMLAttributes<HTMLElement> & Labelled

function Content({children, ...rest}: ContentProps) {
  return <ScrollableRegion {...rest}>{children}</ScrollableRegion>
}

export {Root, Trigger, Dialog, Close, Heading, Content}
export type {RootProps, TriggerProps, DialogProps, CloseProps, HeadingProps, ContentProps}
