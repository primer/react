import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'
import {BetterSystemStyleObject} from '../sx'

const ButtonComponent = forwardRef(({children, sx: sxProp = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
  let sxStyles = sxProp

  // grap the button props that have associated data attributes in the styles
  const {block, size, leadingIcon, trailingIcon, trailingAction} = props

  if (sxProp !== null && Object.keys(sxProp).length > 0) {
    sxStyles = generateCustomSxProp({block, size, leadingIcon, trailingIcon, trailingAction}, sxProp)
  }

  return (
    <ButtonBase ref={forwardedRef} as="button" sx={sxStyles} type="button" {...props}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'button', ButtonProps>

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
  props: Partial<Pick<ButtonProps, 'size' | 'block' | 'leadingIcon' | 'trailingIcon' | 'trailingAction'>>,
  providedSx: BetterSystemStyleObject,
) {
  // Possible data attributes: data-size, data-block, data-no-visuals
  const size = props.size && props.size !== 'medium' ? `[data-size="${props.size}"]` : '' // medium is a default size therefore it doesn't have a data attribute that used for styling
  const block = props.block ? `[data-block="block"]` : ''
  const noVisuals = props.leadingIcon || props.trailingIcon || props.trailingAction ? '' : '[data-no-visuals="true"]'

  // this is a custom selector. We need to make sure we add the data attributes to the base css class (& -> &[data-attributename="value"]])
  const cssSelector = `&${size}${block}${noVisuals}` // &[data-size="small"][data-block="block"][data-no-visuals="true"]

  const customSxProp: {
    [key: string]: BetterSystemStyleObject
  } = {}

  customSxProp[cssSelector] = providedSx as BetterSystemStyleObject & {color?: string}

  // Possible data attributes for children of button component: data-component="leadingVisual", data-component="trailingVisual", data-component="trailingAction"
  // When sx is used in the parent button component, these styles aren't applied to its children (leadingIcon, trailingIcon, trailingAction)
  // Because sx only applies to the base selector which is  "&", but we want it to be applied to '& [data-component="leadingVisual"]'
  const cssSelectorList = []
  if (props.leadingIcon) cssSelectorList.push(`& [data-component="leadingVisual"]`)
  if (props.trailingIcon) cssSelectorList.push(`& [data-component="trailingVisual"]`)
  if (props.trailingAction) cssSelectorList.push(`& [data-component="trailingAction"]`)

  // @ts-ignore for now
  const {color} = providedSx
  if (!color) return customSxProp
  for (const selector of cssSelectorList) {
    // We only want to apply the color to the children of button component, because it is the one that we are overriding with data attributes that has more specificity than the parent button component.https://github.com/primer/react/blob/main/src/Button/styles.ts#L29
    customSxProp[selector] = {color}
  }
  return customSxProp
}

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
