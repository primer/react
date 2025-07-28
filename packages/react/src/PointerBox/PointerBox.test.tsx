import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {PointerBox} from '..'
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
})
