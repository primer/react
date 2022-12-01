'use strict'

const fs = require('node:fs')
const path = require('node:path')
const prettier = require('prettier')
const recast = require('recast')

const E2E_DIR = path.join(__dirname, '..', 'e2e', 'components')
const components = new Map([
  [
    'ActionList',
    {
      stories: [
        {
          id: 'components-actionlist--default',
          name: 'Default'
        },
        {
          id: 'components-actionlist-features--block-description',
          name: 'Block Description'
        },
        {
          id: 'components-actionlist-features--disabled-item',
          name: 'Disabled Item'
        },
        {
          id: 'components-actionlist-features--inline-description',
          name: 'Inline Description'
        },
        {
          id: 'components-actionlist-features--inside-overlay',
          name: 'Inside Overlay'
        },
        {
          id: 'components-actionlist-features--item-dividers',
          name: 'Item Dividers'
        },
        {
          id: 'components-actionlist-features--links',
          name: 'Links'
        },
        {
          id: 'components-actionlist-features--multi-select',
          name: 'Multi Select'
        },
        {
          id: 'components-actionlist-features--simple-list',
          name: 'Simple List'
        },
        {
          id: 'components-actionlist-features--single-divider',
          name: 'Single Divider'
        },
        {
          id: 'components-actionlist-features--single-select',
          name: 'Single Select'
        },
        {
          id: 'components-actionlist-features--text-wrap-and-truncation',
          name: 'Text Wrap And Truncation'
        },
        {
          id: 'components-actionlist-features--with-avatars',
          name: 'With Avatars'
        },
        {
          id: 'components-actionlist-features--with-icons',
          name: 'With Icons'
        }
      ]
    }
  ],
  [
    'UnderlineNav',
    {
      stories: [
        {
          id: 'drafts-components-underlinenav-examples--profile-page',
          name: 'Profile Page'
        },
        {
          id: 'drafts-components-underlinenav-examples--pull-request-page',
          name: 'Pull Request Page'
        },
        {
          id: 'drafts-components-underlinenav-examples--repos-page',
          name: 'Repos Page'
        },
        {
          id: 'drafts-components-underlinenav-features--counters-loading-state',
          name: 'Counters Loading State'
        },
        {
          id: 'drafts-components-underlinenav-features--default',
          name: 'Default'
        },
        {
          id: 'drafts-components-underlinenav-features--overflow-template',
          name: 'Overflow Template'
        },
        {
          id: 'drafts-components-underlinenav-features--with-counter-labels',
          name: 'With Counter Labels'
        },
        {
          id: 'drafts-components-underlinenav-features--with-icons',
          name: 'With Icons'
        }
      ]
    }
  ],
  [
    'TreeView',
    {
      stories: [
        {
          id: 'components-treeview--default',
          name: 'Default'
        },
        {
          id: 'components-treeview-features--empty-directories',
          name: 'Empty Directories'
        },
        {
          id: 'components-treeview-features--files',
          name: 'Files'
        },
        {
          id: 'components-treeview-features--files-changed',
          name: 'Files Changed'
        }
      ]
    }
  ]
])

for (const [component, info] of components) {
  const filepath = path.join(E2E_DIR, path.format({name: `${component}.test`, ext: '.ts'}))

  if (fs.existsSync(filepath)) {
    continue
  }

  const stories = info.stories.map(story => {
    return `test.describe('${story.name}', () => {
  for (const theme of themes) {
    test.describe(theme, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: '${story.id}',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(\`${component}.${story.name}.\${theme}.png\`)
      })

      test('axe @aat', async ({page}) => {
        await visit(page, {
          id: '${story.id}',
          globals: {
            colorScheme: theme
          }
        })
        await expect(page).toHaveNoViolations({
          rules: {
            'color-contrast': {
              enabled: theme !== 'dark_dimmed'
            },
          },
        })
      })
    });
  }
})`
  })

  const source = recast.parse(`import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('${component}', () => {
  ${stories.join('\n\n')}
})`)

  const {code} = recast.print(source)
  const formatted = prettier.format(code, {
    parser: 'typescript',
    printWidth: 120,
    semi: false,
    singleQuote: true,
    bracketSpacing: false,
    trailingComma: 'none',
    arrowParens: 'avoid'
  })
  fs.writeFileSync(filepath, formatted, 'utf8')
}
