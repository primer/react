import {EyeIcon, TriangleDownIcon, HeartIcon, DownloadIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import {Button} from '.'

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

export const Loading = () => <Button loading>Default</Button>

export const LoadingCustomAnnouncement = () => (
  <Button loading loadingAnnouncement="This is a custom loading announcement">
    Default
  </Button>
)

export const LoadingWithLeadingVisual = () => (
  <Button loading leadingVisual={DownloadIcon}>
    Export
  </Button>
)

export const LoadingWithTrailingVisual = () => (
  <Button loading trailingVisual={DownloadIcon}>
    Export
  </Button>
)

export const LoadingTrigger = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
  }

  return (
    <Button loading={isLoading} onClick={handleClick} leadingVisual={DownloadIcon}>
      Export
    </Button>
  )
}
