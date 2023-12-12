import React, {forwardRef} from 'react'
import {IconButtonProps} from './types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ButtonBase} from './ButtonBase'
import {defaultSxProp} from '../utils/defaultSxProp'
import {generateCustomSxProp} from './Button'
import {Tooltip, TooltipContext} from '../drafts/Tooltip'

const IconButton = forwardRef(
  (
    {sx: sxProp = defaultSxProp, icon: Icon, disabled, 'aria-label': ariaLabel, label, description, ...props},
    forwardedRef,
  ): JSX.Element => {
    let sxStyles = sxProp
    // grap the button props that have associated data attributes in the styles
    const {size} = props

    if (sxProp !== null && Object.keys(sxProp).length > 0) {
      sxStyles = generateCustomSxProp({size}, sxProp)
    }

    // If the icon button is already wrapped in a tooltip, do not add one.
    const {tooltipId} = React.useContext(TooltipContext)

    // aria-label is going to be deprecated in favor of label but for now we are supporting both.
    const iconButtonLabel = label ?? ariaLabel

    if (!tooltipId && !disabled) {
      return (
        // if description exists, we use tooltip for adding description to the icon button. Otherwise, we use tooltip for labelling the icon button.
        // @ts-ignore for now
        <Tooltip text={description ?? iconButtonLabel} type={description ? 'description' : 'label'}>
          <ButtonBase
            icon={Icon}
            data-component="IconButton"
            sx={sxStyles}
            type="button"
            {...props}
            // @ts-expect-error StyledButton wants both Anchor and Button refs
            ref={forwardedRef}
            // If description exists, we need to explicitly set aria-label to the button for an accessible name
            aria-label={description ? iconButtonLabel : undefined}
          />
        </Tooltip>
      )
    } else {
      return (
        // If icon button is already wrapped in a tooltip, we do not need to add another tooltip.
        <ButtonBase
          icon={Icon}
          data-component="IconButton"
          sx={sxStyles}
          disabled={disabled}
          type="button"
          {...props}
          // @ts-expect-error StyledButton wants both Anchor and Button refs
          ref={forwardedRef}
          // External tooltip can only be used to set description. Icon button should always have aria-label or label
          aria-label={iconButtonLabel}
        />
      )
    }
  },
) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
