import {expect, type Locator} from '@playwright/test'

export async function expectTargetHitSquare(target: Locator) {
  await target.scrollIntoViewIfNeeded()
  const misses = await target.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const offsets = [-11.99, 0, 11.99]
    return offsets.flatMap(x =>
      offsets.flatMap(y => {
        const hit = element.ownerDocument.elementFromPoint(
          bounds.x + bounds.width / 2 + x,
          bounds.y + bounds.height / 2 + y,
        )
        return hit && element.contains(hit) ? [] : [{x, y, hit: hit?.tagName ?? null}]
      }),
    )
  })
  expect(misses, 'Expected pointer hits within the centered 24px square').toEqual([])
}
