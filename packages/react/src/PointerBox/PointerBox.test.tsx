import {PointerBox} from '..'
import {render, behavesAsComponent, checkExports, renderStyles} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('PointerBox', () => {
  behavesAsComponent({Component: PointerBox})

  checkExports('PointerBox', {
    default: PointerBox,
  })

  it('renders a <Caret> in <Box> with relative positioning', () => {
    const {container} = HTMLRender(render(<PointerBox />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<PointerBox />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('applies the border color via "borderColor" prop for backwards compatibility', () => {
    const {container} = HTMLRender(render(<PointerBox borderColor="danger.emphasis" />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies the border color via sx prop', () => {
    const {container} = HTMLRender(render(<PointerBox sx={{borderColor: 'danger.emphasis'}} />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies the background color via "bg" prop for backwards compatibility', () => {
    const {container} = HTMLRender(render(<PointerBox bg="danger.emphasis" />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies the background color via sx prop', () => {
    const {container} = HTMLRender(render(<PointerBox sx={{bg: 'danger.emphasis'}} />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('ensures that background-color set via bg prop and sx output the same for backwards compatibility', () => {
    const mockBg = 'red'
    const viaStyledSystem = renderStyles(<PointerBox bg={mockBg} />)
    const viaSxProp = renderStyles(<PointerBox sx={{bg: mockBg}} />)
    expect(viaStyledSystem).toEqual(
      expect.objectContaining({
        'background-image':
          'linear-gradient(var(--custom-bg),var(--custom-bg)),linear-gradient(var(--bgColor-default,var(--color-canvas-default,#ffffff)),var(--bgColor-default,var(--color-canvas-default,#ffffff)))',
      }),
    )
    expect(viaSxProp).toEqual(
      expect.objectContaining({
        'background-image':
          'linear-gradient(var(--custom-bg),var(--custom-bg)),linear-gradient(var(--bgColor-default,var(--color-canvas-default,#ffffff)),var(--bgColor-default,var(--color-canvas-default,#ffffff)))',
      }),
    )
  })
})
