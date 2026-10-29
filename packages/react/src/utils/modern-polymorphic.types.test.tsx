import React from 'react'
import type {PolymorphicProps} from './modern-polymorphic'

export function shouldPreserveOwnPropTypes<As extends React.ElementType>(
  props: PolymorphicProps<
    As,
    'div',
    {
      delayMs?: number
      politeness?: 'assertive' | 'polite'
      title: string
    }
  >,
) {
  const {delayMs, politeness, title} = props

  type Delay = Expect<Equal<typeof delayMs, number | undefined>>
  type Politeness = Expect<Equal<typeof politeness, 'assertive' | 'polite' | undefined>>
  type Title = Expect<Equal<typeof title, string>>
}

export function shouldUsePolymorphicAsInsteadOfOwnAs() {
  const props: PolymorphicProps<'button', 'a', {as?: 'a'; muted?: boolean}> = {
    as: 'button',
    muted: true,
    disabled: true,
    ref: React.createRef<HTMLButtonElement>(),
    onClick: event => {
      type Event = Expect<Equal<typeof event, React.MouseEvent<HTMLButtonElement>>>
    },
  }
  return props
}

export function shouldPreserveIntersectingPropTypes() {
  const props: PolymorphicProps<'input', 'div', {size?: 'small' | 'large'}> = {
    as: 'input',
    // @ts-expect-error own props do not override conflicting element props
    size: 'small',
  }
  return props
}

export function shouldPreserveOwnPropUnions(
  props: PolymorphicProps<'div', 'div', {kind: 'text'; text: string} | {kind: 'count'; count: number}>,
) {
  if (props.kind === 'text') {
    type Text = Expect<Equal<typeof props.text, string>>
  } else {
    type Count = Expect<Equal<typeof props.count, number>>
  }
}

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
