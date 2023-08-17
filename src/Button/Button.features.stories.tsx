import {EyeIcon, TriangleDownIcon, HeartIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import {Button} from '.'

export default {
  title: 'Components/Button/Features',
}

export const Primary = () => <Button variant="primary">Primary</Button>

export const Danger = () => <Button variant="danger">Danger</Button>

export const Invisible = () => <Button variant="invisible">Invisible</Button>

export const Outline = () => <Button variant="outline">Outline</Button>

export const LeadingVisual = () => <Button leadingIcon={HeartIcon}>Leading visual</Button>

export const TrailingVisual = () => <Button trailingIcon={EyeIcon}>Trailing visual</Button>

export const TrailingCounter = () => {
  const [count, setCount] = useState(0)
  return (
    <Button onClick={() => setCount(count + 1)}>
      Watch
      <Button.Counter>{count}</Button.Counter>
    </Button>
  )
}

export const TrailingCounterAllVariants = () => {
  const [count, setCount] = useState(0)
  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      <Button onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button disabled onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="primary" onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="primary" disabled onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="outline" onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="outline" disabled onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="danger" onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="danger" disabled onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="invisible" onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
      <Button variant="invisible" disabled onClick={() => setCount(count + 1)}>
        Watch
        <Button.Counter>{count}</Button.Counter>
      </Button>
    </div>
  )
}

export const TrailingAction = () => <Button trailingAction={TriangleDownIcon}>Trailing action</Button>

export const Block = () => <Button block>Default</Button>

export const Disabled = () => <Button disabled>Default</Button>

export const Small = () => <Button size="small">Default</Button>

export const Medium = () => <Button size="medium">Default</Button>

export const Large = () => <Button size="large">Default</Button>
