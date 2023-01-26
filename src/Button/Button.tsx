import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'
import {SxProp} from '../sx'

const ButtonComponent = forwardRef(({children, sx: SxProp = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
  let sxStyles = SxProp

  if (SxProp !== null && Object.keys(SxProp).length > 0) {
    sxStyles = generateCustomSxProp(props, SxProp)
  }

  return (
    <ButtonBase ref={forwardedRef} as="button" sx={sxStyles} type="button" {...props}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'button', ButtonProps>

// This function is used to generate a custom cssSelector for the SxProp

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
//  width : 320px
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
function generateCustomSxProp(props: ButtonProps, providedSx: SxProp) {
  // Possible data attributes: data-size, data-block, data-no-visuals
  const size = props.size ? `[data-size="${props.size}"]` : ''
  const block = props.block ? `[data-block="block"]` : ''
  const noVisuals = props.leadingIcon || props.trailingIcon || props.trailingAction ? '' : '[data-no-visuals="true"]'

  // this is our custom selector. We are updating this from & -> & plus selectors.
  const cssSelector = `&${size}${block}${noVisuals}` // &[data-size="small"][data-block="block"][data-no-visuals="true"]
  type customSxPropType = {
    [key: string]: SxProp
  }
  const customSxProp: customSxPropType = {}

  // eslint-disable-next-line github/array-foreach
  Object.entries(providedSx).forEach(([key, value]) => {
    if (typeof value === 'object' && key.includes('@media')) {
      // if key includes @media, we need to restructure the object
      customSxProp[key] = {
        [cssSelector]: value,
      }
    } else if (typeof value === 'object' && key.startsWith('&')) {
      // if key starts with &, we need to add the selectors to the cssSelector
      const combinedSelector = `${cssSelector}${key.replace('&', '')}`
      customSxProp[combinedSelector] = value
    } else {
      customSxProp[cssSelector] = providedSx
    }
  })

  console.log('customSxProp', customSxProp)
  return customSxProp
}

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
