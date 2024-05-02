import {EyeIcon, TriangleDownIcon, HeartIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import {Button} from '.'
import {announce} from '@primer/live-region-element'
import Link from '../Link'

export default {
  title: 'Components/Button/Features',
}

export const Primary = () => <Button variant="primary">Primary</Button>

export const Danger = () => <Button variant="danger">Danger</Button>

export const Invisible = () => <Button variant="invisible">Invisible</Button>

export const LeadingVisual = () => <Button leadingVisual={HeartIcon}>Leading visual</Button>

export const TrailingVisual = () => <Button trailingVisual={EyeIcon}>Trailing visual</Button>

const AccessibilityNote = () => {
  {
    return (
      <>
        <p>
          <b>Accessibility note</b>: When a button&apos;s text is updated to communicate different states, make sure
          that this change is also communicated to screen reader users. This requires additional markup considerations.
          Choose an approach that is appropriate for your usecase.
        </p>
        <p>
          Learn more about at{' '}
          <Link href="https://github.com/github/accessibility/blob/8b300b36d8bca28fd5e3e70ffa077a6f8ee65c05/docs/wiki/screen-reader-testing/dynamically-updated-buttons-support-april-2024.md">
            Staff-only: Dynamically updated button labels
          </Link>
          .
        </p>
      </>
    )
  }
}
export const TrailingCounter = () => {
  const [count, setCount] = useState(0)
  const onClick = () => {
    setCount(count + 1)
    announce(`Watch ${count + 1}`)
  }
  return (
    <>
      <Button onClick={onClick} count={count}>
        Watch
      </Button>
    </>
  )
}

export const TrailingCounterAllVariants = () => {
  const [count, setCount] = useState(0)
  const onClick = () => {
    setCount(count + 1)
    announce(`Watch ${count + 1}`)
  }
  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
        <Button onClick={onClick} count={count}>
          Watch
        </Button>
        <Button onClick={onClick} count={count}>
          Watch
        </Button>
        <Button onClick={onClick} count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="primary" disabled count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="danger" count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="danger" disabled count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="invisible" count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="invisible" disabled count={count}>
          Watch
        </Button>
      </div>
      <AccessibilityNote />
      <p>In these examples, a live region has been implemented to communicate the change.</p>
    </>
  )
}

export const TrailingAction = () => <Button trailingAction={TriangleDownIcon}>Trailing action</Button>

export const Block = () => <Button block>Default</Button>

export const Disabled = () => (
  <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
    <Button disabled>Default</Button>
    <Button variant="primary" disabled>
      Primary
    </Button>
    <Button variant="danger" disabled>
      Danger
    </Button>
    <Button variant="invisible" disabled>
      Invisible
    </Button>
  </div>
)

export const Inactive = () => (
  <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
    <Button inactive>Default</Button>
    <Button variant="primary" inactive>
      Primary
    </Button>
    <Button variant="danger" inactive>
      Danger
    </Button>
    <Button variant="invisible" inactive>
      Invisible
    </Button>
  </div>
)

export const Small = () => <Button size="small">Default</Button>

export const Medium = () => <Button size="medium">Default</Button>

export const Large = () => <Button size="large">Default</Button>

export const WithMultipleStates = () => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

  const onClick = () => {
    setIsSubscribed(!isSubscribed)
    // Ensures that screen reader users are informed of the change.
    announce(!isSubscribed ? 'You have been subscribed.' : 'You have been unsubscribed.')
  }
  return <Button onClick={onClick}>{!isSubscribed ? 'Subscribe' : 'Unsubscribe'}</Button>
}

export const WithMultipleStatesAndAriaLabel = () => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

  const onClick = () => {
    setIsSubscribed(!isSubscribed)
  }
  // Updates to `aria-label` will be announced by screen readers.
  return (
    <Button aria-label={!isSubscribed ? 'You have been subscribed.' : 'You have been unsubscribed.'} onClick={onClick}>
      {!isSubscribed ? 'Subscribe' : 'Unsubscribe'}
    </Button>
  )
}
