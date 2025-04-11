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

  // button callback to start the profiler
  const onClick = () => {
    setCount(1)
    let count = 0
    const interval = setInterval(() => {
      if (count < totalIterations - 1) {
        setCount(c => c + 1)
        count++
      } else {
        clearInterval(interval)
      }
    }, 10)
  }

  function getButtonLabel(count: number, totalIterations: number): React.ReactNode {
    switch (count) {
      case 1:
        return 'Start stress test'
      case totalIterations:
        return 'Stress test complete, click to restart'
      default:
        return `Stress test in progress (${count}/${totalIterations})`
    }
  }

  return (
    <>
      <Pagination pageCount={totalIterations} currentPage={count} showPages={{narrow: false}} />
      <Button
        variant="primary"
        disabled={count !== 1 && count !== totalIterations}
        onClick={onClick}
        size="large"
        block
      >
        {getButtonLabel(count, totalIterations)}
      </Button>
    </>
  )
}
