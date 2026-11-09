import {expect, test} from '@playwright/test'
import {visit} from '../test-helpers/storybook'

test('preferred absolute text follows midnight in the selected time zone', async ({page}) => {
  const before = new Date('2024-06-02T18:14:59.999Z')
  await page.clock.install({time: new Date(before.getTime() - 30_000)})
  await visit(page, {id: 'react-tailwind-content-relativetime-features--preferred-absolute-midnight'})
  await page.clock.pauseAt(before)
  const time = page.locator('time[data-component="RelativeTime"]')
  await expect(time).toHaveText(/^Today /)
  await page.clock.runFor(1)
  const expected = await page.evaluate(() =>
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kathmandu',
      timeZoneName: 'short',
      hourCycle: 'h23',
    }).format(new Date('2024-06-02T17:00:00.000Z')),
  )
  await expect(time).toHaveText(expected)
})

test('preferred absolute text updates when a future date enters the current year', async ({page}) => {
  const before = new Date('2024-12-31T23:59:59.999Z')
  await page.clock.install({time: new Date(before.getTime() - 30_000)})
  await visit(page, {id: 'react-tailwind-content-relativetime-features--preferred-absolute-year'})
  await page.clock.pauseAt(before)
  const time = page.locator('time[data-component="RelativeTime"]')
  await expect(time).toContainText('2025')
  await page.clock.runFor(1)
  const expected = await page.evaluate(() =>
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
      hourCycle: 'h23',
    }).format(new Date('2025-03-02T09:05:00.000Z')),
  )
  await expect(time).toHaveText(expected)
})

test('preferred absolute text follows a daylight-saving rollback across midnight', async ({page}) => {
  const before = new Date('2009-11-01T02:59:59.999Z')
  await page.clock.install({time: new Date(before.getTime() - 30_000)})
  await visit(page, {id: 'react-tailwind-content-relativetime-features--preferred-absolute-daylight-saving'})
  await page.clock.pauseAt(before)
  const time = page.locator('time[data-component="RelativeTime"]')
  await expect(time).toHaveText(/^Today /)
  await page.clock.runFor(1)
  await expect(time).not.toHaveText(/^Today /)
  await page.clock.runFor(59_999)
  await expect(time).not.toHaveText(/^Today /)
  await page.clock.runFor(1)
  await expect(time).toHaveText(/^Today /)
  await page.clock.runFor(59 * 60_000)
  await expect(time).not.toHaveText(/^Today /)
})

test('preferred absolute text updates when a rollback reenters an earlier year', async ({page}) => {
  const before = new Date('1944-01-01T06:00:59.999Z')
  await page.clock.install({time: new Date(before.getTime() - 30_000)})
  await visit(page, {id: 'react-tailwind-content-relativetime-features--preferred-absolute-year-rollback'})
  await page.clock.pauseAt(before)
  const time = page.locator('time[data-component="RelativeTime"]')
  await expect(time).toContainText('1943')
  await page.clock.runFor(1)
  await expect(time).toHaveText(/^Today /)
  await page.clock.runFor(59 * 60_000)
  await expect(time).toContainText('1943')
})
