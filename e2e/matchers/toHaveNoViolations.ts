import {Page, expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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
  async toHaveNoViolations(page: Page, options = {}) {
    // @ts-ignore Page from @playwright/test should satisfy Page from
    // playwright-core
    const result = await new AxeBuilder({page})
      .options({
        ...defaultOptions,
        ...options
      })
      .analyze()

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
