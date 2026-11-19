import {writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import type {TestModule} from 'vitest/node'
import FlakyTestReporter from './flaky-test-reporter'

vi.mock('node:fs/promises', () => {
  return {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
  }
})

interface Outcome {
  name: string
  flaky: boolean
  retryCount: number
  errors?: Array<{
    message: string
    stack?: string
  }>
}

function moduleWithResults(outcomes: ReadonlyArray<Outcome>): TestModule {
  return {
    moduleId: join(process.cwd(), 'packages/react/src/TreeView/TreeView.test.tsx'),
    children: {
      allTests() {
        return outcomes.map(outcome => {
          return {
            project: {
              name: '@primer/react',
            },
            fullName: outcome.name,
            diagnostic() {
              return {
                flaky: outcome.flaky,
                retryCount: outcome.retryCount,
              }
            },
            result() {
              return {
                errors: outcome.errors,
              }
            },
          }
        })
      },
    },
  } as unknown as TestModule
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('FlakyTestReporter', () => {
  it('records recovered failures without including ordinary passes or persistent failures', async () => {
    await new FlakyTestReporter().onTestRunEnd([
      moduleWithResults([
        {
          name: 'recovers on retry',
          flaky: true,
          retryCount: 1,
          errors: [
            {
              message: 'Expected focus',
              stack: 'Expected focus\nat TreeView.test.tsx:10',
            },
          ],
        },
        {
          name: 'passes immediately',
          flaky: false,
          retryCount: 0,
        },
        {
          name: 'fails both attempts',
          flaky: false,
          retryCount: 1,
        },
      ]),
    ])

    const report = JSON.parse(String(vi.mocked(writeFile).mock.calls[0][1]))
    expect(report.tests).toEqual([
      {
        project: '@primer/react',
        file: 'packages/react/src/TreeView/TreeView.test.tsx',
        name: 'recovers on retry',
        retryCount: 1,
        errors: ['Expected focus\nat TreeView.test.tsx:10'],
      },
    ])
  })

  it('replaces earlier findings with an empty report when a later run has no flakes', async () => {
    const reporter = new FlakyTestReporter()
    await reporter.onTestRunEnd([
      moduleWithResults([
        {
          name: 'recovers',
          flaky: true,
          retryCount: 1,
          errors: [
            {
              message: 'Original error',
            },
          ],
        },
      ]),
    ])
    await reporter.onTestRunEnd([])

    expect(JSON.parse(String(vi.mocked(writeFile).mock.calls[1][1]))).toEqual({
      schemaVersion: 1,
      tests: [],
    })
  })
})
