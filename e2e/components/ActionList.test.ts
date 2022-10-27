import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('ActionList', () => {
  test.describe('With Links', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-examples--with-links',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Links.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-examples--with-links'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Single Selection', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-examples--single-selection',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Single Selection.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-examples--single-selection'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Multiple Selection', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-examples--multiple-selection',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Multiple Selection.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-examples--multiple-selection'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Groups', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-examples--groups',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Groups.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-examples--groups'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Mixed Selection', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-examples--mixed-selection',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Mixed Selection.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-examples--mixed-selection'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Async List With Spinner', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-examples--async-list-with-spinner',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Async List With Spinner.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-examples--async-list-with-spinner'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Simple List', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--simple-list-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Simple List.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--simple-list-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Icon', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--with-icon',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Icon.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--with-icon'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Avatar', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--with-avatar',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Avatar.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--with-avatar'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With Description & Dividers', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--with-description',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With Description & Dividers.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--with-description'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Disabled Items', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--disabled-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Disabled Items.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--disabled-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Actions', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--actions-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Actions.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--actions-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Complex List — Inset Variant', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--complex-list-inset-variant-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Complex List — Inset Variant.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--complex-list-inset-variant-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Complex List — Full Variant', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--complex-list-full-variant-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Complex List — Full Variant.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--complex-list-full-variant-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('List with LinkItem', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--link-item-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`List with LinkItem.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--link-item-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('List an item input including DOM props', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--dom-props-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`List an item input including DOM props.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--dom-props-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Custom Item Children', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--custom-item-children',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Custom Item Children.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--custom-item-children'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Size Stress Testing', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--size-stress-testing-story',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Size Stress Testing.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--size-stress-testing-story'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('All Combinations', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--all-combinations',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`All Combinations.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--all-combinations'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Conditional Children', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--conditional-children',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Conditional Children.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--conditional-children'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Nested Children', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--nested-children',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Nested Children.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--nested-children'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Child with internal state', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--child-with-internal-state',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Child with internal state.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--child-with-internal-state'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Child with side effects', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--child-with-side-effects',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Child with side effects.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--child-with-side-effects'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('With sx', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--with-sx',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`With sx.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--with-sx'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Memex Sortable List', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--memex-sortable',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Memex Sortable List.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--memex-sortable'
      })
      await expect(page).toHaveNoViolations()
    })
  })

  test.describe('Inside Overlay', () => {
    themes.forEach(theme => {
      test(`${theme} @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-actionlist-fixtures--inside-overlay',
          globals: {
            colorScheme: theme
          }
        })

        expect(await page.screenshot()).toMatchSnapshot(`Inside Overlay.${theme}.png`)
      })
    })

    test('axe @avt', async ({page}) => {
      await visit(page, {
        id: 'components-actionlist-fixtures--inside-overlay'
      })
      await expect(page).toHaveNoViolations()
    })
  })
})
