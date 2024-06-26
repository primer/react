import React, {type ElementType} from 'react'
import styled from 'styled-components'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'

const StyledStack = styled.div`
  display: flex;
  flex-flow: column;
  align-items: stretch;
  align-content: flex-start;
  gap: var(--stack-gap, var(--stack-gap-normal, 1rem));

  // non-responsive values

  &[data-padding='none'],
  &[data-padding-narrow='none'] {
    padding: 0;
  }

  &[data-padding='condensed'],
  &[data-padding-narrow='condensed'] {
    padding: var(--stack-padding-condensed, 8px);
  }

  &[data-padding='normal'],
  &[data-padding-narrow='normal'] {
    padding: var(--stack-padding-normal, 16px);
  }

  &[data-padding='spacious'],
  &[data-padding-narrow='spacious'] {
    padding: var(--stack-padding-spacious, 24px);
  }

  &[data-direction='horizontal'],
  &[data-direction-narrow='horizontal'] {
    flex-flow: row;
  }

  &[data-direction='vertical'],
  &[data-direction-narrow='vertical'] {
    flex-flow: column;
  }

  &[data-gap='none'],
  &[data-gap-narrow='none'] {
    --stack-gap: var(--stack-gap-none, 0);
  }

  &[data-gap='condensed'],
  &[data-gap-narrow='condensed'] {
    --stack-gap: var(--stack-gap-condensed, 0.5rem);
  }

  &[data-gap='normal'],
  &[data-gap-narrow='normal'] {
    --stack-gap: var(--stack-gap-normal, 1rem);
  }

  &[data-gap='spacious'],
  &[data-gap-narrow='spacious'] {
    --stack-gap: var(--stack-gap-spacious, 1.5rem);
  }

  &[data-align='start'],
  &[data-align-narrow='start'] {
    align-items: flex-start;
  }

  &[data-align='center'],
  &[data-align-narrow='center'] {
    align-items: center;
  }

  &[data-align='end'],
  &[data-align-narrow='end'] {
    align-items: flex-end;
  }

  &[data-align='baseline'],
  &[data-align-narrow='baseline'] {
    align-items: baseline;
  }

  &[data-justify='start'],
  &[data-justify-narrow='start'] {
    justify-content: flex-start;
  }

  &[data-justify='center'],
  &[data-justify-narrow='center'] {
    justify-content: center;
  }

  &[data-justify='end'],
  &[data-justify-narrow='end'] {
    justify-content: flex-end;
  }

  &[data-justify='space-between'],
  &[data-justify-narrow='space-between'] {
    justify-content: space-between;
  }

  &[data-justify='space-evenly'],
  &[data-justify-narrow='space-evenly'] {
    justify-content: space-evenly;
  }

  &[data-wrap='wrap'],
  &[data-wrap-narrow='wrap'] {
    flex-wrap: wrap;
  }

  &[data-wrap='nowrap'],
  &[data-wrap-narrow='nowrap'] {
    flex-wrap: nowrap;
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

    &[data-direction-regular='horizontal'] {
      flex-flow: row;
    }

    &[data-direction-regular='vertical'] {
      flex-flow: column;
    }

    &[data-gap-regular='none'] {
      --stack-gap: var(--stack-gap-none, 0);
    }

    &[data-gap-regular='condensed'] {
      --stack-gap: var(--stack-gap-condensed, 0.5rem);
    }

    &[data-gap-regular='normal'] {
      --stack-gap: var(--stack-gap-normal, 1rem);
    }

    &[data-gap-regular='spacious'] {
      --stack-gap: var(--stack-gap-spacious, 1.5rem);
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

    &[data-justify-regular='start'] {
      justify-content: flex-start;
    }

    &[data-justify-regular='center'] {
      justify-content: center;
    }

    &[data-justify-regular='end'] {
      justify-content: flex-end;
    }

    &[data-justify-regular='space-between'] {
      justify-content: space-between;
    }

    &[data-justify-regular='space-evenly'] {
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

    &[data-direction-wide='horizontal'] {
      flex-flow: row;
    }

    &[data-direction-wide='vertical'] {
      flex-flow: column;
    }

    &[data-gap-wide='none'] {
      --stack-gap: var(--stack-gap-none, 0);
    }

    &[data-gap-wide='condensed'] {
      --stack-gap: var(--stack-gap-condensed, 0.5rem);
    }

    &[data-gap-wide='normal'] {
      --stack-gap: var(--stack-gap-normal, 1rem);
    }

    &[data-gap-wide='spacious'] {
      --stack-gap: var(--stack-gap-spacious, 1.5rem);
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

    &[data-justify-wide='start'] {
      justify-content: flex-start;
    }

    &[data-justify-wide='center'] {
      justify-content: center;
    }

    &[data-justify-wide='end'] {
      justify-content: flex-end;
    }

    &[data-justify-wide='space-between'] {
      justify-content: space-between;
    }

    &[data-justify-wide='space-evenly'] {
      justify-content: space-evenly;
    }
  }
`

type GapScale = 'none' | 'condensed' | 'normal' | 'spacious'
type Gap = GapScale | ResponsiveValue<GapScale>

type DirectionScale = 'horizontal' | 'vertical'
type Direction = DirectionScale | ResponsiveValue<DirectionScale>

type AlignScale = 'stretch' | 'start' | 'center' | 'end' | 'baseline'
type Align = AlignScale | ResponsiveValue<AlignScale>

type WrapScale = 'wrap' | 'nowrap'
type Wrap = WrapScale | ResponsiveValue<WrapScale>

type JustifyScale = 'start' | 'center' | 'end' | 'space-between' | 'space-evenly'
type Justify = JustifyScale | ResponsiveValue<JustifyScale>

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
   * Specify the direction for the stack container
   * @default vertical
   */
  direction?: Direction

  /**
   * Specify the alignment between items in the cross-axis of the direction
   * @default stretch
   */
  align?: Align

  /**
   * Specify whether items are forced onto one line or can wrap onto multiple lines
   * @default nowrap
   */
  wrap?: Wrap

  /**
   * Specify how items will be distributed in the stacking direction
   * @default start
   */
  justify?: Justify

  /**
   * Specify the padding of the stack container
   * @default none
   */
  padding?: Padding
}>

function Stack<As extends ElementType>({
  as,
  children,
  align = 'stretch',
  direction = 'vertical',
  gap,
  justify = 'start',
  padding = 'none',
  wrap = 'nowrap',
  ...rest
}: StackProps<As> & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'div'>) {
  const BaseComponent = as ?? 'div'

  return (
    <StyledStack
      {...rest}
      as={BaseComponent}
      {...getResponsiveAttributes('gap', gap)}
      {...getResponsiveAttributes('direction', direction)}
      {...getResponsiveAttributes('align', align)}
      {...getResponsiveAttributes('wrap', wrap)}
      {...getResponsiveAttributes('justify', justify)}
      {...getResponsiveAttributes('padding', padding)}
    >
      {children}
    </StyledStack>
  )
}

const StyledStackItem = styled.div`
  flex: 0 1 auto;
  min-inline-size: 0;

  &[data-grow],
  &[data-grow-narrow] {
    flex-grow: 1;
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
