import {Page, expect, test} from '@playwright/test'
import {AxeResults, source} from 'axe-core'
import path from 'node:path'
import fs from 'node:fs'

const defaultOptions = {
  rules: {
    'document-title': {
      enabled: false,
    },
    'html-has-lang': {
      enabled: false,
    },
    'landmark-one-main': {
      enabled: false,
    },
    'page-has-heading-one': {
      enabled: false,
    },
    region: {
      enabled: false,
    },
    // Custom rules
    'avoid-both-disabled-and-aria-disabled': {
      enabled: true,
    },
  },
}

expect.extend({
  async toHaveNoViolations(page: Page, options = {rules: {}}) {
    const runConfig = {
      ...defaultOptions,
      ...options,
      rules: {
        ...defaultOptions.rules,
        ...options.rules,
      },
    }

    await page.evaluate(source)

    const result: AxeResults = await page.evaluate(runConfig => {
      // @ts-ignore `axe` is a global variable defined by page.evaluate() above
      const axe = window.axe

      axe.configure({
        rules: [
          {
            id: 'avoid-both-disabled-and-aria-disabled',
            excludeHidden: true,
            selector: 'button, fieldset, input, optgroup, option, select, textarea',
            all: ['check-avoid-both-disabled-and-aria-disabled'],
            any: [],
            metadata: {
              help: '[aria-disabled] may be used in place of native HTML [disabled] to allow tab-focus on an otherwise ignored element. Setting both attributes is contradictory.',
              helpUrl: 'https://www.w3.org/TR/html-aria/#docconformance-attr',
            },
            tags: ['custom-github-rule'],
          },
        ],
        checks: [
          {
            id: 'check-avoid-both-disabled-and-aria-disabled',
            /**
             * Check an element with native `disabled` support doesn't have both `disabled` and `aria-disabled` set.
             */
            evaluate: (el: Element) => !(el.hasAttribute('aria-disabled') && el.hasAttribute('disabled')),
            metadata: {
              impact: 'critical',
            },
          },
        ],
      })

      // @ts-ignore `axe` is a global variable defined by page.evaluate() above
      return axe.run(runConfig)
    }, runConfig)

    saveResult(result)

    if (result.violations.length === 0) {
      return {
        pass: true,
      }
    }

    return {
      pass: false,
      message: () => {
        const violations = result.violations.map((violation, index) => {
          let output = `(${index + 1}) ${violation.help} [${violation.id}]\n\n`

          for (const node of violation.nodes) {
            output += 'Node\n'

            for (const target of node.target) {
              output += `  - ${target}\n`
            }
            output += '\n'
          }

          output += `> ${violation.helpUrl}`

          return output
        })

        return `${result.violations.length} axe violations
${violations.join('\n\n')}`
      },
    }
  },
})

function saveResult(result: AxeResults) {
  const testInfo = test.info()
  const resultsDir = testInfo.snapshotDir.replace(/snapshots/g, 'axe')

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, {
      recursive: true,
    })
  }

  fs.writeFileSync(
    path.join(
      resultsDir,
      path.format({
        name: testInfo.titlePath.slice(1).join('-').replace(/ /g, '-'),
        ext: '.json',
      }),
    ),
    JSON.stringify(result, null, 2),
    'utf8',
  )
}
