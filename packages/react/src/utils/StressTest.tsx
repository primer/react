import React, {useEffect, useState} from 'react'
import afterFrame from 'afterframe'

import {Button} from '../Button'
import Text from '../Text'
import classes from './StressTest.module.css'
import {ProgressBar} from '../ProgressBar'

export interface StressTestProps {
  totalIterations: number
  renderIteration: (count: number, totalIterations: number) => React.ReactNode
}

export const StressTest: React.FC<StressTestProps> = ({renderIteration, totalIterations}) => {
  const [count, setCount] = useState(0)
  const [result, setResult] = useState<undefined | number>(undefined)

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
    setCount(0)
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
    if (count === totalIterations - 1) {
      // Get the median of the duration
      const durations = observer.current?.data ?? []
      const median = durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)]
      setResult(median)
    }
  }, [count, totalIterations])

  return (
    <div className={classes.Root}>
      <div className={classes.Container}>{renderIteration(count, totalIterations)}</div>
      <ProgressBar className={classes.ProgressBar} progress={(count / (totalIterations - 1)) * 100} animated />
      <Button
        variant="primary"
        disabled={count !== 0 && count !== totalIterations - 1}
        onClick={onClick}
        loading={count !== 0 && count !== totalIterations - 1}
        size="large"
        block
        data-testid={'start'}
      >
        {count === 1 ? 'Run' : 'Re-run'}
      </Button>
      <Text className={classes.Result}>
        <p>
          <strong>Results:</strong>
          <br />
          {result !== undefined ? (
            <>
              {'Median duration: '}
              <span data-testid="result">{result.toFixed(2)}</span>
              ms
            </>
          ) : (
            <span>Pending</span>
          )}
        </p>
      </Text>
    </div>
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
