import type {MouseEventHandler} from 'react'
import type React from 'react'
import {forwardRef} from 'react'
import type {TokenBaseProps} from './TokenBase'
import TokenBase, {defaultTokenSize, isTokenInteractive} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import TokenTextContainer from './_TokenTextContainer'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import VisuallyHidden from '../_VisuallyHidden'

import classes from './Token.module.css'
import {clsx} from 'clsx'

// Omitting onResize and onResizeCapture because seems like React 18 types includes these menthod in the expansion but React 17 doesn't.
// TODO: This is a temporary solution until we figure out why these methods are causing type errors.
export interface TokenProps extends TokenBaseProps {
  /**
   * A component that renders before the token text
   * disabled when size is 'small'
   */
  leadingVisual?: React.ElementType
}

const tokenBorderWidthPx = 1

const LeadingVisualContainer: React.FC<React.PropsWithChildren<Pick<TokenBaseProps, 'size'>>> = ({children, size}) => (
  <div
    className={clsx(classes.LeadingVisualContainer, {
      [classes.LargeLeadingVisual]: size && ['large', 'xlarge'].includes(size),
    })}
  >
    {children}
  </div>
)

const Token = forwardRef((props, forwardedRef) => {
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
  return (
    <TokenBase
      onRemove={onRemove}
      id={id?.toString()}
      className={clsx(className, classes.Token)}
      text={text}
      size={size}
      data-is-selected={props.isSelected}
      data-is-remove-btn={!(hideRemoveButton || !onRemove)}
      {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
      {...rest}
      ref={forwardedRef}
      style={{borderWidth: `${tokenBorderWidthPx}px`, ...style}}
    >
      {LeadingVisual && size !== 'small' ? (
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
