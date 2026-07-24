import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {TokenBase, TokenRemoveButton, type TokenBaseProps} from './TokenBase'

const token = cva('border-thin border-muted bg-neutral-muted text-muted', {
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
  return (
    <TokenBase
      {...rest}
      ref={ref}
      className={cn(token({selected: isSelected}), className)}
      hideRemoveButton={hideRemoveButton}
      isSelected={isSelected}
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
      <span className="min-w-0 truncate">{text}</span>
      {children}
      {onRemove && !hideRemoveButton ? <TokenRemoveButton onRemove={onRemove} text={text} /> : null}
    </TokenBase>
  )
})
