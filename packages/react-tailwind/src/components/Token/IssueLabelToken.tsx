import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {TokenBase, TokenRemoveButton, type TokenBaseProps} from './TokenBase'

const issueLabelToken = cva(
  'border-thin border-[color:color-mix(in_srgb,var(--issue-label-color),transparent_70%)] bg-[var(--issue-label-color)] text-[var(--issue-label-fg)]',
  {
    variants: {selected: {true: 'outline-2 outline-offset-2 outline-[var(--issue-label-color)]', false: ''}},
    defaultVariants: {selected: false},
  },
)
export interface IssueLabelTokenProps extends TokenBaseProps {
  fillColor?: string
}
function labelForeground(color: string) {
  const value = color.replace('#', '')
  if (!/^[\da-f]{6}$/i.test(value)) return '#ffffff'
  const rgb = [0, 2, 4].map(offset => Number.parseInt(value.slice(offset, offset + 2), 16))
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 > 140 ? '#24292f' : '#ffffff'
}
export const IssueLabelToken = React.forwardRef<HTMLElement, IssueLabelTokenProps>(function IssueLabelToken(
  {children, className, fillColor = '#999999', hideRemoveButton, isSelected, onRemove, style, text, ...rest},
  ref,
) {
  return (
    <TokenBase
      {...rest}
      ref={ref}
      className={cn(issueLabelToken({selected: isSelected}), className)}
      hideRemoveButton={hideRemoveButton}
      isSelected={isSelected}
      onRemove={onRemove}
      style={
        {
          '--issue-label-color': fillColor,
          '--issue-label-fg': labelForeground(fillColor),
          ...style,
        } as React.CSSProperties
      }
      text={text}
    >
      <span className="min-w-0 truncate">{text}</span>
      {children}
      {onRemove && !hideRemoveButton ? <TokenRemoveButton onRemove={onRemove} text={text} /> : null}
    </TokenBase>
  )
})
