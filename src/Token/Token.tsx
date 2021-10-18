import React, {forwardRef, MouseEventHandler} from 'react'
import styled, {css} from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import TokenBase, {defaultTokenSize, isTokenInteractive, TokenBaseProps} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import TokenTextContainer from './_TokenTextContainer'

export interface TokenProps extends TokenBaseProps {
  /**
   * A function that renders a component before the token text
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leadingVisual?: React.ComponentType<any>
  /**
   * Whether the remove button should be rendered in the token
   */
  hideRemoveButton?: boolean
}

const tokenBorderWidthPx = 1

const DefaultTokenStyled = styled(TokenBase)<TokenProps & {isTokenInteractive: boolean} & SxProp>`
  background-color: ${get('colors.neutral.subtle')};
  border-color: ${props => (props.isSelected ? get('colors.fg.default') : get('colors.border.subtle'))};
  border-style: solid;
  border-width: ${tokenBorderWidthPx}px;
  color: ${props => (props.isSelected ? get('colors.fg.default') : get('colors.fg.muted'))};
  max-width: 100%;
  padding-right: ${props => (!props.hideRemoveButton ? 0 : undefined)};
  position: relative;
  ${sx}

  ${props => {
    if (props.isTokenInteractive) {
      return css`
        &:hover {
          background-color: ${get('colors.neutral.muted')};
          box-shadow: ${get('colors.shadow.medium')};
          color: ${get('colors.fg.default')};
        }
      `
    }
  }}
`

const LeadingVisualContainer = styled('span')`
  flex-shrink: 0;
  line-height: 0;
`

const Token = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, TokenProps & SxProp>(
  (props, forwardedRef) => {
    const {as, onRemove, id, leadingVisual: LeadingVisual, text, size, hideRemoveButton, href, onClick, ...rest} = props
    const hasMultipleActionTargets = isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton
    const onRemoveClick: MouseEventHandler = e => {
      e.stopPropagation()
      onRemove && onRemove()
    }
    const interactiveTokenProps = {
      as,
      href,
      onClick
    }

    return (
      <DefaultTokenStyled
        onRemove={onRemove}
        hideRemoveButton={hideRemoveButton || !onRemove}
        id={id?.toString()}
        text={text}
        size={size}
        isTokenInteractive={isTokenInteractive(props)}
        {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
        {...rest}
        ref={forwardedRef}
      >
        {LeadingVisual ? (
          <LeadingVisualContainer>
            <LeadingVisual />
          </LeadingVisualContainer>
        ) : null}
        <TokenTextContainer {...(hasMultipleActionTargets ? interactiveTokenProps : {})}>{text}</TokenTextContainer>
        {!hideRemoveButton && onRemove ? (
          <RemoveTokenButton
            borderOffset={tokenBorderWidthPx}
            onClick={onRemoveClick}
            size={size}
            isParentInteractive={isTokenInteractive(props)}
            aria-hidden={hasMultipleActionTargets ? 'true' : 'false'}
            sx={
              hasMultipleActionTargets
                ? {
                    position: 'relative',
                    zIndex: '1'
                  }
                : {}
            }
          />
        ) : null}
      </DefaultTokenStyled>
    )
  }
)

Token.displayName = 'Token'

Token.defaultProps = {
  size: defaultTokenSize
}

export default Token
