import React, {forwardRef} from 'react'
import {IconButtonProps} from './types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
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
      // This is a temporary prop to incrementally introduce tooltips to the IconButton component.
      _enableTooltip_ = false,
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

    const displayTooltip = _enableTooltip_ && !disabled && ariaLabel

    if (displayTooltip) {
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
    } else {
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
    }
  },
) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
