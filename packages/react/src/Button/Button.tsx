import React, {forwardRef} from 'react'
import type {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'
import type {BetterSystemStyleObject, CSSCustomProperties} from '../sx'

/**
 * Button is used to initiate actions on a page or form.
 * @primerid button
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export const ButtonComponent = forwardRef(
  ({children, sx: sxProp = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
    const {block, size = 'medium', leadingVisual, trailingVisual, trailingAction} = props
    let sxStyles = sxProp
    const style: CSSCustomProperties = {}

    if (sxProp !== null && Object.keys(sxProp).length > 0) {
      sxStyles = generateCustomSxProp({block, size, leadingVisual, trailingVisual, trailingAction}, sxProp)

      // @ts-ignore sxProp can have color attribute
      const {color} = sxProp
      if (color) style['--button-color'] = color
    }

    return (
      <ButtonBase ref={forwardedRef} as="button" sx={sxStyles} style={style} type="button" {...props}>
        {children}
      </ButtonBase>
    )
  },
) as PolymorphicForwardRefComponent<'button', ButtonProps>

// This function is used to generate a custom cssSelector for the sxProp

// The usual sx prop can like this:
// sx={{
//   [`@media (max-width: 768px)`]: {
//     '& > ul': {
//       backgroundColor: 'deeppink',
//     },
//     '&:hover': {
//       backgroundColor: 'yellow',
//     },
//   },
//  '&:hover': {
//     backgroundColor: 'yellow',
//   },
//  '&': {
//  width : 320px
// }
// }}
//*
/* What we want for Button styles is this:
sx={{
//   [`@media (max-width: 768px)`]: {
//     '&[data-attribute="something"] > ul': {
//       backgroundColor: 'deeppink',
//     },
//     '&[data-attribute="something"]:hover': {
//       backgroundColor: 'yellow',
//     },
//   },
//  '&[data-attribute="something"]:hover': {
//     backgroundColor: 'yellow',
//   },
//  '&[data-attribute="something"]': {
//     width : 320px
//  }
// }}

// We need to make sure we append the customCSSSelector to the original class selector. i.e & - > &[data-attribute="Icon"][data-size="small"]
*/
export function generateCustomSxProp(
  // TODO: Figure out how to extend `react-docgen-typescript` to be smart enough to not interpret this as a React component.
  // Arg name was changed from `props` because `react-docgen-typescript` interpretted this as a React component.
  buttonProps: Partial<Pick<ButtonProps, 'size' | 'block' | 'leadingVisual' | 'trailingVisual' | 'trailingAction'>>,
  providedSx: BetterSystemStyleObject,
) {
  // Possible data attributes: data-size, data-block, data-no-visuals
  const size = `[data-size="${buttonProps.size}"]`
  const block = buttonProps.block ? `[data-block="block"]` : ''
  const noVisuals =
    buttonProps.leadingVisual || buttonProps.trailingVisual || buttonProps.trailingAction ? '' : '[data-no-visuals]'

  // this is a custom selector. We need to make sure we add the data attributes to the base css class (& -> &[data-attributename="value"]])
  const cssSelector = `&${size}${block}${noVisuals}` // &[data-size="small"][data-block="block"][data-no-visuals]

  const customSxProp: {
    [key: string]: BetterSystemStyleObject
  } = {}

  if (!providedSx) return customSxProp
  else {
    customSxProp[cssSelector] = providedSx
    return customSxProp
  }
}

ButtonComponent.displayName = 'Button'
