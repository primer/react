import React from 'react'
import classNames from 'classnames'
import {MandateProps} from '../utils/types'
import {BreakpointConfig} from '../utils/types/BreakpointConfig'
import {SxProp} from '../sx'
import {Box} from '..'

// used for Storybook
export type StackBreakpointConfig<T> = BreakpointConfig<T, 'wide'>

type CrossAxisDistribution = 'center' | 'distribute' | 'distributeEvenly' | 'end' | 'start'

// TODO: add support for an "as" prop
type Props = {
  align?: StackBreakpointConfig<'baseline' | 'center' | 'end' | 'start' | 'stretch'>
  alignWrap?: StackBreakpointConfig<CrossAxisDistribution>
  direction?: StackBreakpointConfig<'inline' | 'block'>
  dividerAriaRole?: 'none' | 'separator' | 'presentation'
  gap?: StackBreakpointConfig<'condensed' | 'normal' | 'normal' | 'spacious'> | string
  showDivider?: StackBreakpointConfig<boolean>
  spread?: StackBreakpointConfig<CrossAxisDistribution>
  wrap?: StackBreakpointConfig<'wrap' | 'nowrap'>
} & SxProp

// used for Storybook
export const defaultStackProps: MandateProps<
  Props,
  'align' | 'alignWrap' | 'direction' | 'gap' | 'showDivider' | 'wrap'
> = {
  align: 'stretch',
  alignWrap: 'start',
  direction: 'block',
  gap: 'normal',
  showDivider: false,
  spread: 'start',
  wrap: 'nowrap'
}

const getResponsivePropVariant = (
  // TODO: figure out a better way to type `propToCheck`
  propToCheck:
    | Props['align']
    | Props['alignWrap']
    | Props['direction']
    | Props['gap']
    | Props['showDivider']
    | Props['wrap'],
  viewportRange?: 'narrow' | 'regular'
) => {
  if (viewportRange && typeof propToCheck === 'object' && propToCheck[viewportRange]) {
    return propToCheck[viewportRange]
  }

  return typeof propToCheck === 'object' ? propToCheck.regular : propToCheck
}

const Stack: React.FC<Props> = ({
  align,
  alignWrap,
  children,
  direction,
  dividerAriaRole,
  gap,
  showDivider,
  spread,
  sx,
  wrap
}) => {
  const narrowVariants = {
    align: getResponsivePropVariant(align, 'narrow'),
    alignWrap: getResponsivePropVariant(alignWrap, 'narrow'),
    direction: getResponsivePropVariant(direction, 'narrow'),
    gap: getResponsivePropVariant(gap, 'narrow'),
    showDivider: getResponsivePropVariant(showDivider, 'narrow'),
    spread: getResponsivePropVariant(spread, 'narrow'),
    wrap: getResponsivePropVariant(wrap, 'narrow')
  }
  const regularVariants = {
    align: getResponsivePropVariant(align),
    alignWrap: getResponsivePropVariant(alignWrap),
    direction: getResponsivePropVariant(direction),
    gap: getResponsivePropVariant(gap),
    showDivider: getResponsivePropVariant(showDivider),
    spread: getResponsivePropVariant(spread),
    wrap: getResponsivePropVariant(wrap)
  }
  const gapValues = ['condensed', 'normal', 'normal', 'spacious']
  const customGapValues = {
    '--Stack-gap':
      typeof gap === 'string' && !gapValues.includes(gap)
        ? gap
        : typeof gap === 'object' && !gapValues.includes(`${gap.regular}`)
        ? gap.regular
        : undefined,
    '--Stack-gap-whenNarrow': typeof gap === 'object' && !gapValues.includes(`${gap.narrow}`) ? gap.narrow : undefined
  }

  return (
    <Box
      className={classNames('Stack', {
        [`Stack--align-${regularVariants.align}-whenRegular`]: align,
        [`Stack--align-${narrowVariants.align}-whenRegular`]: narrowVariants.align,

        [`Stack--alignWrap-${regularVariants.alignWrap}-whenRegular`]: alignWrap,
        [`Stack--alignWrap-${narrowVariants.alignWrap}-whenRegular`]: narrowVariants.alignWrap,

        [`Stack--dir-${regularVariants.direction}-whenRegular`]: direction,
        [`Stack--dir-${narrowVariants.direction}-whenNarrow`]: narrowVariants.direction,

        [`Stack--gap-${regularVariants.gap}-whenRegular`]: gap && !customGapValues['--Stack-gap'],
        [`Stack--gap-${narrowVariants.gap}-whenNarrow`]:
          narrowVariants.gap && !customGapValues['--Stack-gap-whenNarrow'],

        [`Stack--showDivider-${regularVariants.showDivider}-whenRegular`]: showDivider,
        [`Stack--showDivider-${narrowVariants.showDivider}-whenRegular`]: narrowVariants.showDivider,

        [`Stack--spread-${regularVariants.spread}-whenRegular`]: spread,
        [`Stack--spread-${narrowVariants.spread}-whenRegular`]: narrowVariants.spread,

        [`Stack--${regularVariants.wrap}-whenRegular`]: wrap,
        [`Stack--${narrowVariants.wrap}-whenRegular`]: narrowVariants.wrap
      })}
      style={customGapValues as React.CSSProperties}
      sx={sx}
    >
      {showDivider
        ? React.Children.map(children, (stackChild, i) => {
            if (i !== 0) {
              return (
                <>
                  <hr className="Stack-divider" role={dividerAriaRole} aria-hidden={dividerAriaRole !== 'separator'} />
                  {stackChild}
                </>
              )
            }
            return stackChild
          })
        : children}
    </Box>
  )
}

Stack.defaultProps = defaultStackProps

export default Stack
