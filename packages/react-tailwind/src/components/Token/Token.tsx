import {cva} from 'class-variance-authority'
import type React from 'react'
import {cn} from '../../internal/cn'
import {
  splitTokenProps,
  type BroadCompoundTokenProps,
  type CompoundTokenProps,
  type CompoundTokenRef,
  type DefaultCompoundTokenProps,
  type OptionalCompoundTokenProps,
  type SpanTokenActionExclusions,
  type TokenElement,
} from '../../internal/token-props'
import {VisuallyHidden} from '../VisuallyHidden'
import {TokenBaseInternal, TokenRemoveButton, type CompoundTokenOwnProps, TokenTextContainer} from './TokenBase'

const token = cva('primer:border-thin primer:border-muted primer:bg-neutral-muted primer:text-muted', {
  variants: {selected: {true: 'primer:border-emphasis primer:text-default', false: ''}},
  defaultVariants: {selected: false},
})
interface TokenOwnVisualProps extends CompoundTokenOwnProps {
  /** Icon shown before the token's text. */
  leadingVisual?: React.ElementType
}
export type TokenProps<As extends TokenElement = never, Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>> = [
  As,
] extends [never]
  ? DefaultCompoundTokenProps<TokenOwnVisualProps>
  : CompoundTokenProps<As, TokenOwnVisualProps, Ref>

export function Token<Ref extends CompoundTokenRef<'span'> = CompoundTokenRef<'span'>>(
  props: CompoundTokenProps<'span', TokenOwnVisualProps, Ref> & SpanTokenActionExclusions<TokenOwnVisualProps>,
): React.ReactElement
export function Token<As extends TokenElement, Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>>(
  props: OptionalCompoundTokenProps<As, TokenOwnVisualProps, Ref>,
): React.ReactElement
export function Token<As extends TokenElement = 'span', Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>>(
  props: CompoundTokenProps<As, TokenOwnVisualProps, Ref> & {as: As},
): React.ReactElement
export function Token<As extends TokenElement = 'span', Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>>(
  props: CompoundTokenProps<As, CompoundTokenOwnProps, Ref> & {as: As},
): React.ReactElement
export function Token<Inferred extends DefaultCompoundTokenProps<TokenOwnVisualProps>>(
  props: BroadCompoundTokenProps<TokenOwnVisualProps, Inferred>,
): React.ReactElement
export function Token<As extends TokenElement = 'span', Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>>({
  children,
  className,
  hideRemoveButton,
  leadingVisual: LeadingVisual,
  onRemove,
  removeButtonLabel,
  size = 'medium',
  isSelected,
  text,
  type,
  as,
  ref,
  ...rest
}: CompoundTokenProps<As, TokenOwnVisualProps, Ref>) {
  const isParentInteractive =
    (as !== undefined && as !== 'span') || Boolean(rest.onClick || rest.onFocus || rest.tabIndex !== undefined)
  const hasMultipleActionTargets = isParentInteractive && Boolean(onRemove && !hideRemoveButton)
  const {rootProps, actionProps} = splitTokenProps(rest, as, hasMultipleActionTargets)

  return (
    <TokenBaseInternal
      {...rootProps}
      as={hasMultipleActionTargets ? 'span' : as}
      ref={ref}
      className={cn(token({selected: isSelected}), className)}
      href={hasMultipleActionTargets ? undefined : rest.href}
      hideRemoveButton={hideRemoveButton}
      isSelected={isSelected}
      onClick={hasMultipleActionTargets ? undefined : rest.onClick}
      onRemove={onRemove}
      size={size}
      text={text}
      type={hasMultipleActionTargets ? undefined : type}
    >
      {LeadingVisual && size !== 'small' ? (
        <span
          aria-hidden="true"
          className={cn(
            'primer:mr-1 primer:shrink-0 primer:leading-none',
            (size === 'large' || size === 'xlarge') && 'primer:mr-1.5',
          )}
        >
          <LeadingVisual />
        </span>
      ) : null}
      <TokenTextContainer
        {...actionProps}
        as={hasMultipleActionTargets ? as : undefined}
        disabled={rest.disabled}
        href={hasMultipleActionTargets ? rest.href : undefined}
        onClick={hasMultipleActionTargets ? rest.onClick : undefined}
        type={hasMultipleActionTargets ? type : undefined}
      >
        {text}
        {onRemove ? <VisuallyHidden> (press backspace or delete to remove)</VisuallyHidden> : null}
      </TokenTextContainer>
      {children}
      {onRemove && !hideRemoveButton ? (
        <TokenRemoveButton
          isParentInteractive={hasMultipleActionTargets}
          label={removeButtonLabel}
          onRemove={onRemove}
          size={size}
          text={text}
        />
      ) : null}
    </TokenBaseInternal>
  )
}
