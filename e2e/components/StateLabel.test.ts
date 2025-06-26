import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Draft',
    id: 'components-statelabel-features--draft',
  },
  {
    title: 'Issue Closed',
    id: 'components-statelabel-features--issue-closed',
  },
  {
    title: 'Issue Closed Not Planned',
    id: 'components-statelabel-features--issue-closed-not-planned',
  },
  {
    title: 'Issue Draft',
    id: 'components-statelabel-features--issue-draft',
  },
  {
    title: 'Issue Opened',
    id: 'components-statelabel-features--issue-opened',
  },
  {
    title: 'Pull Closed',
    id: 'components-statelabel-features--pull-closed',
  },
  {
    title: 'Pull Merged',
    id: 'components-statelabel-features--pull-merged',
  },
  {
    title: 'Pull Opened',
    id: 'components-statelabel-features--pull-opened',
  },
  {
    title: 'Unavailable',
    id: 'components-statelabel-features--unavailable',
  },
  {
    title: 'Small',
    id: 'components-statelabel-features--small',
  },
  {
    title: 'Open',
    id: 'components-statelabel-features--open',
  },
  {
    title: 'Closed',
    id: 'components-statelabel-features--closed',
  },
] as const

test.describe('StateLabel', () => {
  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('default @vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            await expect(page).toHaveScreenshot(`StateLabel.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})

test.describe('StateLabel', () => {
  test.describe('Draft', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--draft',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Draft.${theme}.png`)
        })
      })
    }
  })

  test.describe('Issue Closed', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--issue-closed',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Issue Closed.${theme}.png`)
        })
      })
    }
  })

  test.describe('Issue Closed Not Planned', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--issue-closed-not-planned',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Issue Closed Not Planned.${theme}.png`)
        })
      })
    }
  })

  test.describe('Issue Draft', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--issue-draft',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Issue Draft.${theme}.png`)
        })
      })
    }
  })

  test.describe('Issue Opened', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--issue-opened',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Issue Opened.${theme}.png`)
        })
      })
    }
  })

  test.describe('Pull Closed', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--pull-closed',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Pull Closed.${theme}.png`)
        })
      })
    }
  })

  test.describe('Pull Merged', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--pull-merged',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Pull Merged.${theme}.png`)
        })
      })
    }
  })

  test.describe('Pull Opened', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--pull-opened',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Pull Opened.${theme}.png`)
        })
      })
    }
  })

  test.describe('Unavailable', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--unavailable',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Unavailable.${theme}.png`)
        })
      })
    }
  })

  test.describe('Small', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--small',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Small.${theme}.png`)
        })
      })
    }
  })

  test.describe('Open', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--open',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Open.${theme}.png`)
        })
      })
    }
  })

  test.describe('Closed', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-statelabel-features--closed',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`StateLabel.Closed.${theme}.png`)
        })
      })
    }
  })
})
