import {EyeIcon, TriangleDownIcon, HeartIcon, DownloadIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import {Button2 as Button} from '.'
import {Box, Flash} from '../..'

export default {
  title: 'Drafts/Components/Button/Features',
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

export const TrailingAction = () => <Button trailingAction={TriangleDownIcon}>Trailing action</Button>

export const Block = () => <Button block>Default</Button>

export const Disabled = () => <Button disabled>Default</Button>

export const Small = () => <Button size="small">Default</Button>

export const Medium = () => <Button size="medium">Default</Button>

export const Large = () => <Button size="large">Default</Button>

export const LoadingWithLeadingVisual = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <Button loading={isLoading} onClick={handleClick} leadingIcon={DownloadIcon}>
      Export
    </Button>
  )
}

export const LoadingCustomMessage = () => (
  <Button loading loadingAnnouncement="This is a custom loading message">
    Default
  </Button>
)

export const LoadingWithNoVisuals = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <Button loading={isLoading} onClick={handleClick}>
      Export
    </Button>
  )
}

export const LoadingWithTrailingVisual = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <Button loading={isLoading} onClick={handleClick} trailingIcon={DownloadIcon}>
      Export
    </Button>
  )
}

export const LoadingWithErrorMessageInvisible = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setHasError(true)
    }, 1500)
  }

  return (
    <>
      <Button loading={isLoading} onClick={handleClick}>
        Export
      </Button>
      <Box
        role="alert"
        sx={{
          clipPath: 'inset(50%)',
          height: '1px',
          overflow: 'hidden',
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
      >
        {hasError ? 'Export failed' : null}
      </Box>
    </>
  )
}

export const LoadingWithErrorMessageVisible = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setHasError(true)
    }, 1500)
  }

  return (
    <>
      {hasError && (
        <Flash variant="danger" sx={{marginBlockEnd: '0.5rem'}}>
          Export failed
        </Flash>
      )}
      <Button loading={isLoading} onClick={handleClick}>
        Export
      </Button>
    </>
  )
}
