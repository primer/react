import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('UnderlineNav', () => {
  test('Internal Responsive Nav', async ({page}) => {
    await visit(page, {
      id: 'components-underlinenav--internal-responsive-nav'
    })

    // Default state
    expect(await page.screenshot()).toMatchSnapshot()

    await page.setViewportSize({
      width: 640,
      height: 480
    })

    // Resize
    expect(await page.screenshot()).toMatchSnapshot()

    await page.getByRole('button', {name: 'More'}).click()
    expect(await page.screenshot()).toMatchSnapshot()

    await page.getByRole('link', {name: 'Settings 10'}).click()
    expect(await page.screenshot()).toMatchSnapshot()
  })
  test('Hide Icons when there is not enough space to display all list items', async ({page}) => {
    await visit(page, {
      id: 'components-underlinenav--internal-responsive-nav'
    })

    // Default State
    expect(await page.screenshot()).toMatchSnapshot()

    // Resize
    await page.setViewportSize({
      width: 1100,
      height: 480
    })

    // Icons should be hidden
    expect(await page.screenshot()).toMatchSnapshot()
  })
  test('Keep selected item visible', async ({page}) => {
    await visit(page, {
      id: 'components-underlinenav--internal-responsive-nav'
    })

    // Default state
    expect(await page.screenshot()).toMatchSnapshot()
    // Select the second last item on the list
    await page.getByRole('link', {name: 'Settings Settings 10'}).click()

    // State after selecting the second last item
    expect(await page.screenshot()).toMatchSnapshot()

    // Resize
    await page.setViewportSize({
      width: 1100,
      height: 480
    })

    // Current state
    expect(await page.screenshot()).toMatchSnapshot()

    // Resize
    await page.setViewportSize({
      width: 800,
      height: 480
    })

    // Current state
    expect(await page.screenshot()).toMatchSnapshot()

    // Resize
    await page.setViewportSize({
      width: 600,
      height: 480
    })

    // Current state
    expect(await page.screenshot()).toMatchSnapshot()
  })
})

test.describe('UnderlineNav keyboard Navigation', () => {
  test('Arrow Keys & Tab & Enter & Space', async ({page}) => {
    await visit(page, {
      id: 'components-underlinenav--internal-responsive-nav'
    })

    await page.setViewportSize({
      width: 640,
      height: 480
    })

    await page.getByRole('link', {name: 'Code Code'}).click()

    await page.getByRole('link', {name: 'Code Code'}).press('Tab')

    await page.getByRole('link', {name: 'Issues Issues 12K'}).press('Tab')

    await page.getByRole('link', {name: 'Pull Requests Pull Requests 13'}).press('ArrowRight')

    await page.getByRole('link', {name: 'Discussions Discussions 5'}).press('ArrowRight')

    await page.getByRole('button', {name: 'More'}).press('Enter')
    expect(await page.screenshot()).toMatchSnapshot()

    await page.getByRole('button', {name: 'More'}).press('ArrowDown')

    await page.getByRole('link', {name: 'Actions 4'}).press('ArrowDown')

    await page.getByRole('link', {name: 'Projects 9'}).press('ArrowDown')

    await page.getByRole('link', {name: 'Insights 0'}).press('ArrowUp')

    await page.getByRole('link', {name: 'Projects 9'}).press('Enter')

    expect(await page.screenshot()).toMatchSnapshot()

    await page.getByRole('button', {name: 'More'}).press('ArrowLeft')

    await page.getByRole('link', {name: 'Projects Projects 9'}).press('ArrowLeft')

    await page.getByRole('link', {name: 'Pull Requests Pull Requests 13'}).press('Space')
    expect(await page.screenshot()).toMatchSnapshot()
  })
})

test.describe('UnderlineNav Loading Counters', () => {
  test.describe('Wide Screen', () => {
    themes.forEach(theme => {
      test(`${theme} theme @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-underlinenav--counters-loading-state',
          globals: {
            colorScheme: theme
          }
        })
        expect(await page.screenshot()).toMatchSnapshot()
      })
    })
  })
  test.describe('Narrow Screen', () => {
    themes.forEach(theme => {
      test(`${theme} theme @vrt`, async ({page}) => {
        await visit(page, {
          id: 'components-underlinenav--counters-loading-state',
          globals: {
            colorScheme: theme
          }
        })
        await page.setViewportSize({
          width: 640,
          height: 480
        })

        await page.getByRole('button', {name: 'More'}).click()
        expect(await page.screenshot()).toMatchSnapshot()
      })
    })
  })
})
