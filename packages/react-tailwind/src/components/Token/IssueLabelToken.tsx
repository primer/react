import {parseToHsla, parseToRgba} from 'color2k'
import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {TokenBase, TokenRemoveButton, type TokenBaseProps, TokenTextContainer} from './TokenBase'

const issueLabelToken = cva('border border-solid', {
  variants: {selected: {true: 'outline-2 outline-offset-2 outline-[var(--issue-label-selected-outline)]', false: ''}},
  defaultVariants: {selected: false},
})
export interface IssueLabelTokenProps extends TokenBaseProps {
  /** Custom hex colour for the token, matching the label it represents. */
  fillColor?: string
}

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
export const IssueLabelToken = React.forwardRef<HTMLElement, IssueLabelTokenProps>(function IssueLabelToken(
  {children, className, fillColor = '#999999', hideRemoveButton, isSelected, onRemove, style, text, type, ...rest},
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
        as={hasMultipleActionTargets ? rest.as : undefined}
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
          onRemove={onRemove}
          size={rest.size}
          text={text}
        />
      ) : null}
    </TokenBase>
  )
})
