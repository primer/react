import React, {useEffect, useState} from 'react'
import afterFrame from 'afterframe'

import type {Meta} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import Pagination from './Pagination'
import {Button} from '../Button'
import Text from '../Text'

export default {
  title: 'Components/Pagination/StressTests',
  component: Pagination,
} as Meta<ComponentProps<typeof Pagination>>

export const PageUpdate = () => {
  return (
    <StressTest
      renderIteration={(count, totalIterations) => (
        <Pagination pageCount={totalIterations} currentPage={count} showPages={{narrow: false}} />
      )}
    />
  )
}

interface StressTestProps {
  renderIteration: (count: number, totalIterations: number) => React.ReactNode
}

const StressTest: React.FC<StressTestProps> = ({renderIteration}) => {
  const [count, setCount] = useState(1)
  const [result, setResult] = useState<undefined | number>(undefined)
  const totalIterations = 100

  // Initialize the observer to log performance metrics, stored in a ref and initialized only once
  const observer = React.useRef<{observer: PerformanceObserver; data: number[]} | null>(null)
  if (!observer.current) {
    observer.current = initializeObserver()
  }
  // Cleanup the observer when the component unmounts
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.observer.disconnect()
        observer.current = null
      }
    }
  }, [])

  const onClick = () => {
    setCount(1)
    let count = 0
    const interval = setInterval(() => {
      if (count < totalIterations - 1) {
        const interaction = measureInteraction()
        // The afterFrame library calls the function
        // when the next frame starts
        afterFrame(() => {
          interaction.end()
        })

        setCount(c => c + 1)
        count++
      } else {
        clearInterval(interval)
      }
    }, 10)
  }

  useEffect(() => {
    if (count === totalIterations) {
      // Get the median of the duration
      const durations = observer.current?.data ?? []
      const median = durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)]
      setResult(median)
    }
  }, [count])

  const testState = count === 1 ? 'start' : count === totalIterations ? 'complete' : 'in-progress'

  function getButtonLabel(testState: 'start' | 'complete' | 'in-progress'): React.ReactNode {
    switch (testState) {
      case 'start':
        return 'Start stress test'
      case 'complete':
        return 'Stress test complete, click to restart'
      default:
        return `Stress test in progress (${count}/${totalIterations})`
    }
  }

  return (
    <>
      {renderIteration(count, totalIterations)}
      <Button
        variant="primary"
        disabled={count !== 1 && count !== totalIterations}
        onClick={onClick}
        size="large"
        block
        data-testid={testState}
      >
        {getButtonLabel(testState)}
      </Button>
      {result !== undefined && (
        <Text as="em">
          Median duration: <span data-testid="result">{result.toFixed(5)}</span>
          ms
        </Text>
      )}
    </>
  )
}

function measureInteraction() {
  performance.mark('interaction-start')
  return {
    end() {
      performance.mark('interaction-end')
      performance.measure('interaction-duration', 'interaction-start', 'interaction-end')
    },
  }
}

const initializeObserver = () => {
  const duration: number[] = []

  const observer = new PerformanceObserver(function perfObserver(list, _observer) {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        duration.push(entry.duration)
      }
    }
  })

  observer.observe({entryTypes: ['measure']})
  return {data: duration, observer}
}
