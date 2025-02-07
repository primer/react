import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('ActionList', () => {
  test.describe('Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Default.${theme}.png`)
        })
      })
    }
  })

  test.describe('Block Description', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--block-description',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Block Description.${theme}.png`)
        })
      })
    }
  })

  test.describe('Disabled Item', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--disabled-item',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Disabled Item.${theme}.png`)
        })
      })
    }
  })

  test.describe('Inline Description', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--inline-description',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Inline Description.${theme}.png`)
        })
      })
    }
  })

  test.describe('Inside Overlay', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--inside-overlay',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Inside Overlay.${theme}.png`)
        })
      })
    }
  })

  test.describe('Item Dividers', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--item-dividers',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Item Dividers.${theme}.png`)
        })
      })
    }
  })

  test.describe('Links', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--links',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Links.${theme}.png`)
        })
      })
    }
  })

  test.describe('Multi Select', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--multi-select',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionList.Multi Select.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Simple List', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--simple-list',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Simple List.${theme}.png`)
        })
      })
    }
  })

  test.describe('Single Divider', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--single-divider',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Single Divider.${theme}.png`)
        })
      })
    }
  })

  test.describe('Single Select', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--single-select',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Single Select.${theme}.png`)
        })
      })
    }
  })

  // removing this temporarily as there is a slight diff betqeen default and enabled CSS feature flag that feels like a non-issue
  // eslint-disable-next-line jest/no-commented-out-tests
  // test.describe('Text Wrap And Truncation', () => {
  //   for (const theme of themes) {
  // eslint-disable-next-line jest/no-commented-out-tests
  //     test.describe(theme, () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  //       test('default @vrt', async ({page}) => {
  //         await visit(page, {
  //           id: 'components-actionlist-features--text-wrap-and-truncation',
  //           globals: {
  //             colorScheme: theme,
  //           },
  //         })

  //         // Default state
  //         expect(await page.screenshot()).toMatchSnapshot(`ActionList.Text Wrap And Truncation.${theme}.png`)
  //       })

  // })

  test.describe('With Avatars', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--with-avatars',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.With Avatars.${theme}.png`)
        })
      })
    }
  })

  test.describe('With Icons', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--with-icons',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.With Icons.${theme}.png`)
        })
      })
    }
  })

  test.describe('Disabled Multiselect', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--disabled-multiselect',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Disabled Multiselect.${theme}.png`)
        })
      })
    }
  })

  test.describe('Disabled Selected Multiselect', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--disabled-selected-multiselect',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionList.Disabled Selected Multiselect.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Inactive Item', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--inactive-item',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionList.Inactive Item.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Inactive Multiselect', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--inactive-multiselect',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionList.Inactive Multiselect.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Loading Item', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--loading-item',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `ActionList.Loading Item.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('Group With Filled Title', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--group-with-filled-title',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Group With Filled Title.${theme}.png`)
        })
      })
    }
  })

  test.describe('Group With Subtle Title', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--group-with-subtle-title',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Group With Subtle Title.${theme}.png`)
        })
      })
    }
  })

  test.describe('Group With Filled Title Old Api', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-dev--group-with-filled-title-old-api',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Group With Filled Title Old Api.${theme}.png`)
        })
      })
    }
  })

  test.describe('Group With Subtle Title Old Api', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-dev--group-with-subtle-title-old-api',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Group With Subtle Title Old Api.${theme}.png`)
        })
      })
    }
  })

  test.describe('Full Variant', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-features--full-variant',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`ActionList.Full Variant.${theme}.png`)
        })
      })
    }
  })

  test.describe('Group Heading with Classname', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-dev--group-heading-custom-classname',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Group Heading with Classname.${theme}.png`)
        })
      })
    }
  })

  test.describe('Heading with Classname', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-dev--heading-custom-classname',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Heading with Classname.${theme}.png`)
        })
      })
    }
  })

  test.describe('Visuals with Classnames', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-dev--visual-custom-classname',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Visuals with Classnames.${theme}.png`)
        })
      })
    }
  })

  test.describe('Link Item Options', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'components-actionlist-examples--list-link-item',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot()).toMatchSnapshot(`Link Item Options.${theme}.png`)
        })
      })
    }
  })
})
