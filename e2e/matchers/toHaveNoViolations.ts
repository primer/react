import {Page, expect, test} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {AxeResults} from 'axe-core'
import path from 'node:path'
import fs from 'node:fs'

const defaultOptions = {
  rules: {
    'document-title': {
      enabled: false
    },
    'html-has-lang': {
      enabled: false
    },
    'landmark-one-main': {
      enabled: false
    },
    'page-has-heading-one': {
      enabled: false
    },
    region: {
      enabled: false
    }
  }
}

expect.extend({
  async toHaveNoViolations(page: Page, options = {rules: {}}) {
    // @ts-ignore Page from @playwright/test should satisfy Page from
    // playwright-core
    const result = await new AxeBuilder({page})
      .options({
        ...defaultOptions,
        ...options,
        rules: {
          ...defaultOptions.rules,
          ...options.rules
        }
      })
      .analyze()

    saveResult(result)

    if (result.violations.length === 0) {
      return {
        pass: true
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
      }
    }
  }
})

function saveResult(result: AxeResults) {
  const testInfo = test.info()
  const resultsDir = testInfo.snapshotDir.replace(/snapshots/g, 'axe')

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, {
      recursive: true
    })
  }

  fs.writeFileSync(
    path.join(
      resultsDir,
      path.format({
        name: testInfo.titlePath.slice(1).join('-').replace(/ /g, '-'),
        ext: '.json'
      })
    ),
    JSON.stringify(result, null, 2),
    'utf8'
  )
}
