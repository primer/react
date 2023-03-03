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
    'color-contrast': {
      enabled: false,
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

      const interactiveElements = ['a[href]', 'button', 'summary', 'select', 'input:not([type=hidden])', 'textarea']
      const focusableElements = interactiveElements.concat(['[tabindex]'])

      axe.configure({
        rules: [
          {
            id: 'menuitem-should-be-interactive',
            excludeHidden: true,
            selector:
              'div[role="menuitem"], span[role="menuitem"], div[role="menuitemradio"], span[role="menuitemradio"], div[role="menuitemcheckbox"], span[role="menuitemcheckbox"]',
            all: ['menuitem-should-be-interactive_0'],
            any: [],
            metadata: {
              help: 'Menu items must be focusable. Use <button>, <a>, or <label tabindex="0">',
              helpUrl: '',
            },
            tags: ['custom-github-rule'],
          },
          {
            id: 'empty-summary',
            excludeHidden: true,
            selector: 'summary',
            all: [],
            any: [
              'has-visible-text',
              'aria-label',
              'aria-labelledby',
              'role-presentation',
              'role-none',
              'non-empty-title',
            ],
            metadata: {
              help: 'Details summary element must have visible text',
              helpUrl: '',
            },
            tags: ['custom-github-rule'],
          },
          {
            id: 'submit-reset-button-must-be-in-form',
            excludeHidden: true,
            selector: 'button[type="submit"], button[type="reset"], input[type="submit"], input[type="reset"]',
            all: ['submit-reset-button-must-be-in-form_0'],
            any: [],
            metadata: {
              help: 'Submit and reset buttons must be in a form',
              helpUrl: '',
            },
            tags: ['custom-github-rule'],
          },
          {
            id: 'nested-forms',
            excludeHidden: true,
            selector: 'form',
            all: ['nested-forms_0'],
            any: [],
            metadata: {
              help: 'Nested form is invalid HTML and should be avoided',
              helpUrl:
                'https://html.spec.whatwg.org/multipage/forms.html#the-form-element:concept-element-content-model',
            },
            tags: ['custom-github-rule'],
          },
          {
            id: 'avoid-both-disabled-and-aria-disabled',
            excludeHidden: true,
            selector: 'button, fieldset, input, optgroup, option, select, textarea',
            all: ['avoid-both-disabled-and-aria-disabled_0'],
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
            id: 'menuitem-should-be-interactive_0',
            evaluate: (el: Element) => focusableElements.filter(s => el.matches(s)).length > 0,
            metadata: {
              impact: 'critical',
            },
          },
          {
            id: 'submit-reset-button-must-be-in-form_0',
            evaluate: (el: Element) => {
              const formId = el.getAttribute('form')
              return !!el.closest('form') || !!(formId && document.getElementById(formId))
            },
            metadata: {
              impact: 'critical',
            },
          },
          {
            id: 'nested-forms_0',
            evaluate: (el: Element) => !(el.parentElement && el.parentElement.closest('form')),
            metadata: {
              impact: 'critical',
            },
          },
          {
            id: 'avoid-both-disabled-and-aria-disabled_0',
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
