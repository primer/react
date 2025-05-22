import type React from 'react'
import {useEffect, useState, useRef} from 'react'
import afterFrame from 'afterframe'

import {Button} from '../Button'
import Text from '../Text'
import classes from './StressTest.module.css'
import {ZapIcon} from '@primer/octicons-react'

export interface StressTestProps {
  componentName: string
  title: string
  description: string
  totalIterations: number
  renderIteration: (count: number, totalIterations: number) => React.ReactNode
}

export const StressTest: React.FC<StressTestProps> = ({
  componentName,
  title,
  description,
  totalIterations,
  renderIteration,
}) => {
  const startTime = useRef<number>()
  const [count, setCount] = useState(0)
  const [median, setMedian] = useState<undefined | number>(undefined)
  const [average, setAverage] = useState<undefined | number>(undefined)
  const [min, setMin] = useState<undefined | number>(undefined)
  const [max, setMax] = useState<undefined | number>(undefined)

  // Initialize the observer to log performance metrics, stored in a ref and initialized only once
  const observer = useRef<{observer: PerformanceObserver; data: number[]} | null>(null)

  useEffect(() => {
    // Initialize the observer when the component mounts
    if (!observer.current) {
      observer.current = initializeObserver()
    }
    // Cleanup the observer when the component unmounts
    return () => {
      if (observer.current) {
        observer.current.observer.disconnect()
        observer.current = null
      }
    }
  }, [])

  const onClick = () => {
    setCount(0)
    startTime.current = performance.now()
    let count = 0
    const interval = setInterval(() => {
      if (count < totalIterations - 1) {
        const interaction = measureInteraction()
        // The afterFrame library calls the function
        // when the next frame starts
        setCount(c => c + 1)
        afterFrame(() => {
          interaction.end()
        })
        count++
      } else {
        clearInterval(interval)
      }
    }, 10)
  }

  useEffect(() => {
    if (count === totalIterations - 1) {
      // Get the median of the duration when the test is done
      const durations = observer.current?.data ?? []
      setMedian(durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)])
      setAverage(durations.reduce((a, b) => a + b, 0) / durations.length)
      setMin(Math.min(...durations))
      setMax(Math.max(...durations))
    }
  }, [count, totalIterations])

  return (
    <div className={classes.Root}>
      <div className={classes.Header}>
        <div className={classes.HeaderColumn}>
          <div className={classes.HeaderRow}>
            <ZapIcon size={16} />
            <Text size="large" weight="semibold">
              <code>{componentName}</code>
            </Text>
          </div>
          <div className={classes.HeaderRow}>
            <Text size="medium" color="fg.muted">
              {title}: {description}
            </Text>
          </div>
        </div>
        <div className={classes.HeaderColumn}>
          <Button
            variant="primary"
            disabled={count !== 0 && count !== totalIterations - 1}
            onClick={onClick}
            loading={count !== 0 && count !== totalIterations - 1}
            size="large"
            data-testid={'start'}
          >
            {count === 0 ? 'Start' : 'Re-run'}
          </Button>
        </div>
      </div>
      <div className={classes.Container}>
        <div className={classes.Box}>{renderIteration(count, totalIterations)}</div>
      </div>

      <div className={classes.Footer}>
        <Text size="medium" color="fg.muted">
          <code>
            {count === 0 ? (
              "Click 'Start' to start the test"
            ) : count === totalIterations - 1 ? (
              <>
                <strong>
                  {'Median: '}
                  <span data-testid="result">{median?.toFixed(2)}</span>
                  ms
                </strong>
                {`  |  Average: ${average?.toFixed(2)}ms  |  `}
                {`Min: ${min?.toFixed(2)}ms  |  `}
                {`Max: ${max?.toFixed(2)}ms`}
              </>
            ) : (
              `Step ${count}/${totalIterations} — ${((performance.now() - (startTime.current ?? 0)) / 1000).toFixed(
                0,
              )}s`
            )}
          </code>
        </Text>
      </div>
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
