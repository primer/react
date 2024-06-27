import {_Dialog as DialogImpl, Header, Title, Subtitle, Body, Footer, Buttons, CloseButton} from './Dialog'
import type {DialogProps, DialogHeaderProps, DialogButtonProps, DialogWidth, DialogHeight} from './Dialog'

export const Dialog = Object.assign(DialogImpl, {
  Header,
  Title,
  Subtitle,
  Body,
  Footer,
  Buttons,
  CloseButton,
})

export type {DialogProps, DialogHeaderProps, DialogButtonProps, DialogWidth, DialogHeight}
