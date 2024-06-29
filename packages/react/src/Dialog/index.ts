import {Dialog as DialogImpl, Header, Title, Subtitle, Body, Footer, Buttons, CloseButton} from './Dialog'
import type {DialogProps, DialogHeaderProps, DialogButtonProps, DialogWidth, DialogHeight} from './Dialog'

DialogImpl.displayName = 'Dialog'
Header.displayName = 'Dialog.Header'
Title.displayName = 'Dialog.Title'
Subtitle.displayName = 'Dialog.Subtitle'
Body.displayName = 'Dialog.Body'
Footer.displayName = 'Dialog.Footer'
Buttons.displayName = 'Dialog.Buttons'
CloseButton.displayName = 'Dialog.CloseButton'

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
