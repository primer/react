import type {MouseEventHandler} from 'react'
import {forwardRef, useMemo} from 'react'
import type {TokenBaseProps} from './TokenBase'
import TokenBase, {defaultTokenSize, isTokenInteractive} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import {parseToHsla, parseToRgba} from 'color2k'
import TokenTextContainer from './_TokenTextContainer'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './IssueLabelToken.module.css'
import {clsx} from 'clsx'

export interface IssueLabelTokenProps extends TokenBaseProps {
  /**
   * The color that corresponds to the label
   */
  fillColor?: string
}

const IssueLabelToken = forwardRef((props, forwardedRef) => {
  const {
    as,
    fillColor = '#999',
    onRemove,
    id,
    isSelected,
    text,
    size = defaultTokenSize,
    hideRemoveButton,
    href,
    onClick,
    className,
    ...rest
  } = props
  const interactiveTokenProps = {
    as,
    href,
    onClick,
  }

  const hasMultipleActionTargets = isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton
  const onRemoveClick: MouseEventHandler = e => {
    e.stopPropagation()
    onRemove && onRemove()
  }

  const customProperties: React.CSSProperties = useMemo(() => {
    const [r, g, b] = parseToRgba(fillColor)
    const [h, s, l] = parseToHsla(fillColor)

    return {
      '--label-r': String(r),
      '--label-g': String(g),
      '--label-b': String(b),
      '--label-h': String(Math.round(h)),
      '--label-s': String(Math.round(s * 100)),
      '--label-l': String(Math.round(l * 100)),
    } as React.CSSProperties
  }, [fillColor])

  return (
    <TokenBase
      onRemove={onRemove}
      id={id?.toString()}
      isSelected={isSelected}
      className={clsx(classes.IssueLabel, className)}
      text={text}
      size={size}
      style={customProperties}
      data-has-remove-button={!hideRemoveButton && !!onRemove}
      data-selected={isSelected}
      {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
      {...rest}
      ref={forwardedRef}
    >
      <TokenTextContainer {...(hasMultipleActionTargets ? interactiveTokenProps : {})}>{text}</TokenTextContainer>
      {!hideRemoveButton && onRemove ? (
        <RemoveTokenButton
          borderOffset={1}
          onClick={onRemoveClick}
          size={size}
          aria-hidden={hasMultipleActionTargets ? 'true' : 'false'}
          isParentInteractive={isTokenInteractive(props)}
          data-has-multiple-action-targets={hasMultipleActionTargets}
          className={classes.RemoveButton}
        />
      ) : null}
    </TokenBase>
  )
}) as PolymorphicForwardRefComponent<'span' | 'a' | 'button', IssueLabelTokenProps>
IssueLabelToken.displayName = 'IssueLabelToken'
export default IssueLabelToken
