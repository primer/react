import React, {useState} from 'react'
import type {Meta} from '@storybook/react'
import {Button} from '.'
import {Flash} from '..'

const meta: Meta<typeof Button> = {
  title: 'Components/Button/Examples',
} as Meta<typeof Button>

export default meta

export const LoadingWithError = () => {
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
          Export failed. Try again.
        </Flash>
      )}
      <Button loading={isLoading} onClick={handleClick}>
        Export
      </Button>
    </>
  )
}
