import {expect, test} from '@playwright/test'
import {buildReactTailwindFixture} from '../test-helpers/react-tailwind-fixture'

let fixtureScript: string

test.beforeAll(async () => {
  fixtureScript = await buildReactTailwindFixture('script/relative-time-browser.tsx')
})

test('default one-hour threshold and elapsed timers update at their boundaries', async ({page}) => {
  await page.clock.install({time: new Date('2026-03-01T12:59:50.000Z')})
  await page.goto('about:blank?id=relative-time')
  await page.evaluate(() => {
    document.documentElement.lang = 'en'
    const root = document.createElement('main')
    root.id = 'root'
    document.body.append(root)
  })
  await page.clock.pauseAt(new Date('2026-03-01T12:59:59.000Z'))
  await page.addScriptTag({content: fixtureScript})

  const expected = await page.evaluate(() => {
    const date = new Date('2026-03-01T12:00:00.000Z')
    const unit = (value: number, name: string) =>
      new Intl.NumberFormat(undefined, {style: 'unit', unit: name, unitDisplay: 'narrow'}).format(value)
    const list = (...parts: string[]) => new Intl.ListFormat(undefined, {type: 'unit', style: 'narrow'}).format(parts)
    return {
      relative: new Intl.RelativeTimeFormat(undefined, {numeric: 'auto', style: 'long'}).format(-1, 'hour'),
      absolute: `on ${new Intl.DateTimeFormat(undefined, {month: 'short', day: 'numeric'}).format(date)}`,
      turnBefore: list(unit(59, 'minute'), unit(59, 'second')),
      turnBoundary: list(unit(1, 'hour')),
      turnAfter: list(unit(1, 'hour'), unit(1, 'second')),
      toolBefore: list(unit(59, 'second')),
      toolBoundary: list(unit(1, 'minute')),
      toolAfter: list(unit(1, 'minute'), unit(1, 'second')),
    }
  })
  const workflowTime = page.getByTestId('workflow-time')
  const turnTimer = page.getByRole('timer', {name: 'Time elapsed in this turn'})
  const toolTimer = page.getByRole('timer', {name: 'Tool duration'})
  await expect(workflowTime).toHaveText(expected.relative)
  await expect(turnTimer).toHaveAttribute('aria-live', 'off')
  await expect(toolTimer).toHaveAttribute('aria-live', 'off')
  await expect(turnTimer).toHaveText(expected.turnBefore)
  await expect(toolTimer).toHaveText(expected.toolBefore)

  await page.clock.runFor(999)
  await expect(workflowTime).toHaveText(expected.relative)
  await page.clock.runFor(1)
  expect(
    await page.evaluate(() => ({
      at: document.body.getAttribute('data-workflow-update-time'),
      text: document.body.getAttribute('data-workflow-update-text'),
    })),
  ).toEqual({at: String(new Date('2026-03-01T13:00:00.000Z').getTime()), text: expected.absolute})
  await expect(workflowTime).toHaveText(expected.absolute)
  await expect(turnTimer).toHaveText(expected.turnBoundary)
  await expect(toolTimer).toHaveText(expected.toolBoundary)
  await page.clock.runFor(1_000)
  await expect(workflowTime).toHaveText(expected.absolute)
  await expect(turnTimer).toHaveText(expected.turnAfter)
  await expect(toolTimer).toHaveText(expected.toolAfter)

  await page.getByRole('button', {name: 'Complete'}).click()
  await page.clock.runFor(5_000)
  await expect(turnTimer).toHaveText('Completed duration')
  await expect(toolTimer).toHaveText('Completed duration')
})

for (const direction of ['past', 'future'] as const) {
  test(`default threshold updates at the ${direction} 30-day rollover`, async ({page}) => {
    const now = new Date(direction === 'past' ? '2026-04-01T11:59:59.750Z' : '2026-03-02T12:00:00.000Z')
    const delay = direction === 'past' ? 250 : 1
    await page.clock.install({time: new Date(now.getTime() - 10_000)})
    await page.goto(`about:blank?month=${direction}`)
    await page.evaluate(() => {
      document.documentElement.lang = 'en'
      const root = document.createElement('main')
      root.id = 'root'
      document.body.append(root)
    })
    await page.clock.pauseAt(now)
    await page.addScriptTag({content: fixtureScript})

    const expected = await page.evaluate(currentDirection => {
      const date = new Date(currentDirection === 'past' ? '2026-03-02T12:00:00.000Z' : '2026-04-01T12:00:00.000Z')
      return {
        absolute: `on ${new Intl.DateTimeFormat(undefined, {month: 'short', day: 'numeric'}).format(date)}`,
        relative: new Intl.RelativeTimeFormat(undefined, {numeric: 'auto', style: 'long'}).format(
          currentDirection === 'past' ? -1 : 1,
          'month',
        ),
      }
    }, direction)
    const time = page.getByTestId('month-time')
    await expect(time).toHaveText(direction === 'past' ? expected.relative : expected.absolute)
    await page.clock.runFor(delay - 1)
    await expect(time).toHaveText(direction === 'past' ? expected.relative : expected.absolute)
    await page.clock.runFor(1)
    const next = direction === 'past' ? expected.absolute : expected.relative
    expect(
      await page.evaluate(() => ({
        at: document.body.getAttribute('data-month-update-time'),
        text: document.body.getAttribute('data-month-update-text'),
      })),
    ).toEqual({at: String(now.getTime() + delay), text: next})
    await expect(time).toHaveText(next)
  })
}

for (const direction of ['past', 'future'] as const) {
  for (const boundary of [
    {name: 'minute', lower: {value: 1, unit: 'minute'}, upper: {value: 2, unit: 'minute'}},
    {name: 'hour', lower: {value: 54, unit: 'minute'}, upper: {value: 1, unit: 'hour'}},
  ] as const) {
    test(`${direction} relative and micro text update at the rounded ${boundary.name} boundary`, async ({page}) => {
      const now = new Date('2026-03-01T12:00:00.000Z')
      const delay = direction === 'past' ? 250 : 1
      await page.clock.install({time: new Date(now.getTime() - 10_000)})
      await page.goto(`about:blank?rounded=${direction}&boundary=${boundary.name}`)
      await page.evaluate(() => {
        document.documentElement.lang = 'en'
        const root = document.createElement('main')
        root.id = 'root'
        document.body.append(root)
      })
      await page.clock.pauseAt(now)
      await page.addScriptTag({content: fixtureScript})

      const expected = await page.evaluate(
        ({lower, upper, currentDirection}) => {
          const sign = currentDirection === 'past' ? -1 : 1
          const relative = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto', style: 'long'})
          const micro = (value: number, unit: string) =>
            new Intl.NumberFormat(undefined, {style: 'unit', unit, unitDisplay: 'narrow'}).format(value)
          return {
            lower: {
              relative: relative.format(sign * lower.value, lower.unit),
              micro: micro(lower.value, lower.unit),
            },
            upper: {
              relative: relative.format(sign * upper.value, upper.unit),
              micro: micro(upper.value, upper.unit),
            },
          }
        },
        {lower: boundary.lower, upper: boundary.upper, currentDirection: direction},
      )
      const before = direction === 'past' ? expected.lower : expected.upper
      const after = direction === 'past' ? expected.upper : expected.lower
      const relative = page.getByTestId('rounded-relative')
      const micro = page.getByTestId('rounded-micro')
      await expect(relative).toHaveText(before.relative)
      await expect(micro).toHaveText(before.micro)
      await page.clock.runFor(delay - 1)
      await expect(relative).toHaveText(before.relative)
      await expect(micro).toHaveText(before.micro)
      await page.clock.runFor(1)
      await expect(relative).toHaveText(after.relative)
      await expect(micro).toHaveText(after.micro)
      expect(
        await page.evaluate(() => ({
          relativeAt: document.body.getAttribute('data-relative-update-time'),
          relativeText: document.body.getAttribute('data-relative-update-text'),
          microAt: document.body.getAttribute('data-micro-update-time'),
          microText: document.body.getAttribute('data-micro-update-text'),
        })),
      ).toEqual({
        relativeAt: String(now.getTime() + delay),
        relativeText: after.relative,
        microAt: String(now.getTime() + delay),
        microText: after.micro,
      })
    })
  }
}
