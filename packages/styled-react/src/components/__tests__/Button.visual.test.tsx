import {render} from '@testing-library/react'
import {describe, test, expect} from 'vitest'
import {page} from 'vitest/browser'
import {ButtonComponent as Button} from '../Button'
import {themes, updateGlobalTheme} from '../../test-helpers/themes'

describe('Button', () => {
  test.each(themes)('color with sx prop (%s) @vrt', async theme => {
    updateGlobalTheme(theme)

    render(
      <div data-testid="screenshot">
        <Button sx={{color: 'rebeccapurple'}}>Click me</Button>
      </div>,
    )

    await expect(page.getByTestId('screenshot')).toMatchScreenshot()
  })

  test.each(themes)('font size with sx prop (%s) @vrt', async theme => {
    updateGlobalTheme(theme)

    render(
      <div data-testid="screenshot">
        <Button sx={{fontSize: '2rem'}}>Click me</Button>
      </div>,
    )

    await expect(page.getByTestId('screenshot')).toMatchScreenshot()
  })
})
