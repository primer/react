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
      if (count < totalIterations) {
        setCount(c => c + 1)
        count++
      } else {
        clearInterval(interval)
      }
    }, 10)
  }

  return (
    <>
      <Pagination pageCount={totalIterations} currentPage={count} showPages={{narrow: false}} />
      <Button variant="primary" onClick={onClick} size="large" block>
        Start stress test
      </Button>
    </>
  )
}
