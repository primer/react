import {EyeIcon, TriangleDownIcon, HeartIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import {Button} from '.'
import {Stack} from '../Stack/Stack'

export default {
  title: 'Components/Button/Features',
}

export const Primary = () => <Button variant="primary">Primary</Button>

export const Danger = () => <Button variant="danger">Danger</Button>

export const Invisible = () => <Button variant="invisible">Invisible</Button>

export const LeadingVisual = () => <Button leadingVisual={HeartIcon}>Leading visual</Button>

export const TrailingVisual = () => <Button trailingVisual={EyeIcon}>Trailing visual</Button>

export const TrailingCounter = () => {
  const [count, setCount] = useState(0)
  return (
    <Button onClick={() => setCount(count + 1)} count={count}>
      Watch
    </Button>
  )
}

export const TrailingCounterAllVariants = () => {
  const [count, setCount] = useState(0)
  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      <Button onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button disabled onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="primary" onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="primary" disabled onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="danger" onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="danger" disabled onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="invisible" onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="invisible" disabled onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
    </div>
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

export const TruncationEllipses = () => {
  return (
    <Stack style={{width: '200px'}}>
      <Button truncation="ellipses">This button label will show an ellipses if the label is too long</Button>
      <Button truncation="ellipses" leadingVisual={HeartIcon} trailingVisual={EyeIcon}>
        This button label will show an ellipses if the label is too long
      </Button>
      <Button truncation="ellipses" trailingAction={TriangleDownIcon}>
        This button label will show an ellipses if the label is too long
      </Button>
    </Stack>
  )
}

export const TruncationWrap = () => {
  return (
    <Stack style={{width: '200px'}}>
      <Button truncation="wrap">This button label will wrap if the label is too long</Button>
      <Button size="small" truncation="wrap">
        This small button label will wrap if the label is too long
      </Button>
      <Button size="large" truncation="wrap">
        This large button label will wrap if the label is too long
      </Button>
      <Button truncation="wrap" leadingVisual={HeartIcon} trailingVisual={EyeIcon}>
        This button label will wrap if the label is too long
      </Button>
      <Button truncation="wrap" trailingAction={TriangleDownIcon}>
        This button label will wrap if the label is too long
      </Button>
    </Stack>
  )
}
