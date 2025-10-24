import {Button as PrimerButton, type ButtonProps as PrimerButtonProps, type SlotMarker} from '@primer/react'
import type {SxProp, CSSCustomProperties, BetterSystemStyleObject} from '../sx'
import {forwardRef} from 'react'
import type {ForwardRefComponent} from '../polymorphic'
import styled from 'styled-components'
import {sx} from '../sx'

type ButtonComponentProps = PrimerButtonProps & SxProp & {as?: React.ElementType}

const StyledButtonComponent: ForwardRefComponent<'button', ButtonComponentProps> = styled(PrimerButton).withConfig({
  shouldForwardProp: prop => (prop as keyof ButtonComponentProps) !== 'sx',
})<ButtonComponentProps>`
  ${sx}
`

const ButtonComponent = forwardRef(({as, sx, style: propStyle, ...props}: ButtonComponentProps, ref) => {
  const {block, size = 'medium', leadingVisual, trailingVisual, trailingAction} = props
  let sxStyles: {[key: string]: BetterSystemStyleObject} = {}
  const style: CSSCustomProperties = {...(propStyle || {})}

  if (sx !== null && Object.keys(sx || {}).length > 0) {
    sxStyles = generateCustomSxProp(
      {block, size, leadingVisual, trailingVisual, trailingAction},
      sx as BetterSystemStyleObject,
    )

    const {color} = sx as {color?: string}
    if (color) style['--button-color'] = color
  }

  return <StyledButtonComponent {...props} {...(as ? {forwardedAs: as} : {})} style={style} sx={sxStyles} ref={ref} />
}) as ForwardRefComponent<'button', ButtonComponentProps> & SlotMarker

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
ButtonComponent.__SLOT__ = PrimerButton.__SLOT__

export {ButtonComponent, type ButtonComponentProps}
