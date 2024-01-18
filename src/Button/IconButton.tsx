import React, {forwardRef} from 'react'
import {IconButtonProps} from './types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ButtonBase} from './ButtonBase'
import {defaultSxProp} from '../utils/defaultSxProp'
import {generateCustomSxProp} from './Button'
import {Tooltip, TooltipContext} from '../drafts/Tooltip/Tooltip'
import {TooltipContext as TooltipV1Context} from '../Tooltip/Tooltip'
import {MenuContext} from '../ActionMenu/ActionMenu'

const IconButton = forwardRef(
  (
    {sx: sxProp = defaultSxProp, icon: Icon, disabled, 'aria-label': ariaLabel, name, description, ...props},
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
    const {container} = React.useContext(TooltipV1Context) // Tooltip v1
    const {anchorRef, anchorId} = React.useContext(MenuContext)

    // we need to know if the icon button is used as a menu anchor to render the tooltip and aria properties correctly.
    const isIconButtonAnchor = anchorRef !== undefined && anchorId !== undefined
    // aria-label is going to be deprecated in favor of label but for now we are supporting both.
    const iconButtonLabel = name ?? ariaLabel
    if (!tooltipId && container !== 'Tooltip' && !disabled) {
      return (
        // if description exists, we use tooltip for adding description to the icon button. Otherwise, we use tooltip for labelling the icon button.
        // @ts-ignore for now
        <Tooltip text={description ?? iconButtonLabel} type={description ? 'description' : 'label'} ref={forwardedRef}>
          <ButtonBase
            icon={Icon}
            data-component="IconButton"
            data-anchor={isIconButtonAnchor ? 'true' : undefined}
            sx={sxStyles}
            type="button"
            {...props}
            // If description exists, aria-label will be used to label the icon button whereas tooltip will be used to describe the button.
            // Is icon button is used as a menu anchor, aria-label will be used to label the icon button and the menu.)
            aria-label={description || isIconButtonAnchor ? iconButtonLabel : undefined}
          />
        </Tooltip>
      )
    } else {
      return (
        // If icon button is already wrapped in a tooltip, we do not need to add another tooltip.
        <ButtonBase
          icon={Icon}
          data-component="IconButton"
          data-anchor={isIconButtonAnchor ? 'true' : undefined}
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
