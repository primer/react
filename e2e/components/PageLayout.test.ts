import {test, expect} from '@playwright/test'
import type {Page} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const isInViewPort = (page: Page, boundingBox: {x: number; y: number; width: number; height: number}) => {
  let width
  let height
  const viewportSize = page.viewportSize()
  if (viewportSize !== null) {
    width = viewportSize.width
    height = viewportSize.height
  }

  return (
    width !== undefined &&
    height !== undefined &&
    boundingBox.x >= 0 &&
    boundingBox.y >= 0 &&
    boundingBox.x + boundingBox.width <= width &&
    boundingBox.y + boundingBox.height <= height
  )
}

test.describe('PageLayout', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageLayout.Default.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout--default',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Pull Request', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--pull-request',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageLayout.Pull Request.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--pull-request',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Sticky Pane', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--sticky-pane',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageLayout.Sticky Pane.${theme}.png`)

          const content = page.getByTestId('content3')
          await content.scrollIntoViewIfNeeded()

          const paragraphRect = await page.getByTestId('paragraph0').boundingBox()
          if (paragraphRect) {
            expect(isInViewPort(page, paragraphRect)).toBe(true)
          }
        })

        test('non sticky pane', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--sticky-pane',
            globals: {
              colorScheme: theme,
            },
            args: {
              sticky: false,
              numParagraphsInPane: '6',
              numParagraphsInContent: '30',
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot()

          const content3 = page.getByTestId('content3')
          await content3.scrollIntoViewIfNeeded()
          const paragraphRect = await page.getByTestId('paragraph0').boundingBox()
          if (paragraphRect) {
            expect(isInViewPort(page, paragraphRect)).toBe(true)
          }
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--sticky-pane',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Nested Scroll Container', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--nested-scroll-container',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageLayout.Nested Scroll Container.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--nested-scroll-container',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Custom Sticky Header', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--custom-sticky-header',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageLayout.Custom Sticky Header.${theme}.png`)

          const content = page.getByTestId('content3')
          await content.scrollIntoViewIfNeeded()

          const paragraphBoundaries = await page.getByTestId('paragraph0').boundingBox()
          const stickyHeaderBoundaries = await page.getByTestId('sticky-header').boundingBox()
          if (paragraphBoundaries) {
            expect(isInViewPort(page, paragraphBoundaries)).toBe(true)
          }

          if (stickyHeaderBoundaries) {
            expect(isInViewPort(page, stickyHeaderBoundaries)).toBe(true)
          }
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--custom-sticky-header',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Resizable Pane', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--resizable-pane',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`PageLayout.Resizable Pane.${theme}.png`)
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--resizable-pane',
            globals: {
              colorScheme: theme,
            },
          })
          await expect(page).toHaveNoViolations()
        })
      })
    }
  })

  test.describe('Scroll Container Within Page Layout Pane', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--scroll-container-within-page-layout-pane',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(
            `PageLayout.Scroll Container Within Page Layout Pane.${theme}.png`,
          )
        })

        test('axe @aat', async ({page}) => {
          await visit(page, {
            id: 'components-pagelayout-features--scroll-container-within-page-layout-pane',
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
