import {EyeIcon, TriangleDownIcon, HeartIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import {Button} from '.'
import {Stack} from '../Stack/Stack'
import Link from '../Link'
import {announce} from '@primer/live-region-element'

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
          <b>Accessibility note</b>: If a button is dynamically updated to communicate a change (e.g. an action was
          successful), please make sure that this is also properly communicated to screen reader users. This may not
          happen reliably without additional markup considerations. Make sure to choose an approach that is appropriate
          for your usecase.
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
      <AccessibilityNote />
      <p>In this example, a live region has been implemented to communicate the change.</p>
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

export const LabelWrap = () => {
  return (
    <Stack style={{width: '200px'}}>
      <Button labelWrap>This button label will wrap if the label is too long</Button>
      <Button size="small" labelWrap>
        This small button label will wrap if the label is too long
      </Button>
      <Button size="large" labelWrap>
        This large button label will wrap if the label is too long
      </Button>
      <Button labelWrap leadingVisual={HeartIcon} trailingVisual={EyeIcon}>
        This button label will wrap if the label is too long
      </Button>
      <Button labelWrap trailingAction={TriangleDownIcon}>
        This button label will wrap if the label is too long
      </Button>
    </Stack>
  )
}
