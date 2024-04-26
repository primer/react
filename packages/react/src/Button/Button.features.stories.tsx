import {EyeIcon, TriangleDownIcon, HeartIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import {Button} from '.'
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
          <b>Accessibility note</b>: When a Button label is dynamically updated, such as in this example, the update
          must be communicated to screen reader users. This will not happen reliably without additional markup
          considerations. Upon testing various approaches, we discovered that updating the <code>aria-label</code> when
          the button label is updated, results in the most consistent announcement across screen readers and browsers.
        </p>
        <p>
          Learn more about at{' '}
          <Link href="https://github.com/github/accessibility/blob/b297154027f524858420c9edf4a51fc5999bf1b2/docs/wiki/screen-reader-testing/dynamically-updated-buttons-support-april-2024.md">
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
  return (
    <>
      <Button aria-label={`Watch (${count})`} onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <AccessibilityNote />
    </>
  )
}

export const TrailingCounterAllVariants = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
        <Button aria-label={`Watch (${count})`} onClick={() => setCount(count + 1)} count={count}>
          Watch
        </Button>
        <Button aria-label={`Watch (${count})`} disabled onClick={() => setCount(count + 1)} count={count}>
          Watch
        </Button>
        <Button aria-label={`Watch (${count})`} variant="primary" onClick={() => setCount(count + 1)} count={count}>
          Watch
        </Button>
        <Button
          aria-label={`Watch (${count})`}
          variant="primary"
          disabled
          onClick={() => setCount(count + 1)}
          count={count}
        >
          Watch
        </Button>
        <Button aria-label={`Watch (${count})`} variant="danger" onClick={() => setCount(count + 1)} count={count}>
          Watch
        </Button>
        <Button
          aria-label={`Watch (${count})`}
          variant="danger"
          disabled
          onClick={() => setCount(count + 1)}
          count={count}
        >
          Watch
        </Button>
        <Button aria-label={`Watch (${count})`} variant="invisible" onClick={() => setCount(count + 1)} count={count}>
          Watch
        </Button>
        <Button
          aria-label={`Watch (${count})`}
          variant="invisible"
          disabled
          onClick={() => setCount(count + 1)}
          count={count}
        >
          Watch
        </Button>
      </div>
      <AccessibilityNote />
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
