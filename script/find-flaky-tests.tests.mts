import assert from 'node:assert/strict'
import {describe, it} from 'node:test'
import {formatReport, parseFlakyTests} from './find-flaky-tests.mts'

const run = {
  databaseId: 123,
  createdAt: '2026-09-01T12:00:00Z',
  url: 'https://github.com/primer/react/actions/runs/123',
}

describe('parseFlakyTests', () => {
  it('extracts flaky test summaries from AAT and VRT runner logs', () => {
    const log = [
      'aat-reports / aat-runner (1)\tRun AAT\t2026-09-01T12:00:00Z   1 flaky',
      'aat-reports / aat-runner (1)\tRun AAT\t2026-09-01T12:00:00Z     e2e/Axe.test.ts:10:2 › Axe › @aat test',
      'vrt-reports / vrt-runner (8)\tRun VRT\t2026-09-01T12:00:00Z   1 flaky',
      'vrt-reports / vrt-runner (8)\tRun VRT\t2026-09-01T12:00:00Z     [chromium] › e2e/Visual.test.ts:20:4 › @vrt test',
      'aat-reports / aat\tMerge\t2026-09-01T12:00:00Z   1 flaky',
    ].join('\n')

    assert.deepEqual(parseFlakyTests(log, run), [
      {suite: 'aat', test: 'e2e/Axe.test.ts:10:2 › Axe › @aat test', run},
      {suite: 'vrt', test: 'e2e/Visual.test.ts:20:4 › @vrt test', run},
    ])
  })
})

describe('formatReport', () => {
  it('aggregates repeated occurrences and links the latest run', () => {
    const report = formatReport(
      [
        {suite: 'aat', test: 'e2e/Axe.test.ts:10:2 › test', run},
        {
          suite: 'aat',
          test: 'e2e/Axe.test.ts:10:2 › test',
          run: {
            databaseId: 456,
            createdAt: '2026-09-02T12:00:00Z',
            url: 'https://github.com/primer/react/actions/runs/456',
          },
        },
      ],
      7,
    )

    assert.match(report, /\| AAT \| e2e\/Axe\.test\.ts:10:2 › test \| 2 \|/)
    assert.match(report, /\[run\]\(https:\/\/github\.com\/primer\/react\/actions\/runs\/456\)/)
  })
})
