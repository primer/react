import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('DataTable', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Title', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-title',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Title and Subtitle', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-title-and-subtitle',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Sorting', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-sorting',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Actions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-actions',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Action', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-action',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Row Action', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-row-action',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Row Actions', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-row-actions',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Row Action Menu', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-row-action-menu',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Custom Heading', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-custom-heading',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('With Overflow', () => {
    test('focusable region for overflow', async ({page}) => {
      await visit(page, {
        id: 'drafts-components-datatable-features--with-overflow',
      })

      const heading = page.getByRole('heading', {name: 'Repositories'})
      const headingId = await heading.getAttribute('id')

      const region = page.getByRole('region')
      const table = region.getByRole('table')

      const tabIndex = await region.getAttribute('tabindex')
      const labelledby = await region.getAttribute('aria-labelledby')

      await expect(region).toBeVisible()
      expect(tabIndex).toBe('0')
      expect(labelledby).toBe(headingId)

      await expect(table).toBeVisible()
      expect(labelledby).toBe(headingId)
    })

    for (const theme of themes) {
      test.describe(theme, () => {
        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'drafts-components-datatable-features--with-overflow',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })
})
