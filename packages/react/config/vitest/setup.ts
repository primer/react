import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/react'
import type axe from 'axe-core'
import {afterEach, expect, vi} from 'vitest'

expect.extend({
  toHaveNoViolations(results: axe.AxeResults) {
    return {
      pass: results.violations.length === 0,
      message: () => {
        return results.violations
          .map(err => {
            return `Expected the HTML found in the document to have no violations, but received:
            \n${err.help}
            \n${err.nodes
              .map(
                (node, index) => `${index + 1}. ${node.html}
              \n${node.failureSummary}\n`,
              )
              .join('\n')}\nMore information can be found at: ${err.helpUrl}\n${'─'.repeat(20)}
          `
          })
          .join('\n')
      },
    }
  },
})

afterEach(() => {
  cleanup()
})

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
// @ts-expect-error we are not implementing all of CSS
window.CSS = {
  supports: vi.fn(),
}
