import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('Skeleton', () => {
  //
  // SkeletonAvatar
  //
  test.describe('SkeletonAvatar - Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonavatar--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonAvatar.Default.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonAvatar - In A Stack', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonavatar-features--in-a-stack',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonAvatar.InAStack.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('SkeletonAvatar - In An AvatarPair', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonavatar-features--in-an-avatar-pair',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonAvatar.InAnAvatarPair.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('SkeletonAvatar - Size', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonavatar-features--size',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonAvatar.Size.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonAvatar - Size Responsive', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonavatar-features--size-responsive',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonAvatar.SizeResponsive.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('SkeletonAvatar - Square', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonavatar-features--square',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonAvatar.Square.${theme}.png`)
        })
      })
    }
  })

  //
  // SkeletonBox
  //
  test.describe('SkeletonBox - Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonbox--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonBox.Default.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonBox - Height', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonbox-features--custom-height',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonBox.Height.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonBox - Width', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletonbox-features--custom-width',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonBox.Width.${theme}.png`)
        })
      })
    }
  })

  //
  // SkeletonText
  //
  test.describe('SkeletonText - Default', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext--default',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonText.Default.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonText - Body Large', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--body-large',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonText.BodyLarge.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonText - Body Medium', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--body-medium',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonText.BodyMedium.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('SkeletonText - Body Small', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--body-small',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonText.BodySmall.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonText - Display', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--display',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonText.Display.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonText - Subtitle', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--subtitle',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(`SkeletonText.Subtitle.${theme}.png`)
        })
      })
    }
  })

  test.describe('SkeletonText - Title Large', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--title-large',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonText.TitleLarge.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('SkeletonText - Title Medium', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--title-medium',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonText.TitleMedium.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('SkeletonText - Title Small', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--title-small',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonText.TitleSmall.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('SkeletonText - With Max Width', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--with-max-width',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonText.WithMaxWidth.${theme}.png`,
          )
        })
      })
    }
  })

  test.describe('SkeletonText - With Multiple Lines', () => {
    for (const theme of themes) {
      test.describe(theme, () => {
        test('default @vrt', async ({page}) => {
          await visit(page, {
            id: 'experimental-components-skeleton-skeletontext-features--with-multiple-lines',
            globals: {
              colorScheme: theme,
            },
          })

          // Default state
          expect(await page.screenshot({animations: 'disabled'})).toMatchSnapshot(
            `SkeletonText.WithMultipleLines.${theme}.png`,
          )
        })
      })
    }
  })
})
