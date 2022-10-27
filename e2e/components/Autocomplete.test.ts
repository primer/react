import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Autocomplete', () => {
  test.describe('Default', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--default',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Default.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Token Input', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--with-token-input',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Token Input.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--with-token-input'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Add New Item', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--add-new-item',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Add New Item.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--add-new-item'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Custom Search Filter Fn', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--custom-search-filter-fn',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Custom Search Filter Fn.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--custom-search-filter-fn'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Custom Sort After Menu Close', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--custom-sort-after-menu-close',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Custom Sort After Menu Close.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--custom-sort-after-menu-close'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Callback When Overlay Open State Changes', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--with-callback-when-overlay-open-state-changes',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Callback When Overlay Open State Changes.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--with-callback-when-overlay-open-state-changes'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Async Loading Of Items', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--async-loading-of-items',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Async Loading Of Items.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--async-loading-of-items'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Rendering The Menu Outside An Overlay', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--rendering-the-menu-outside-an-overlay',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Rendering The Menu Outside An Overlay.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--rendering-the-menu-outside-an-overlay'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Custom Overlay Menu Anchor', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--custom-overlay-menu-anchor',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Custom Overlay Menu Anchor.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--custom-overlay-menu-anchor'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('In Overlay With Custom Scroll Container Ref', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-forms-autocomplete--in-overlay-with-custom-scroll-container-ref',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`In Overlay With Custom Scroll Container Ref.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-forms-autocomplete--in-overlay-with-custom-scroll-container-ref'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
