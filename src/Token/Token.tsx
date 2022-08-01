import React, {forwardRef, MouseEventHandler} from 'react'
import {Box} from '..'
import {merge, SxProp} from '../sx'
import TokenBase, {defaultTokenSize, isTokenInteractive, TokenBaseProps} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import TokenTextContainer from './_TokenTextContainer'

export interface TokenProps extends TokenBaseProps {
  /**
   * A function that renders a component before the token text
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leadingVisual?: React.ComponentType<React.PropsWithChildren<any>>
}

const tokenBorderWidthPx = 1

const LeadingVisualContainer: React.FC<React.PropsWithChildren<Pick<TokenBaseProps, 'size'>>> = ({children, size}) => (
  <Box
    sx={{
      flexShrink: 0,
      lineHeight: 0,
      marginRight: size && ['large', 'extralarge', 'xlarge'].includes(size) ? 2 : 1
    }}
  >
    {children}
  </Box>
)

const Token = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, TokenProps & SxProp>(
  (props, forwardedRef) => {
    const {
      as,
      onRemove,
      id,
      leadingVisual: LeadingVisual,
      text,
      size,
      hideRemoveButton,
      href,
      onClick,
      sx: sxProp = {},
      ...rest
    } = props
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
    const sx = merge(
      {
        backgroundColor: 'neutral.subtle',
        borderColor: props.isSelected ? 'fg.default' : 'border.subtle',
        borderStyle: 'solid',
        borderWidth: `${tokenBorderWidthPx}px`,
        color: props.isSelected ? 'fg.default' : 'fg.muted',
        maxWidth: '100%',
        paddingRight: !(hideRemoveButton || !onRemove) ? 0 : undefined,
        ...(isTokenInteractive(props)
          ? {
              '&:hover': {
                backgroundColor: 'neutral.muted',
                boxShadow: 'shadow.medium',
                color: 'fg.default'
              }
            }
          : {})
      },
      sxProp as SxProp
    )

    return (
      <TokenBase
        onRemove={onRemove}
        id={id?.toString()}
        text={text}
        size={size}
        sx={sx}
        {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
        {...rest}
        ref={forwardedRef}
      >
        {LeadingVisual ? (
          <LeadingVisualContainer size={size}>
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
      </TokenBase>
    )
  }
)

Token.displayName = 'Token'

Token.defaultProps = {
  size: defaultTokenSize
}

export default Token
