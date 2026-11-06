import {XIcon} from '@primer/octicons-react'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {describe, expect, it} from 'vitest'
import Octicon from '../Octicon'
import {implementsClassName} from '../utils/testing'

describe('Octicon', () => {
  implementsClassName(props => <Octicon icon={XIcon} {...props} />)

  it('should pass along props to the outermost element', () => {
    const {container} = render(<Octicon icon={XIcon} data-testid="test-id" />)
    const octicon = page.getByTestId('test-id').element()
    expect(octicon).toBe(container.firstChild)
    expect(octicon).toHaveAttribute('data-testid', 'test-id')
  })
})
