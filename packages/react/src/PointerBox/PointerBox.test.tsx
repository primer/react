import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {PointerBox, ThemeProvider} from '..'
import theme from '../theme'

describe('PointerBox', () => {
  it('renders a <Caret> in <Box> with relative positioning', () => {
    expect(render(<PointerBox theme={theme} />)).toMatchSnapshot()
  })

  it('applies the border color via "borderColor" prop for backwards compatibility', () => {
    expect(render(<PointerBox borderColor="danger.emphasis" theme={theme} />)).toMatchSnapshot()
  })

  it('applies the border color via sx prop', () => {
    expect(render(<PointerBox sx={{borderColor: 'danger.emphasis'}} theme={theme} />)).toMatchSnapshot()
  })

  it('applies the background color via "bg" prop for backwards compatibility', () => {
    expect(
      render(
        <ThemeProvider theme={theme}>
          <PointerBox bg="danger.emphasis" />
        </ThemeProvider>,
      ),
    ).toMatchSnapshot()
  })

  it('applies the background color via sx prop', () => {
    expect(
      render(
        <ThemeProvider theme={theme}>
          <PointerBox sx={{bg: 'danger.emphasis'}} />
        </ThemeProvider>,
      ),
    ).toMatchSnapshot()
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
