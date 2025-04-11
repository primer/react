import React, {useEffect, useState} from 'react'
import type {Meta} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Pagination from './Pagination'
import {Button} from '../Button'

export default {
  title: 'Components/Pagination/StressTests',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

export const PageUpdate = () => {
  const [count, setCount] = useState(1)
  const totalIterations = 100
  const [flip, setFlip] = useState(false)

  // button callback to start the profiler
  const onClick = () => {
    setCount(1)
    setFlip(prev => !prev)
    // force the effect to re-run
  }

  // Effect that every 10ms forces a re-render to get the average render time
  // of the Profiler. This stops after X iterations.
  useEffect(() => {
    let count = 0
    const interval = setInterval(() => {
      if (count < totalIterations) {
        setCount(c => c + 1)
        count++
      } else {
        clearInterval(interval)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [flip])

  return (
    <>
      <Pagination pageCount={totalIterations} currentPage={count} showPages={{narrow: false}} />
      <Button variant="primary" onClick={onClick} size="large" block>
        Start stress test
      </Button>
    </>
  )
}
