import React, {type ElementType} from 'react'
import styled from 'styled-components'
import {type ResponsiveValue} from '../hooks/useResponsiveValue'

const StyledStack = styled.div`
  --stack-gap: var(--stack-gap-normal, 1rem);
  --stack-padding: var(--stack-padding-normal, 1rem);
  --stack-direction: column;

  display: flex;
  flex-direction: var(--stack-direction);
  padding: var(--stack-padding);

  /* Orientation */
  &[data-orientation='vertical'] {
    --stack-direction: column;
    row-gap: var(--stack-gap);
  }

  &[data-orientation='horizontal'] {
    --stack-direction: row;
    column-gap: var(--stack-gap);
  }

  /* Gap */
  &[data-gap='condensed'] {
    --stack-gap: var(--stack-gap-condensed, 0.5rem);
  }

  &[data-gap='normal'] {
    --stack-gap: var(--stack-gap-normal, 1rem);
  }

  &[data-gap='spacious'] {
    --stack-gap: var(--stack-gap-spacious, 1.5rem);
  }

  /* Padding */
  &[data-padding='condensed'] {
    --stack-padding: var(--stack-padding-condensed, 0.5rem);
  }

  &[data-padding='normal'] {
    --stack-padding: var(--stack-padding-normal, 1rem);
  }

  &[data-padding='spacious'] {
    --stack-padding: var(--stack-padding-spacious, 1.5rem);
  }

  /* Responsive values ------------------------------------------------------ */

  /* Gap */
  &[data-gap-narrow='condensed'] {
    --stack-gap: var(--stack-gap-condensed, 0.5rem);
  }

  &[data-gap-narrow='normal'] {
    --stack-gap: var(--stack-gap-normal, 1rem);
  }

  &[data-gap-narrow='spacious'] {
    --stack-gap: var(--stack-gap-spacious, 1.5rem);
  }

  /* Padding */
  &[data-padding-narrow='condensed'] {
    --stack-padding: var(--stack-padding-condensed, 0.5rem);
  }

  &[data-padding-narrow='normal'] {
    --stack-padding: var(--stack-padding-normal, 1rem);
  }

  &[data-padding-narrow='spacious'] {
    --stack-padding: var(--stack-padding-spacious, 1.5rem);
  }

  /* Orientation */
  &[data-orientation-narrow='vertical'] {
    --stack-direction: column;
  }

  &[data-orientation-narrow='horizontal'] {
    --stack-direction: row;
  }

  @media (min-width: 768px) {
    /* Gap */
    &[data-gap-regular='condensed'] {
      --stack-gap: var(--stack-gap-condensed, 0.5rem);
    }

    &[data-gap-regular='normal'] {
      --stack-gap: var(--stack-gap-normal, 1rem);
    }

    &[data-gap-regular='spacious'] {
      --stack-gap: var(--stack-gap-spacious, 1.5rem);
    }

    /* Padding */
    &[data-padding-regular='condensed'] {
      --stack-padding: var(--stack-padding-condensed, 0.5rem);
    }

    &[data-padding-regular='normal'] {
      --stack-padding: var(--stack-padding-normal, 1rem);
    }

    &[data-padding-regular='spacious'] {
      --stack-padding: var(--stack-padding-spacious, 1.5rem);
    }

    /* Orientation */
    &[data-orientation-regular='vertical'] {
      --stack-direction: column;
    }

    &[data-orientation-regular='horizontal'] {
      --stack-direction: row;
    }
  }

  @media (min-width: 1400px) {
    /* Gap */
    &[data-gap-wide='condensed'] {
      --stack-gap: var(--stack-gap-condensed, 0.5rem);
    }

    &[data-gap-wide='normal'] {
      --stack-gap: var(--stack-gap-normal, 1rem);
    }

    &[data-gap-wide='spacious'] {
      --stack-gap: var(--stack-gap-spacious, 1.5rem);
    }

    /* Padding */
    &[data-padding-wide='condensed'] {
      --stack-padding: var(--stack-padding-condensed, 0.5rem);
    }

    &[data-padding-wide='normal'] {
      --stack-padding: var(--stack-padding-normal, 1rem);
    }

    &[data-padding-wide='spacious'] {
      --stack-padding: var(--stack-padding-spacious, 1.5rem);
    }

    /* Orientation */
    &[data-orientation-wide='vertical'] {
      --stack-direction: column;
    }

    &[data-orientation-wide='horizontal'] {
      --stack-direction: row;
    }
  }
`

type GapScale = 'condensed' | 'normal' | 'spacious'
type Gap = GapScale | ResponsiveValue<GapScale>

type PaddingScale = 'condensed' | 'normal' | 'spacious'
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
   * Specify the padding for the stack container
   */
  padding?: Padding

  /**
   * Specify the orientation for the stack container
   * @default vertical
   */
  orientation?: 'horizontal' | 'vertical'
}>

function Stack<As extends ElementType>({
  as,
  children,
  gap,
  padding,
  orientation = 'vertical',
  ...rest
}: StackProps<As> & React.ComponentPropsWithoutRef<ElementType extends As ? As : 'div'>) {
  const BaseComponent = as ?? 'div'

  return (
    <StyledStack
      {...rest}
      as={BaseComponent}
      // data-gap
      {...getResponsiveAttributes('gap', gap)}
      // data-padding
      {...getResponsiveAttributes('padding', padding)}
      // data-orientation
      {...getResponsiveAttributes('orientation', orientation)}
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

  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      return [`data-${property}-${key}`, value]
    }),
  )
}

export {Stack}
export type {StackProps}
