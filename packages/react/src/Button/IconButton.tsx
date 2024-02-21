import React, {forwardRef} from 'react'
import type {IconButtonProps} from './types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ButtonBase} from './ButtonBase'
import {defaultSxProp} from '../utils/defaultSxProp'
import {generateCustomSxProp} from './Button'
import {Tooltip} from '../drafts/Tooltip/Tooltip'

const IconButton = forwardRef(
  (
    {
      sx: sxProp = defaultSxProp,
      icon: Icon,
      'aria-label': ariaLabel,
      description,
      disabled,
      // This is planned to be a temporary prop until the default tooltip on icon buttons are fully rolled out.
      disableTooltip = false,
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

    const withoutTooltip = disableTooltip || disabled || ariaLabel === undefined || ariaLabel === ''

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
      return (
        <Tooltip ref={forwardedRef} text={description ?? ariaLabel} type={description ? undefined : 'label'}>
          <ButtonBase
            icon={Icon}
            data-component="IconButton"
            sx={sxStyles}
            type="button"
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
