import {parseToHsla, parseToRgba} from 'color2k'
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
import {TokenBaseInternal, TokenRemoveButton, type CompoundTokenOwnProps, TokenTextContainer} from './TokenBase'

const issueLabelToken = cva('primer:border-thin primer:border-solid', {
  variants: {
    selected: {
      true: 'primer:outline-2 primer:outline-offset-2 primer:outline-[var(--issue-label-selected-outline)]',
      false: '',
    },
  },
  defaultVariants: {selected: false},
})
interface IssueLabelTokenOwnProps extends CompoundTokenOwnProps {
  /** Custom hex colour for the token, matching the label it represents. */
  fillColor?: string
}
export type IssueLabelTokenProps<
  As extends TokenElement = never,
  Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>,
> = [As] extends [never]
  ? DefaultCompoundTokenProps<IssueLabelTokenOwnProps>
  : CompoundTokenProps<As, IssueLabelTokenOwnProps, Ref>

function issueLabelColorProperties(color: string): React.CSSProperties {
  const [red, green, blue] = parseToRgba(color)
  const [hue, saturation, lightness] = parseToHsla(color)
  const perceivedLightness = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
  const lightForeground = perceivedLightness < 0.453 ? 'hsl(0 0% 100%)' : 'hsl(0 0% 0%)'
  const lightBorderAlpha = Math.max(0, Math.min((perceivedLightness - 0.96) * 100, 1))
  const darkLightness = lightness * 100 + Math.max(0, 0.6 - perceivedLightness) * 100
  const lightSelectedLightness = lightness * 100 - 5

  return {
    '--issue-label-light-background': `rgb(${red} ${green} ${blue})`,
    '--issue-label-light-foreground': lightForeground,
    '--issue-label-light-border': `hsl(${hue} ${saturation * 100}% ${lightness * 100 - 25}% / ${lightBorderAlpha})`,
    '--issue-label-light-hover-background': `linear-gradient(rgb(0 0 0 / 15%), rgb(0 0 0 / 15%)), rgb(${red} ${green} ${blue})`,
    '--issue-label-light-selected-background': `hsl(${hue} ${saturation * 100}% ${lightSelectedLightness}%)`,
    '--issue-label-dark-background': `rgb(${red} ${green} ${blue} / 18%)`,
    '--issue-label-dark-foreground': `hsl(${hue} ${saturation * 100}% ${darkLightness}%)`,
    '--issue-label-dark-border': `hsl(${hue} ${saturation * 100}% ${darkLightness}% / 30%)`,
    '--issue-label-dark-hover-background': `hsl(${hue} ${saturation * 100}% ${lightness * 100 + 10}% / 30%)`,
    '--issue-label-selected-outline': `rgb(${red} ${green} ${blue})`,
  } as React.CSSProperties
}
export function IssueLabelToken<Ref extends CompoundTokenRef<'span'> = CompoundTokenRef<'span'>>(
  props: CompoundTokenProps<'span', IssueLabelTokenOwnProps, Ref> & SpanTokenActionExclusions<IssueLabelTokenOwnProps>,
): React.ReactElement
export function IssueLabelToken<As extends TokenElement, Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>>(
  props: OptionalCompoundTokenProps<As, IssueLabelTokenOwnProps, Ref>,
): React.ReactElement
export function IssueLabelToken<
  As extends TokenElement = 'span',
  Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>,
>(props: CompoundTokenProps<As, IssueLabelTokenOwnProps, Ref> & {as: As}): React.ReactElement
export function IssueLabelToken<
  As extends TokenElement = 'span',
  Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>,
>(props: CompoundTokenProps<As, CompoundTokenOwnProps, Ref> & {as: As}): React.ReactElement
export function IssueLabelToken<Inferred extends DefaultCompoundTokenProps<IssueLabelTokenOwnProps>>(
  props: BroadCompoundTokenProps<IssueLabelTokenOwnProps, Inferred>,
): React.ReactElement
export function IssueLabelToken<
  As extends TokenElement = 'span',
  Ref extends CompoundTokenRef<As> = CompoundTokenRef<As>,
>({
  children,
  className,
  fillColor = '#999999',
  hideRemoveButton,
  isSelected,
  onRemove,
  removeButtonLabel,
  style,
  text,
  type,
  as,
  ref,
  ...rest
}: CompoundTokenProps<As, IssueLabelTokenOwnProps, Ref>) {
  const isParentInteractive =
    (as !== undefined && as !== 'span') || Boolean(rest.onClick || rest.onFocus || rest.tabIndex !== undefined)
  const hasMultipleActionTargets = isParentInteractive && Boolean(onRemove && !hideRemoveButton)
  const {rootProps, actionProps} = splitTokenProps(rest, as, hasMultipleActionTargets)

  return (
    <TokenBaseInternal
      {...rootProps}
      as={hasMultipleActionTargets ? 'span' : as}
      ref={ref}
      className={cn(issueLabelToken({selected: isSelected}), className)}
      href={hasMultipleActionTargets ? undefined : rest.href}
      hideRemoveButton={hideRemoveButton}
      isSelected={isSelected}
      onClick={hasMultipleActionTargets ? undefined : rest.onClick}
      onRemove={onRemove}
      data-token-kind="issue-label"
      style={{...issueLabelColorProperties(fillColor), ...style}}
      text={text}
      type={hasMultipleActionTargets ? undefined : type}
    >
      <TokenTextContainer
        {...actionProps}
        as={hasMultipleActionTargets ? as : undefined}
        disabled={rest.disabled}
        href={hasMultipleActionTargets ? rest.href : undefined}
        onClick={hasMultipleActionTargets ? rest.onClick : undefined}
        type={hasMultipleActionTargets ? type : undefined}
      >
        {text}
      </TokenTextContainer>
      {children}
      {onRemove && !hideRemoveButton ? (
        <TokenRemoveButton
          isParentInteractive={hasMultipleActionTargets}
          label={removeButtonLabel}
          onRemove={onRemove}
          size={rest.size}
          text={text}
        />
      ) : null}
    </TokenBaseInternal>
  )
}
