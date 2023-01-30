import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test.describe('SegmentedControl', () => {
  test.describe('Playground', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol--playground',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('[Example] Associated with a label and caption', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--associated-with-a-label-and-caption',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('[fullWidth: narrow]', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--fullwidth-narrow',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('[fullWidth: regular]', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--fullwidth-regular',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('[variant: narrow] Action menu', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--variant-narrow-action-menu',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('[variant: narrow] Hide labels', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--variant-narrow-hide-labels',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Controlled', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--controlled',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Default', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--default',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Full width', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--fullwidth-all',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('Icon only', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--icon-only',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })

  test.describe('With Icons', () => {
    test('axe @aat', async ({page}) => {
      await visit(page, {
        id: 'components-segmentedcontrol-features--with-icons',
      })
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': {
            enabled: false,
          },
        },
      })
    })
  })
})
