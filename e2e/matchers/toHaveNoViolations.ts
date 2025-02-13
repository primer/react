import type {Page} from '@playwright/test'
import {expect, test} from '@playwright/test'
import type {AxeResults} from 'axe-core'
import {source} from 'axe-core'
import path from 'node:path'
import fs from 'node:fs'

const COLOR_CONTRAST_SKIP = [
  'experimental-components-hidden-examples--pull-request-page',
  'components-underlinenav-examples--pull-request-page',
  'components-actionmenu-examples--groups-and-descriptions',
  'components-button-features--expanded-button',
  'components-formcontrol-features--with-caption-and-disabled',
  'components-formcontrol-features--with-leading-visual',
  'components-pageheader-examples--issues-page',
  'components-pageheader-examples--with-page-layout',
  'components-pageheader-examples--pull-request-page',
  'experimental-components-hidden-examples--pull-request-page-on-narrow-viewport',
  'components-pageheader-examples--pull-request-page-on-narrow-viewport',
  'components-pagelayout-features--pull-request-page',
  'components-statelabel--default',
  'components-statelabel--playground',
  'components-statelabel-features--issue-opened',
  'components-statelabel-features--pull-opened',
  'components-statelabel-features--small',
  'deprecated-components-actionlist--complex-list-inset-variant-story', // Deprecated component
  'deprecated-components-actionlist--complex-list-full-variant-story', // Deprecated component
]

const defaultOptions = (colorScheme: string, shouldSkip: boolean) => ({
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
      enabled: colorScheme !== 'dark_dimmed' && !shouldSkip,
    },
  },
})

expect.extend({
  async toHaveNoViolations(page: Page, options = {rules: {}}) {
    // get color scheme from globals

    const pageUrl = page.url()
    const isDev = pageUrl.includes('-dev--')
    const idName = pageUrl.split('id=')[1].split('&')[0]

    const shouldSkip = COLOR_CONTRAST_SKIP.includes(idName)

    const globals = new URL(pageUrl).searchParams.get('globals')
    const colorScheme = globals?.split('colorScheme:')[1] ?? 'light'

    const runConfig = {
      ...defaultOptions(colorScheme, isDev || shouldSkip),
      ...options,
      rules: {
        ...defaultOptions(colorScheme, isDev || shouldSkip).rules,
        ...options.rules,
      },
    }

    await page.evaluate(source)

    const configSrc = fs.readFileSync(require.resolve('@github/axe-github/configure-browser'), 'utf8')

    page.evaluate(configSrc => {
      window.eval(configSrc)
    }, configSrc)

    const result: AxeResults = await page.evaluate(runConfig => {
      // @ts-ignore `axe` is a global variable defined by page.evaluate() above
      const axe = window.axe

      // @ts-ignore `axe` is a global variable defined by page.evaluate() above
      return axe.run(runConfig)
    }, runConfig)

    saveResult(result)

    if (result.violations.length === 0) {
      return {
        pass: true,
        message: () => 'No axe violations',
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
