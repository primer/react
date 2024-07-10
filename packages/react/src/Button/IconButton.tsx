import React, {forwardRef} from 'react'
import type {IconButtonProps} from './types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ButtonBase} from './ButtonBase'
import {defaultSxProp} from '../utils/defaultSxProp'
import {generateCustomSxProp} from './Button'
import {TooltipContext, Tooltip} from '../TooltipV2/Tooltip'
import {TooltipContext as TooltipContextV1} from '../Tooltip/Tooltip'

const IconButton = forwardRef(
  (
    {
      sx: sxProp = defaultSxProp,
      icon: Icon,
      'aria-label': ariaLabel,
      description,
      disabled,
      tooltipDirection,
      // This is planned to be a temporary prop until the default tooltip on icon buttons are fully rolled out.
      unsafeDisableTooltip = false,
      keyshortcuts,
      ...props
    },
    forwardedRef,
  ): JSX.Element => {
    let sxStyles = sxProp
    // grap the button props that have associated data attributes in the styles
    const {size} = props

    if (sxProp !== null && Object.keys(sxProp).length > 0) {
      sxStyles = generateCustomSxProp({size}, sxProp)
    }

    // If the icon button is already wrapped in a tooltip, do not add one.
    const {tooltipId} = React.useContext(TooltipContext) // Tooltip v2
    const {tooltipId: tooltipIdV1} = React.useContext(TooltipContextV1) // Tooltip v1

    const hasExternalTooltip = tooltipId || tooltipIdV1
    const withoutTooltip =
      unsafeDisableTooltip || disabled || ariaLabel === undefined || ariaLabel === '' || hasExternalTooltip

    if (withoutTooltip) {
      return (
        <ButtonBase
          icon={Icon}
          data-component="IconButton"
          sx={sxStyles}
          type="button"
          aria-label={ariaLabel}
          disabled={disabled}
          {...props}
          // @ts-expect-error StyledButton wants both Anchor and Button refs
          ref={forwardedRef}
        />
      )
    } else {
      // Does it have keyshortcuts?
      const tooltipSuffix = keyshortcuts ? `, ${keyshortcuts}` : ''
      const tooltipText = description ?? ariaLabel
      return (
        <Tooltip
          ref={forwardedRef}
          text={`${tooltipText}${tooltipSuffix}`}
          type={description ? undefined : 'label'}
          direction={tooltipDirection}
        >
          <ButtonBase
            icon={Icon}
            data-component="IconButton"
            sx={sxStyles}
            type="button"
            aria-keyshortcuts={keyshortcuts ?? undefined}
            // If description is provided, we will use the tooltip to describe the button, so we need to keep the aria-label to label the button.
            aria-label={description ? ariaLabel : undefined}
            {...props}
          />
        </Tooltip>
      )
    }
  },
) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
