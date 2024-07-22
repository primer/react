import React, {Profiler} from 'react'
import {createRoot, type Root} from 'react-dom/client'
import {Button} from '../Button'
import BaseStyles from '../BaseStyles'
import ThemeProvider from '../ThemeProvider'

declare global {
  interface Window {
    BenchmarkRunner: BenchmarkRunner
  }
}

interface BenchmarkRunner {
  addBenchmark(benchmark: Benchmark): void
  runBenchmarks(): Promise<
    Array<{
      benchmark: Benchmark
      result: BenchmarkResult
    }>
  >
}

class BenchmarkRunner implements BenchmarkRunner {
  benchmarks: Array<Benchmark> = []

  addBenchmark(benchmark: Benchmark): void {
    this.benchmarks.push(benchmark)
  }

  async runBenchmarks(): Promise<
    Array<{
      benchmark: Benchmark
      result: BenchmarkResult
    }>
  > {
    const results = []

    for (const benchmark of this.benchmarks) {
      const runs: Array<BenchmarkRunResult> = []

      for (let i = 0; i < 1000; i++) {
        await benchmark.setup()

        const run = await benchmark.run()
        runs.push(run)

        await benchmark.teardown()
      }

      const result: BenchmarkResult = {
        averageBaseDuration: average(runs, 'baseDuration'),
        averageActualDuration: average(runs, 'actualDuration'),
        medianBaseDuration: median(runs, 'baseDuration'),
        medianActualDuration: median(runs, 'actualDuration'),
        runs,
      }

      results.push({
        benchmark,
        result,
      })
    }

    return results
  }
}

function average<K extends string, T extends Record<K, number>>(series: Array<T>, field: K): number {
  let sum = 0

  for (const value of series) {
    sum += value[field]
  }

  return sum / series.length
}

function median<K extends string, T extends Record<K, number>>(series: Array<T>, field: K): number {
  const values: Array<number> = series.map(value => value[field]).sort()
  return values[Math.floor(values.length / 2)]
}

interface Benchmark {
  name: string
  setup(): Promise<void> | void
  run(): Promise<BenchmarkRunResult>
  teardown(): Promise<void> | void
}

interface BenchmarkResult {
  averageActualDuration: number
  averageBaseDuration: number
  medianActualDuration: number
  medianBaseDuration: number
  runs: Array<BenchmarkRunResult>
}

interface BenchmarkRunResult {
  phase: 'update' | 'mount' | 'nested-update'
  actualDuration: number
  baseDuration: number
}

window.BenchmarkRunner = new BenchmarkRunner()

benchmark('Button', ({render, onRender}) => {
  render(
    <ThemeProvider>
      <BaseStyles>
        <Profiler id="benchmark" onRender={onRender}>
          <Button>Test case</Button>
        </Profiler>
      </BaseStyles>
    </ThemeProvider>,
  )
})

function benchmark(
  name: string,
  fn: ({render, onRender}: {render: (element: JSX.Element) => void; onRender: React.ProfilerProps['onRender']}) => void,
) {
  let root: Root | null = null

  function setup() {
    const node = document.createElement('div')
    node.setAttribute('id', 'benchmark')
    document.body.appendChild(node)
    root = createRoot(node)
  }

  function teardown() {
    root?.unmount()
    const node = document.getElementById('benchmark')
    if (node) {
      node.remove()
    }
    root = null
  }

  function run(): Promise<BenchmarkRunResult> {
    return new Promise(resolve => {
      const onRender: React.ProfilerProps['onRender'] = (_id, phase, actualDuration, baseDuration) => {
        resolve({
          phase,
          actualDuration,
          baseDuration,
        })
      }
      const render = (element: JSX.Element) => {
        root?.render(element)
      }
      fn({
        render,
        onRender,
      })
    })
  }

  const benchmark: Benchmark = {
    name,
    setup,
    teardown,
    run,
  }

  window.BenchmarkRunner.addBenchmark(benchmark)
}
