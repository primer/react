import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {VisuallyHidden} from '../VisuallyHidden'
import {TokenBase, TokenRemoveButton, type TokenBaseProps, TokenTextContainer} from './TokenBase'

const token = cva('border border-muted bg-neutral-muted text-muted', {
  variants: {selected: {true: 'border-emphasis text-default', false: ''}},
  defaultVariants: {selected: false},
})
export interface TokenProps extends TokenBaseProps {
  leadingVisual?: React.ElementType
}
export const Token = React.forwardRef<HTMLElement, TokenProps>(function Token(
  {
    children,
    className,
    hideRemoveButton,
    leadingVisual: LeadingVisual,
    onRemove,
    size = 'medium',
    isSelected,
    text,
    ...rest
  },
  ref,
) {
  const isParentInteractive =
    rest.as === 'a' || rest.as === 'button' || Boolean(rest.onClick || rest.onFocus || rest.tabIndex !== undefined)
  const hasMultipleActionTargets = isParentInteractive && Boolean(onRemove && !hideRemoveButton)

  return (
    <TokenBase
      {...rest}
      as={hasMultipleActionTargets ? 'span' : rest.as}
      ref={ref}
      className={cn(token({selected: isSelected}), className)}
      href={hasMultipleActionTargets ? undefined : rest.href}
      hideRemoveButton={hideRemoveButton}
      isSelected={isSelected}
      onClick={hasMultipleActionTargets ? undefined : rest.onClick}
      onRemove={onRemove}
      size={size}
      text={text}
    >
      {LeadingVisual && size !== 'small' ? (
        <span
          aria-hidden="true"
          className={cn('mr-1 shrink-0 leading-none', (size === 'large' || size === 'xlarge') && 'mr-1.5')}
        >
          <LeadingVisual />
        </span>
      ) : null}
      <TokenTextContainer
        as={hasMultipleActionTargets ? rest.as : undefined}
        disabled={rest.disabled}
        href={hasMultipleActionTargets ? rest.href : undefined}
        onClick={hasMultipleActionTargets ? rest.onClick : undefined}
      >
        {text}
        {onRemove ? <VisuallyHidden> (press backspace or delete to remove)</VisuallyHidden> : null}
      </TokenTextContainer>
      {children}
      {onRemove && !hideRemoveButton ? (
        <TokenRemoveButton isParentInteractive={hasMultipleActionTargets} onRemove={onRemove} size={size} text={text} />
      ) : null}
    </TokenBase>
  )
})
