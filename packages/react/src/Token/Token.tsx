import type {MouseEventHandler} from 'react'
import React, {forwardRef} from 'react'
import Box from '../Box'
import {merge, type BetterSystemStyleObject, type SxProp} from '../sx'
import {defaultSxProp} from '../utils/defaultSxProp'
import type {TokenBaseProps} from './TokenBase'
import TokenBase, {defaultTokenSize, isTokenInteractive} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import TokenTextContainer from './_TokenTextContainer'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import VisuallyHidden from '../_VisuallyHidden'
import {useFeatureFlag} from '../FeatureFlags'

import classes from './Token.module.css'
import {clsx} from 'clsx'

// Omitting onResize and onResizeCapture because seems like React 18 types includes these menthod in the expansion but React 17 doesn't.
// TODO: This is a temporary solution until we figure out why these methods are causing type errors.
export interface TokenProps extends TokenBaseProps, SxProp {
  /**
   * A component that renders before the token text
   */
  leadingVisual?: React.ElementType
}

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

const tokenBorderWidthPx = 1

const LeadingVisualContainer: React.FC<React.PropsWithChildren<Pick<TokenBaseProps, 'size'>>> = ({children, size}) => (
  <Box
    sx={{
      flexShrink: 0,
      lineHeight: 0,
      marginRight: size && ['large', 'xlarge'].includes(size) ? 2 : 1,
    }}
  >
    {children}
  </Box>
)

const Token = forwardRef((props, forwardedRef) => {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const {
    as,
    onRemove,
    id,
    leadingVisual: LeadingVisual,
    text,
    size = defaultTokenSize,
    hideRemoveButton,
    href,
    onClick,
    sx: sxProp = defaultSxProp,
    className,
    style,
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
    onClick,
  }

  const mergedSx = merge<BetterSystemStyleObject>(
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
              color: 'fg.default',
            },
          }
        : {}),
    },
    sxProp,
  )

  if (enabled) {
    return (
      <TokenBase
        onRemove={onRemove}
        id={id?.toString()}
        className={clsx(className, classes.Token)}
        text={text}
        size={size}
        sx={sxProp}
        data-is-selected={props.isSelected}
        data-is-remove-btn={!(hideRemoveButton || !onRemove)}
        {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
        {...rest}
        ref={forwardedRef}
        style={{borderWidth: `${tokenBorderWidthPx}px`, ...style}}
      >
        {LeadingVisual ? (
          <LeadingVisualContainer size={size}>
            <LeadingVisual />
          </LeadingVisualContainer>
        ) : null}
        <TokenTextContainer {...(hasMultipleActionTargets ? interactiveTokenProps : {})}>
          {text}
          {onRemove && <VisuallyHidden> (press backspace or delete to remove)</VisuallyHidden>}
        </TokenTextContainer>

        {!hideRemoveButton && onRemove ? (
          <RemoveTokenButton
            borderOffset={tokenBorderWidthPx}
            onClick={onRemoveClick}
            size={size}
            isParentInteractive={isTokenInteractive(props)}
            aria-hidden={hasMultipleActionTargets ? 'true' : 'false'}
          />
        ) : null}
      </TokenBase>
    )
  }

  return (
    <TokenBase
      onRemove={onRemove}
      id={id?.toString()}
      text={text}
      size={size}
      sx={mergedSx}
      className={className}
      {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
      {...rest}
      ref={forwardedRef}
      style={style}
    >
      {LeadingVisual ? (
        <LeadingVisualContainer size={size}>
          <LeadingVisual />
        </LeadingVisualContainer>
      ) : null}
      <TokenTextContainer {...(hasMultipleActionTargets ? interactiveTokenProps : {})}>
        {text}
        {onRemove && <VisuallyHidden> (press backspace or delete to remove)</VisuallyHidden>}
      </TokenTextContainer>

      {!hideRemoveButton && onRemove ? (
        <RemoveTokenButton
          borderOffset={tokenBorderWidthPx}
          onClick={onRemoveClick}
          size={size}
          isParentInteractive={isTokenInteractive(props)}
          aria-hidden={hasMultipleActionTargets ? 'true' : 'false'}
        />
      ) : null}
    </TokenBase>
  )
}) as PolymorphicForwardRefComponent<'a' | 'button' | 'span', TokenProps>

Token.displayName = 'Token'

export default Token
