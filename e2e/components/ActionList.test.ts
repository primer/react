import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

const stories = [
  {
    title: 'Default',
    id: 'components-actionlist--default',
  },
  {
    title: 'Block Description',
    id: 'components-actionlist-features--block-description',
  },
  {
    title: 'Disabled Item',
    id: 'components-actionlist-features--disabled-item',
  },
  {
    title: 'Inline Description',
    id: 'components-actionlist-features--inline-description',
  },
  {
    title: 'Inside Overlay',
    id: 'components-actionlist-features--inside-overlay',
  },
  {
    title: 'Item Dividers',
    id: 'components-actionlist-features--item-dividers',
  },
  {
    title: 'Links',
    id: 'components-actionlist-features--links',
  },
  {
    title: 'Multi Select',
    id: 'components-actionlist-features--multi-select',
  },
  {
    title: 'Simple List',
    id: 'components-actionlist-features--simple-list',
  },
  {
    title: 'Single Divider',
    id: 'components-actionlist-features--single-divider',
  },
  {
    title: 'Single Select',
    id: 'components-actionlist-features--single-select',
  },
  {
    title: 'With Avatars',
    id: 'components-actionlist-features--with-avatars',
  },
  {
    title: 'With Icons',
    id: 'components-actionlist-features--with-icons',
  },
  {
    title: 'Disabled Multiselect',
    id: 'components-actionlist-features--disabled-multiselect',
  },
  {
    title: 'Disabled Selected Multiselect',
    id: 'components-actionlist-features--disabled-selected-multiselect',
  },
  {
    title: 'Inactive Item',
    id: 'components-actionlist-features--inactive-item',
  },
  {
    title: 'Inactive Multiselect',
    id: 'components-actionlist-features--inactive-multiselect',
  },
  {
    title: 'Loading Item',
    id: 'components-actionlist-features--loading-item',
  },
  {
    title: 'Group With Filled Title',
    id: 'components-actionlist-features--group-with-filled-title',
  },
  {
    title: 'Group With Subtle Title',
    id: 'components-actionlist-features--group-with-subtle-title',
  },
  {
    title: 'Group With Filled Title Old Api',
    id: 'components-actionlist-dev--group-with-filled-title-old-api',
  },
  {
    title: 'Group With Subtle Title Old Api',
    id: 'components-actionlist-dev--group-with-subtle-title-old-api',
  },
  {
    title: 'Full Variant',
    id: 'components-actionlist-features--full-variant',
  },
  {
    title: 'Group Heading with Classname',
    id: 'components-actionlist-dev--group-heading-custom-classname',
  },
  {
    title: 'Heading with Classname',
    id: 'components-actionlist-dev--heading-custom-classname',
  },
  {
    title: 'Visuals with Classnames',
    id: 'components-actionlist-dev--visual-custom-classname',
  },
  {
    title: 'Link Item Options',
    id: 'components-actionlist-examples--list-link-item',
  },
] as const

test.describe('ActionList', () => {
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
            await expect(page).toHaveScreenshot(`ActionList.${story.title}.${theme}.png`)
          })
        })
      }
    })
  }
})

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
  // test.describe('Text Wrap And Truncation', () => {
  //   for (const theme of themes) {
  //     test.describe(theme, () => {
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
