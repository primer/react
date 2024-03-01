import React from 'react'
import {render, behavesAsComponent} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe} from 'jest-axe'

import MarkdownToolbar from '../MarkdownToolbar'

describe('MarkdownToolbar', () => {
  behavesAsComponent({
    Component: MarkdownToolbar,
    options: {skipAs: true, skipSx: true},
    toRender: () => <MarkdownToolbar />,
  })

  it('renders a <markdown-toolbar>', () => {
    expect(render(<MarkdownToolbar />).type).toEqual('markdown-toolbar')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<MarkdownToolbar>hello</MarkdownToolbar>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
