import {Button as PrimerButton, type ButtonProps as PrimerButtonProps} from '@primer/react'
import type {SxProp, CSSCustomProperties} from '../sx'
import type {BetterSystemStyleObject} from '../styled-props'
import {Box} from './Box'

type ButtonComponentProps = PrimerButtonProps & SxProp
const ButtonComponent = ({sx, ...rest}: ButtonComponentProps) => {
  const {block, size = 'medium', leadingVisual, trailingVisual, trailingAction} = rest
  let sxStyles: {[key: string]: BetterSystemStyleObject} = {}
  const style: CSSCustomProperties = {}

  if (sx !== null && Object.keys(sx || {}).length > 0) {
    sxStyles = generateCustomSxProp(
      {block, size, leadingVisual, trailingVisual, trailingAction},
      sx as BetterSystemStyleObject,
    )

    const {color} = sx as {color?: string}
    if (color) style['--button-color'] = color
  }

  // @ts-expect-error type mismatch between Box usage here and PrimerButton
  return <Box {...rest} as={PrimerButton} style={style} sx={sxStyles} />
}

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
  props: Partial<Pick<PrimerButtonProps, 'size' | 'block' | 'leadingVisual' | 'trailingVisual' | 'trailingAction'>>,
  providedSx: BetterSystemStyleObject,
) {
  // Possible data attributes: data-size, data-block, data-no-visuals
  const size = `[data-size="${props.size}"]`
  const block = props.block ? `[data-block="block"]` : ''
  const noVisuals = props.leadingVisual || props.trailingVisual || props.trailingAction ? '' : '[data-no-visuals]'

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

export {ButtonComponent, type ButtonComponentProps}
