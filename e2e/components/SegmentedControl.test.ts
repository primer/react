import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('SegmentedControl', () => {
  test.describe('Default', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-segmentedcontrol--default',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Default.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol--default'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Controlled', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-segmentedcontrol--controlled',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Controlled.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol--controlled'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Icons And Labels', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-segmentedcontrol--with-icons-and-labels',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Icons And Labels.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol--with-icons-and-labels'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Icons Only', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-segmentedcontrol--icons-only',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Icons Only.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol--icons-only'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Associated With A Label And Caption', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-segmentedcontrol--associated-with-a-label-and-caption',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Associated With A Label And Caption.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol--associated-with-a-label-and-caption'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Full Width', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-segmentedcontrol--full-width',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Full Width.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol--full-width'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
