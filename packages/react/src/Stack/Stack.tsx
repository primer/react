import React, {type ElementType} from 'react'
import styled from 'styled-components'
import {type ResponsiveValue} from '../hooks/useResponsiveValue'

// TODO
// - Add divider support

const StyledStack = styled.div`
  --Stack-gap-whenRegular: var(--stack-gap-normal, 16px);
  --Stack-gap-whenNarrow: var(--stack-gap-normal, 16px);
  --Stack-gap-whenWide: var(--Stack-gap-whenRegular);

  display: flex;
  flex-flow: column;
  align-items: stretch;
  align-content: flex-start;
  gap: var(--Stack-gap-whenRegular);

  // non-responsive values

  &[data-padding='none'] {
    padding: 0;
  }

  &[data-padding='condensed'] {
    padding: var(--stack-padding-condensed, 8px);
  }

  &[data-padding='normal'] {
    padding: var(--stack-padding-normal, 16px);
  }

  &[data-padding='spacious'] {
    padding: var(--stack-padding-spacious, 24px);
  }

  &[data-orientation='horizontal'] {
    flex-flow: row;
  }

  &[data-orientation='vertical'] {
    flex-flow: column;
  }

  &[data-gap='none'] {
    --Stack-gap-whenNarrow: 0;
  }

  &[data-gap='condensed'] {
    --Stack-gap-whenNarrow: var(--stack-gap-condensed, 8px);
  }

  &[data-gap='normal'] {
    --Stack-gap-whenNarrow: var(--stack-gap-normal, 16px);
  }

  &[data-align='start'] {
    align-items: flex-start;
  }

  &[data-align='center'] {
    align-items: center;
  }

  &[data-align='end'] {
    align-items: flex-end;
  }

  &[data-align='baseline'] {
    align-items: baseline;
  }

  &[data-spread='start'] {
    justify-content: flex-start;
  }

  &[data-spread='center'] {
    justify-content: center;
  }

  &[data-spread='end'] {
    justify-content: flex-end;
  }

  &[data-spread='distribute'] {
    justify-content: space-between;
  }

  &[data-spread='distributeEvenly'] {
    justify-content: space-evenly;
  }

  &[data-wrap='wrap'] {
    flex-wrap: wrap;
  }

  &[data-wrap='nowrap'] {
    flex-wrap: nowrap;
  }

  // @custom-media --veiwportRange-narrow
  @media (max-width: calc(48rem - 0.02px)) {
    gap: var(--Stack-gap-whenNarrow);

    &[data-padding-narrow='none'] {
      padding: 0;
    }

    &[data-padding-narrow='condensed'] {
      padding: var(--stack-padding-condensed, 8px);
    }

    &[data-padding-narrow='normal'] {
      padding: var(--stack-padding-normal, 16px);
    }

    &[data-padding-narrow='spacious'] {
      padding: var(--stack-padding-spacious, 24px);
    }

    &[data-orientation-narrow='horizontal'] {
      flex-flow: row;
    }

    &[data-orientation-narrow='vertical'] {
      flex-flow: column;
    }

    &[data-gap-narrow='none'] {
      --Stack-gap-whenNarrow: 0;
    }

    &[data-gap-narrow='condensed'] {
      --Stack-gap-whenNarrow: var(--stack-gap-condensed, 8px);
    }

    &[data-gap-narrow='normal'] {
      --Stack-gap-whenNarrow: var(--stack-gap-normal, 16px);
    }

    &[data-align-narrow='start'] {
      align-items: flex-start;
    }

    &[data-align-narrow='center'] {
      align-items: center;
    }

    &[data-align-narrow='end'] {
      align-items: flex-end;
    }

    &[data-align-narrow='baseline'] {
      align-items: baseline;
    }

    &[data-spread-narrow='start'] {
      justify-content: flex-start;
    }

    &[data-spread-narrow='center'] {
      justify-content: center;
    }

    &[data-spread-narrow='end'] {
      justify-content: flex-end;
    }

    &[data-spread-narrow='distribute'] {
      justify-content: space-between;
    }

    &[data-spread-narrow='distributeEvenly'] {
      justify-content: space-evenly;
    }

    &[data-wrap-narrow='wrap'] {
      flex-wrap: wrap;
    }

    &[data-wrap-narrow='nowrap'] {
      flex-wrap: nowrap;
    }
  }

  // @custom-media --veiwportRange-regular
  @media (min-width: 48rem) {
    &[data-padding-regular='none'] {
      padding: 0;
    }

    &[data-padding-regular='condensed'] {
      padding: var(--stack-padding-condensed, 8px);
    }

    &[data-padding-regular='normal'] {
      padding: var(--stack-padding-normal, 16px);
    }

    &[data-padding-regular='spacious'] {
      padding: var(--stack-padding-spacious, 24px);
    }

    &[data-orientation-regular='horizontal'] {
      flex-flow: row;
    }

    &[data-orientation-regular='vertical'] {
      flex-flow: column;
    }

    &[data-gap-regular='none'] {
      --Stack-gap-whenRegular: 0;
    }

    &[data-gap-regular='condensed'] {
      --Stack-gap-whenRegular: var(--stack-gap-condensed, 8px);
    }

    &[data-gap-regular='normal'] {
      --Stack-gap-whenRegular: var(--stack-gap-normal, 16px);
    }

    &[data-gap-regular='spacious'] {
      --Stack-gap-whenRegular: var(--stack-gap-spacious, 24px);
    }

    &[data-align-regular='start'] {
      align-items: flex-start;
    }

    &[data-align-regular='center'] {
      align-items: center;
    }

    &[data-align-regular='end'] {
      align-items: flex-end;
    }

    &[data-align-regular='baseline'] {
      align-items: baseline;
    }

    &[data-spread-regular='start'] {
      justify-content: flex-start;
    }

    &[data-spread-regular='center'] {
      justify-content: center;
    }

    &[data-spread-regular='end'] {
      justify-content: flex-end;
    }

    &[data-spread-regular='distribute'] {
      justify-content: space-between;
    }

    &[data-spread-regular='distributeEvenly'] {
      justify-content: space-evenly;
    }

    &[data-wrap-regular='wrap'] {
      flex-wrap: wrap;
    }

    &[data-wrap-regular='nowrap'] {
      flex-wrap: nowrap;
    }
  }

  // @custom-media --viewportRange-wide
  @media (min-width: 87.5rem) {
    gap: var(--Stack-gap-whenWide);

    &[data-padding-wide='none'] {
      padding: 0;
    }

    &[data-padding-wide='condensed'] {
      padding: var(--stack-padding-condensed, 8px);
    }

    &[data-padding-wide='normal'] {
      padding: var(--stack-padding-normal, 16px);
    }

    &[data-padding-wide='spacious'] {
      padding: var(--stack-padding-spacious, 24px);
    }

    &[data-orientation-wide='horizontal'] {
      flex-flow: row;
    }

    &[data-orientation-wide='vertical'] {
      flex-flow: column;
    }

    &[data-gap-wide='none'] {
      --Stack-gap-whenWide: 0;
    }

    &[data-gap-wide='condensed'] {
      --Stack-gap-whenWide: var(--stack-gap-condensed, 8px);
    }

    &[data-gap-wide='normal'] {
      --Stack-gap-whenWide: var(--stack-gap-normal, 16px);
    }

    &[data-gap-wide='spacious'] {
      --Stack-gap-whenWide: var(--stack-gap-spacious, 24px);
    }

    &[data-align-wide='start'] {
      align-items: flex-start;
    }

    &[data-align-wide='center'] {
      align-items: center;
    }

    &[data-align-wide='end'] {
      align-items: flex-end;
    }

    &[data-align-wide='baseline'] {
      align-items: baseline;
    }

    &[data-spread-wide='start'] {
      justify-content: flex-start;
    }

    &[data-spread-wide='center'] {
      justify-content: center;
    }

    &[data-spread-wide='end'] {
      justify-content: flex-end;
    }

    &[data-spread-wide='distribute'] {
      justify-content: space-between;
    }

    &[data-spread-wide='distributeEvenly'] {
      justify-content: space-evenly;
    }
  }
`

type GapScale = 'none' | 'condensed' | 'normal' | 'spacious'
type Gap = GapScale | ResponsiveValue<GapScale>

type OrientationScale = 'horizontal' | 'vertical'
type Orientation = OrientationScale | ResponsiveValue<OrientationScale>

type AlignScale = 'stretch' | 'start' | 'center' | 'end' | 'baseline'
type Align = AlignScale | ResponsiveValue<AlignScale>

type WrapScale = 'wrap' | 'nowrap'
type Wrap = WrapScale | ResponsiveValue<WrapScale>

type SpreadScale = 'start' | 'center' | 'end' | 'distribute' | 'distributeEvenly'
type Spread = SpreadScale | ResponsiveValue<SpreadScale>

type PaddingScale = 'none' | 'condensed' | 'normal' | 'spacious'
type Padding = PaddingScale | ResponsiveValue<PaddingScale>

type StackProps<As> = React.PropsWithChildren<{
  /**
   * Customize the element type of the rendered container
   */
  as?: As

  /**
   * Specify the gap between children elements in the stack
   */
  gap?: Gap

  /**
   * Specify the orientation for the stack container
   * @default vertical
   */
  orientation?: Orientation

  /**
   * Specify the alignment between items in the cross-axis of the orientation
   * @default stretch
   */
  align?: Align

  /**
   * Sets whether items are forced onto one line or can wrap onto multiple lines
   * @default nowrap
   */
  wrap?: Wrap

  /**
   * Sets how items will be distributed in the stacking direction
   * @default start
   */
  spread?: Spread

  /**
   * Sets the padding of the stack container
   * @default none
   */
  padding?: Padding
}>

function Stack<As extends ElementType>({
  as,
  children,
  gap,
  orientation = 'vertical',
  align = 'stretch',
  wrap = 'nowrap',
  spread = 'start',
  padding = 'none',
  ...rest
}: StackProps<As> & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'div'>) {
  const BaseComponent = as ?? 'div'

  return (
    <StyledStack
      {...rest}
      as={BaseComponent}
      {...getResponsiveAttributes('gap', gap)}
      {...getResponsiveAttributes('orientation', orientation)}
      {...getResponsiveAttributes('align', align)}
      {...getResponsiveAttributes('wrap', wrap)}
      {...getResponsiveAttributes('spread', spread)}
      {...getResponsiveAttributes('padding', padding)}
    >
      {children}
    </StyledStack>
  )
}

function getResponsiveAttributes<T>(property: string, values?: T | ResponsiveValue<T>) {
  if (!values) {
    return undefined
  }

  if (typeof values === 'string') {
    return {
      [`data-${property}`]: values,
    }
  }

  if (typeof values === 'boolean' && values) {
    return {
      [`data-${property}`]: values,
    }
  }

  return Object.fromEntries(
    Object.entries(values)
      .filter(([_key, value]) => {
        if (typeof value === 'boolean') {
          return value
        }
        return true
      })
      .map(([key, value]) => {
        if (typeof value === 'boolean' && value) {
          return [`data-${property}-${key}`, '']
        }
        return [`data-${property}-${key}`, value]
      }),
  )
}

const StyledStackItem = styled.div`
  flex: 0 1 auto;
  min-inline-size: 0;

  &[data-grow] {
    flex-grow: 1;
  }

  // @custom-media --veiwportRange-narrow
  @media (max-width: calc(48rem - 0.02px)) {
    &[data-grow-narrow] {
      flex-grow: 1;
    }
  }

  // @custom-media --veiwportRange-regular
  @media (min-width: 48rem) {
    &[data-grow-regular] {
      flex-grow: 1;
    }
  }

  // @custom-media --viewportRange-wide
  @media (min-width: 87.5rem) {
    &[data-grow-wide] {
      flex-grow: 1;
    }
  }
`

type StackItemProps<As> = React.PropsWithChildren<{
  /**
   * Customize the element type of the rendered container
   */
  as?: As

  /**
   * Allow item to keep size or expand to fill the available space
   * @default false
   */
  grow?: boolean | ResponsiveValue<boolean>
}>

function StackItem<As extends ElementType>({
  as,
  children,
  grow = false,
  ...rest
}: StackItemProps<As> & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'div'>) {
  const BaseComponent = as ?? 'div'

  return (
    <StyledStackItem {...rest} as={BaseComponent} {...getResponsiveAttributes('grow', grow)}>
      {children}
    </StyledStackItem>
  )
}

export {Stack, StackItem}
export type {StackProps, StackItemProps}
