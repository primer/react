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

const stories = [
  {
    id: 'components-pagelayout--default',
    title: 'Default',
  },
  {
    id: 'components-pagelayout-dev--default',
    title: 'Dev Default',
  },
  {
    id: 'components-pagelayout-features--pull-request-page',
    title: 'Pull Request Page',
  },
  {
    id: 'components-pagelayout-features--nested-scroll-container',
    title: 'Nested Scroll Container',
  },
  {
    id: 'components-pagelayout-features--resizable-pane',
    title: 'Resizable Pane',
  },
  {
    id: 'components-pagelayout-features--scroll-container-within-page-layout-pane',
    title: 'Scroll Container Within Page Layout Pane',
  },
] as const

test.describe('PageLayout', () => {
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
            expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
              `PageLayout.${story.title}.${theme}.png`,
            )
          })
        })
      }
    })
  }
})

const stickyPaneId = 'components-pagelayout-features--sticky-pane'

test.describe('PageLayout', () => {
  test.describe('Sticky Pane', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: stickyPaneId,
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await expect(page).toHaveScreenshot(`PageLayout.StickyPane.${theme}.png`)

          const content = page.getByTestId('content3')
          await content.scrollIntoViewIfNeeded()

          const paragraphRect = await page.getByTestId('paragraph0').boundingBox()
          if (paragraphRect) {
            expect(isInViewPort(page, paragraphRect)).toBe(true)
          }
        })

        test('non sticky pane', async ({page}) => {
          await visit(page, {
            id: stickyPaneId,
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
          await expect(page).toHaveScreenshot(`PageLayout.NonStickyPane.${theme}.png`)

          const content3 = page.getByTestId('content3')
          await content3.scrollIntoViewIfNeeded()
          const paragraphRect = await page.getByTestId('paragraph0').boundingBox()
          if (paragraphRect) {
            expect(isInViewPort(page, paragraphRect)).toBe(true)
          }
        })
      })
    }
  })

  const customStickyPaneId = 'components-pagelayout-features--custom-sticky-header'

  test.describe('Custom Sticky Header', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: customStickyPaneId,
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await expect(page).toHaveScreenshot(`PageLayout.Custom Sticky Header.${theme}.png`)

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
      })
    }
  })
})
