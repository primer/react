import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-timeline--default',
  },
  {
    title: 'Clip Sidebar',
    id: 'components-timeline-features--clip-sidebar',
  },
  {
    title: 'Clip Sidebar Start',
    id: 'components-timeline-features--clip-sidebar-start',
  },
  {
    title: 'Clip Sidebar End',
    id: 'components-timeline-features--clip-sidebar-end',
  },
  {
    title: 'Condensed Items',
    id: 'components-timeline-features--condensed-items',
  },
  {
    title: 'Timeline Break',
    id: 'components-timeline-features--timeline-break',
  },
  {
    title: 'Badge Variants',
    id: 'components-timeline-features--badge-variants',
  },
  {
    title: 'With Actions',
    id: 'components-timeline-features--with-actions',
  },
] as const

test.describe('Timeline', () => {
  test('retains its intrinsic width inside a shrink-to-fit container', async ({page}) => {
    await visit(page, {
      id: 'components-timeline--default',
    })

    const body = page.getByText('This is a message').first()
    const timeline = body.locator('../..')

    await timeline.evaluate(element => {
      const outer = document.createElement('div')
      const inner = document.createElement('div')
      outer.style.display = 'flex'
      outer.style.justifyContent = 'center'
      element.parentElement?.insertBefore(outer, element)
      outer.appendChild(inner)
      inner.appendChild(element)
    })

    await expect.poll(async () => (await timeline.boundingBox())?.width).toBeGreaterThan(0)
    await expect.poll(async () => (await body.boundingBox())?.width).toBeGreaterThan(0)
  })

  test('wraps Actions below Body only when narrower than 480px', async ({page}) => {
    await visit(page, {
      id: 'components-timeline-features--with-actions',
    })

    const actions = page.getByRole('button', {name: 'View details'}).first().locator('..')
    const item = actions.locator('..')
    const timeline = item.locator('..')
    const body = item.locator('[class*="TimelineBody"]')

    await timeline.evaluate(element => {
      element.style.width = '479px'
    })
    await expect(timeline).toHaveAttribute('data-timeline-narrow', '')
    await expect.poll(async () => (await actions.boundingBox())?.y).toBeGreaterThan((await body.boundingBox())?.y ?? 0)

    await timeline.evaluate(element => {
      element.style.width = '480px'
    })
    await expect(timeline).not.toHaveAttribute('data-timeline-narrow')
    await expect.poll(async () => (await actions.boundingBox())?.y).toBeLessThan((await body.boundingBox())?.y ?? 0)
  })

  for (const story of stories) {
    test.describe(story.title, () => {
      for (const theme of themes) {
        test.describe(theme, () => {
          test('@vrt', async ({page}) => {
            await visit(page, {
              id: story.id,
              globals: {
                colorScheme: theme,
              },
            })

            // Default state
            await expect(page).toHaveScreenshot(`Timeline.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }

  test.describe('With Inline Links', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-timeline-features--with-inline-links',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          await expect(page).toHaveScreenshot(`Timeline.With Inline Links.${theme}.png`)

          // Hover state
          await page
            .getByRole('link', {
              name: 'Monalisa',
            })
            .hover()
          await expect(page).toHaveScreenshot(`Timeline.With Inline Links.${theme}.hover.png`)

          // Focus state
          await page.keyboard.press('Tab')
          await expect(page).toHaveScreenshot(`Timeline.With Inline Links.${theme}.focus.png`)
        })
      })
    }
  })
})
