import {expect, test} from '@playwright/test'
import {expectTargetHitSquare} from '../test-helpers/expectTargetHitSquare'
import {visit} from '../test-helpers/storybook'

test('icon buttons and links retain their target size with smaller root text @aat', async ({page}) => {
  await visit(page, {id: 'react-tailwind-components-iconlinkbutton-features--size-variants'})
  const sizes = [
    ['small', 7],
    ['medium', 8],
    ['large', 10],
  ] as const

  for (const rootSize of [8, 12, 16, 20]) {
    await page.evaluate(value => {
      document.documentElement.style.fontSize = `${value}px`
    }, rootSize)
    for (const [size, units] of sizes) {
      for (const [role, name] of [
        ['button', `${size} action`],
        ['link', `${size} navigation`],
      ] as const) {
        const target = page.getByRole(role, {name, exact: true})
        const bounds = await target.boundingBox()
        if (!bounds) throw new Error('Expected the icon control to have bounds')
        const expectedSize = Math.max(28, (units * rootSize) / 4)
        expect(bounds.width).toBeCloseTo(expectedSize, 1)
        expect(bounds.height).toBeCloseTo(expectedSize, 1)
        await expectTargetHitSquare(target)
      }
    }
  }

  await page.evaluate(() => {
    document.documentElement.style.setProperty('--base-size-4', '6px')
  })
  for (const [size, units] of sizes) {
    for (const [role, name] of [
      ['button', `${size} action`],
      ['link', `${size} navigation`],
    ] as const) {
      const bounds = await page.getByRole(role, {name, exact: true}).boundingBox()
      if (!bounds) throw new Error('Expected the icon control to have bounds')
      expect(bounds.width).toBeCloseTo(units * 6, 1)
      expect(bounds.height).toBeCloseTo(units * 6, 1)
    }
  }

  await page.evaluate(() => {
    document.documentElement.style.removeProperty('--base-size-4')
    document.documentElement.style.fontSize = '16px'
  })
  for (const [role, suffix] of [
    ['button', 'action'],
    ['link', 'navigation'],
  ] as const) {
    const customSize = page.getByRole(role, {name: `Custom size ${suffix}`, exact: true})
    const customDimensions = page.getByRole(role, {name: `Custom dimensions ${suffix}`, exact: true})
    const sizeBounds = await customSize.boundingBox()
    const dimensionBounds = await customDimensions.boundingBox()
    if (!sizeBounds || !dimensionBounds) throw new Error('Expected the custom icon controls to have bounds')
    expect(sizeBounds.width).toBeCloseTo(40, 1)
    expect(sizeBounds.height).toBeCloseTo(40, 1)
    expect(dimensionBounds.width).toBeCloseTo(48, 1)
    expect(dimensionBounds.height).toBeCloseTo(40, 1)
    await customSize.focus()
    await expect(customSize).toBeFocused()
  }
})
