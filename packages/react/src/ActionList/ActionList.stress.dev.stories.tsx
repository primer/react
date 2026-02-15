import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'
import {StressTest} from '../utils/StressTest'
import {TableIcon} from '@primer/octicons-react'
import {ActionList} from '.'
import React, {useState, useEffect, useRef, useCallback, memo} from 'react'
import afterFrame from 'afterframe'

export default {
  title: 'StressTests/Components/ActionList',
  component: ActionList,
} as Meta<ComponentProps<typeof ActionList>>

const totalIterations = 100

const projects = Array.from({length: totalIterations}, (_, i) => ({
  name: `Project ${i + 1}`,
  scope: `Scope ${i + 1}`,
}))

export const SingleSelect = () => {
  return (
    <StressTest
      componentName="ActionList"
      title="Single Select"
      description="Selecting a single item from a large list."
      totalIterations={totalIterations}
      renderIteration={count => {
        return (
          <>
            <ActionList selectionVariant="single" showDividers role="menu" aria-label="Project">
              {projects.map((project, index) => (
                <ActionList.Item
                  key={index}
                  role="menuitemradio"
                  selected={index === count}
                  aria-checked={index === count}
                >
                  <ActionList.LeadingVisual>
                    <TableIcon />
                  </ActionList.LeadingVisual>
                  {project.name}
                  <ActionList.Description variant="block">{project.scope}</ActionList.Description>
                </ActionList.Item>
              ))}
            </ActionList>
          </>
        )
      }}
    />
  )
}

export const ParentRerender = () => {
  return <ContextMemoizationBenchmark />
}

/**
 * This benchmark isolates the effect of context value memoization.
 *
 * Setup: A parent component holds a counter that increments 100 times.
 * The ActionList is rendered via a memoized child component (MemoizedList),
 * so React only re-renders it if props or context change.
 *
 * - Without useMemo on ListContext/ItemContext: the context values are new
 *   objects every render, so React re-renders all context consumers (every
 *   Description, LeadingVisual, TrailingVisual, Selection in every Item).
 * - With useMemo: context values are referentially stable, React bails out
 *   of re-rendering the consumers entirely.
 */

const listItems = Array.from({length: 100}, (_, i) => ({
  name: `Project ${i + 1}`,
  scope: `Scope ${i + 1}`,
}))

// Memoized list component: only re-renders when props change or context forces it
const MemoizedList = memo(function MemoizedList() {
  return (
    <ActionList selectionVariant="single" showDividers role="menu" aria-label="Project">
      {listItems.map((project, index) => (
        <ActionList.Item key={index} role="menuitemradio" selected={index === 0} aria-checked={index === 0}>
          <ActionList.LeadingVisual>
            <TableIcon />
          </ActionList.LeadingVisual>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
})

function ContextMemoizationBenchmark() {
  const totalIterations = 100
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<{median: number; average: number; min: number; max: number} | null>(null)
  const observerRef = useRef<{observer: PerformanceObserver; data: number[]} | null>(null)

  useEffect(() => {
    const duration: number[] = []
    const obs = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name === 'ctx-rerender') {
          duration.push(entry.duration)
        }
      }
    })
    obs.observe({entryTypes: ['measure']})
    observerRef.current = {data: duration, observer: obs}
    return () => obs.disconnect()
  }, [])

  const start = useCallback(() => {
    if (observerRef.current) observerRef.current.data.length = 0
    setResults(null)
    setRunning(true)
    setCount(0)

    let i = 0
    const interval = setInterval(() => {
      if (i < totalIterations - 1) {
        performance.mark('ctx-start')
        setCount(c => c + 1)
        afterFrame(() => {
          performance.mark('ctx-end')
          performance.measure('ctx-rerender', 'ctx-start', 'ctx-end')
        })
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          const durations = observerRef.current?.data ?? []
          const sorted = [...durations].sort((a, b) => a - b)
          setResults({
            median: sorted[Math.floor(sorted.length / 2)] ?? 0,
            average: durations.reduce((a, b) => a + b, 0) / durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
          })
          setRunning(false)
        }, 100)
      }
    }, 10)
  }, [])

  return (
    <div style={{padding: 16}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <div>
          <strong>ActionList Context Memoization</strong>
          <p style={{color: '#656d76', margin: '4px 0'}}>
            Parent re-renders 100x with a counter. ActionList is memoized, so only context changes trigger item
            re-renders. Tests whether ListContext/ItemContext values are stable.
          </p>
        </div>
        <button
          type="button"
          onClick={start}
          disabled={running}
          style={{
            padding: '8px 16px',
            background: running ? '#ccc' : '#1a7f37',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: running ? 'default' : 'pointer',
          }}
        >
          {running ? `Running ${count}/${totalIterations}...` : results ? 'Re-run' : 'Start'}
        </button>
      </div>

      {/* The counter forces this component to re-render, but MemoizedList should bail out if context is stable */}
      <div style={{display: 'none'}}>Counter: {count}</div>
      <MemoizedList />

      {results && (
        <div style={{marginTop: 16, fontFamily: 'monospace', fontSize: 14}}>
          <strong>Median: {results.median.toFixed(2)}ms</strong>
          {' | '}Average: {results.average.toFixed(2)}ms{' | '}
          Min: {results.min.toFixed(2)}ms{' | '}
          Max: {results.max.toFixed(2)}ms
        </div>
      )}
    </div>
  )
}
