import {Root, Trigger, Dialog, Close, Heading, Content} from './BaseDialog'
import type {RootProps, TriggerProps, DialogProps, CloseProps, HeadingProps, ContentProps} from './BaseDialog'

const BaseDialog = Object.assign(Root, {
  Trigger,
  Dialog,
  Close,
  Heading,
  Content,
})

export {BaseDialog, Root, Trigger, Dialog, Close, Heading, Content}
export type {RootProps, TriggerProps, DialogProps, CloseProps, HeadingProps, ContentProps}
