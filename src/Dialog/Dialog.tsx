import React, {useCallback, useRef} from 'react'
import styled from 'styled-components'
import {Button, ButtonPrimary, ButtonDanger, ButtonProps, Flex} from '..'
import {get, SystemCommonProps, SystemPositionProps, COMMON, POSITION} from '../constants'
import {useAnchoredPosition, useOnEscapePress} from '../hooks'
import {useFocusTrap} from '../hooks/useFocusTrap'
import sx, {SxProp} from '../sx'
import StyledOcticon from '../StyledOcticon'
import {XIcon} from '@primer/octicons-react'
import {useFocusZone} from '../hooks/useFocusZone'
import {FocusKeys} from '../behaviors/focusZone'
import Portal from '../Portal'

const ANIMATION_DURATION = "200ms"

export type DialogButtonProps = ButtonProps & {
  element?: typeof Button | typeof ButtonPrimary | typeof ButtonDanger
  text: string
}

export interface DialogProps {
  title?: string | JSX.Element
  subtitle?: string | JSX.Element
  renderHeader?: (title: string | JSX.Element | undefined) => React.ReactNode
  renderBody?: (contents: React.ReactNode) => React.ReactNode
  renderFooter?: (buttons: DialogButtonProps[] | undefined) => React.ReactNode
  footerButtons?: DialogButtonProps[]
  onClose: () => void
}

const Backdrop = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: black;
  animation: dialog-backdrop-appear ${ANIMATION_DURATION} ${get('animation.easeOutCubic')};
  opacity: 0.4;

  @keyframes dialog-backdrop-appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.4;
    }
  }
`

const heightMap = {
  sm: '480px',
  md: '640px',
  auto: 'auto'
}

const widthMap = {
  sm: '296px',
  md: '320px',
  lg: '480px',
  xl: '640px',
  auto: 'auto'
}

interface StyledDialogProps {
  width?: keyof typeof widthMap
  height?: keyof typeof heightMap
  visibility?: 'visible' | 'hidden'
}

/*

Dialog questions:

1. How does "auto" width and height work?
2. Closing animation?
3. Backdrop fade-in?
4. Auto focus on dialog open?

*/

const StyledDialog = styled.div<StyledDialogProps & SystemCommonProps & SystemPositionProps & SxProp>`
  display: flex;
  flex-direction: column;
  background-color: ${get('colors.bg.overlay')};
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 8px 24px rgba(149, 157, 165, 0.2);
  position: absolute;
  min-width: 296px;
  max-width: 640px;
  min-height: 480px;
  max-height: 640px;
  width: ${props => widthMap[props.width ?? 'auto']};
  height: ${props => heightMap[props.height ?? 'auto']};
  border-radius: 12px;
  overflow: hidden;
  animation: ${props =>
    // only apply the animation when the dialog becomes visible
    props.visibility === 'hidden'
      ? 'none'
      : `overlay--dialog-appear ${ANIMATION_DURATION} ${get('animation.easeOutCubic')(props)}`};

  @keyframes overlay--dialog-appear {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  visibility: ${props => props.visibility};
  ${COMMON};
  ${POSITION};
  ${sx};
`

const _Dialog: React.FC<DialogProps> = ({
  title = 'Dialog',
  subtitle = '',
  renderHeader,
  renderBody,
  renderFooter,
  footerButtons,
  onClose,
  children
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  useFocusTrap({containerRef: dialogRef})
  const {position} = useAnchoredPosition({
    side: 'inside-center',
    align: 'center',
    anchorElementRef: backdropRef,
    floatingElementRef: dialogRef
  })
  const {containerRef: footerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest'
  })

  useOnEscapePress(
    (event: KeyboardEvent) => {
      onClose()
      event.preventDefault()
    },
    [onClose]
  )

  const header = renderHeader?.(title) ?? (
    <Dialog.Header>
      <Flex>
        <Flex pt={2} flexDirection="column" flexGrow={1}>
          <Dialog.Title>{title ?? 'Dialog'}</Dialog.Title>
          {subtitle && <Dialog.Subtitle>{subtitle}</Dialog.Subtitle>}
        </Flex>
        <DialogCloseButton onClick={onClose}>
          <StyledOcticon icon={XIcon} />
        </DialogCloseButton>
      </Flex>
    </Dialog.Header>
  )
  const body = renderBody?.(children) ?? <Dialog.Body>{children}</Dialog.Body>
  const footer =
    renderFooter?.(footerButtons) ??
    (footerButtons && (
      <Dialog.Footer ref={footerRef}>
        {footerButtons.map((dialogButtonProps, index) => {
          const {text, element: Element = Button, ...buttonProps} = dialogButtonProps
          return (
            <Element key={index} ml={index === 0 ? 0 : 1} {...buttonProps}>
              {text}
            </Element>
          )
        })}
      </Dialog.Footer>
    ))
  return (
    <>
      <Portal>
        <Backdrop ref={backdropRef}></Backdrop>
        <StyledDialog {...position} visibility={position ? 'visible' : 'hidden'} ref={dialogRef}>
          {header}
          {body}
          {footer}
        </StyledDialog>
      </Portal>
    </>
  )
}

const DialogCloseButton = styled(Button)`
  border-radius: 4px;
  background: transparent;
  border: 0;
  vertical-align: middle;
  color: ${get('colors.text.secondary')};
  padding: ${get('space.2')};
  align-self: flex-start;
  line-height: normal;
  box-shadow: none;
`

const Header = styled.header`
  box-shadow: 0 1px 0 ${get('colors.border.overlay')};
  padding: 6px 6px 14px ${get('space.3')};
  z-index: 1;
`
const Title = styled.div`
  font-size: ${get('fontSizes.1')};
  font-weight: 700;
`
const Subtitle = styled.div`
  font-size: ${get('fontSizes.0')};
  color: ${get('colors.text.tertiary')};
`
const Body = styled.div`
  overflow: auto;
  padding: ${get('space.3')};
`
const Footer = styled.footer`
  box-shadow: 0 -1px 0 ${get('colors.border.overlay')};
  padding: ${get('space.3')};
  display: flex;
  justify-content: flex-end;
  z-index: 1;
`

export const Dialog = Object.assign(_Dialog, {
  Header,
  Title,
  Subtitle,
  Body,
  Footer
})
