import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('SelectPanel', () => {
  test.describe('Multi Select', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-selectpanel--multi-select-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Multi Select.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--multi-select-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Single Select', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-selectpanel--single-select-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Single Select.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--single-select-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With External Anchor', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-selectpanel--external-anchor-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With External Anchor.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--external-anchor-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('SelectPanel, Height: Initial, Overflowing Items', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-selectpanel--select-panel-height-initial-with-overflowing-items-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`SelectPanel, Height: Initial, Overflowing Items.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-height-initial-with-overflowing-items-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('SelectPanel, Height: Initial, Underflowing Items', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-selectpanel--select-panel-height-initial-with-underflowing-items-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`SelectPanel, Height: Initial, Underflowing Items.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-height-initial-with-underflowing-items-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('SelectPanel, Height: Initial, Underflowing Items (After Fetch)', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-selectpanel--select-panel-height-initial-with-underflowing-items-after-fetch',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(
          `SelectPanel, Height: Initial, Underflowing Items (After Fetch).${theme}.png`
        )
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-height-initial-with-underflowing-items-after-fetch'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('SelectPanel, Above a Tall Body', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-selectpanel--select-panel-above-tall-body',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`SelectPanel, Above a Tall Body.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-above-tall-body'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('SelectPanel, Height and Scroll', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-selectpanel--select-panel-height-and-scroll',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`SelectPanel, Height and Scroll.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-selectpanel--select-panel-height-and-scroll'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
