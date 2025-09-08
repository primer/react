import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {PointerBox, ThemeProvider} from '..'
import theme from '../theme'

describe('PointerBox', () => {
  it('applies the border color via "borderColor" prop for backwards compatibility', () => {
    const {container} = render(
      <ThemeProvider theme={theme}>
        <PointerBox borderColor="danger.emphasis" />
      </ThemeProvider>,
    )

    const element = container.firstChild as HTMLElement
    const styles = window.getComputedStyle(element)

    // The borderColor should be applied correctly
    expect(styles.borderColor).toBe('rgb(207, 34, 46)') // danger.emphasis color
  })

  it('applies the border color via sx prop', () => {
    const {container} = render(
      <ThemeProvider theme={theme}>
        <PointerBox sx={{borderColor: 'danger.emphasis'}} />
      </ThemeProvider>,
    )

    const element = container.firstChild as HTMLElement
    const styles = window.getComputedStyle(element)

    // The borderColor should be applied correctly
    expect(styles.borderColor).toBe('rgb(207, 34, 46)') // danger.emphasis color
  })

  it('applies the background color via "bg" prop for backwards compatibility', () => {
    const {container} = render(
      <ThemeProvider theme={theme}>
        <PointerBox bg="danger.emphasis" />
      </ThemeProvider>,
    )

    const element = container.firstChild as HTMLElement
    const styles = window.getComputedStyle(element)

    // The background should include the danger.emphasis color in the gradient
    expect(styles.backgroundImage).toContain('rgb(207, 34, 46)') // danger.emphasis color
  })

  it('applies the background color via sx prop', () => {
    const {container} = render(
      <ThemeProvider theme={theme}>
        <PointerBox sx={{bg: 'danger.emphasis'}} />
      </ThemeProvider>,
    )

    const element = container.firstChild as HTMLElement
    const styles = window.getComputedStyle(element)

    // The background should include the danger.emphasis color in the gradient
    expect(styles.backgroundImage).toContain('rgb(207, 34, 46)') // danger.emphasis color
  })

  it('ensures that background-color set via bg prop and sx output the same for backwards compatibility', () => {
    const mockBg = 'red'
    const {container: containerBg} = render(
      <ThemeProvider theme={theme}>
        <PointerBox bg={mockBg} />
      </ThemeProvider>,
    )
    const {container: containerSx} = render(
      <ThemeProvider theme={theme}>
        <PointerBox sx={{bg: mockBg}} />
      </ThemeProvider>,
    )

    const elementBg = containerBg.firstChild as HTMLElement
    const elementSx = containerSx.firstChild as HTMLElement

    // Both should have the same computed background styles
    const stylesBg = window.getComputedStyle(elementBg)
    const stylesSx = window.getComputedStyle(elementSx)

    expect(stylesBg.backgroundImage).toBe(stylesSx.backgroundImage)
  })
})
