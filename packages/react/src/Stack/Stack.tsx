import React from 'react'
import styled from 'styled-components'

const StyledStack = styled.div`
  --stack-row-gap: var(--stack-gap-normal, 1rem);
  --stack-padding: var(--stack-padding-normal, 1rem);
  --stack-direction: column;

  display: flex;
  flex-direction: var(--stack-direction);
  row-gap: var(--stack-row-gap);

  [data-orientation='vertical'] {
    --stack-direction: column;
  }

  [data-orientation='horizontal'] {
    --stack-direction: row;
  }

  [data-gap='condensed'] {
    --stack-row-gap: var(--stack-gap-condensed, 0.5rem);
  }

  [data-gap='normal'] {
    --stack-row-gap: var(--stack-gap-normal, 1rem);
  }

  [data-gap='spacious'] {
    --stack-row-gap: var(--stack-gap-normal, 1.5rem);
  }

  [data-padding='condensed'] {
    --stack-padding: var(--stack-padding-condensed, 0.5rem);
  }

  [data-padding='normal'] {
    --stack-padding: var(--stack-padding-normal, 1rem);
  }

  [data-padding='spacious'] {
    --stack-padding: var(--stack-padding-spacious, 1.5rem);
  }
`

type StackProps<As> = React.PropsWithChildren<{
  as?: As
  gap: 'condensed' | 'normal' | 'spacious'
  padding: 'condensed' | 'normal' | 'spacious'
  orientation: 'horizontal' | 'vertical'
}>

function Stack<As extends keyof JSX.IntrinsicElements>({
  as: BaseComponent = 'div',
  children,
  gap = 'normal',
  padding,
  ...rest
}: StackProps<As> & React.ComponentPropsWithoutRef<As>) {
  return (
    <StyledStack {...rest} as={BaseComponent} data-gap={gap ?? undefined} data-padding={padding ?? undefined}>
      {children}
    </StyledStack>
  )
}

export {Stack}
export type {StackProps}
