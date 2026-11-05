/**
 * Tests that run in a real server environment, where there is no `document`.
 * @vitest-environment node
 */
import {describe, expect, it} from 'vitest'
import {renderToString} from 'react-dom/server'
import Portal from '../Portal'
import Breadcrumbs from '../Breadcrumbs'

describe('server rendering', () => {
  it('has no DOM available', () => {
    expect(typeof document).toEqual('undefined')
  })

  it('renders Portal without touching the DOM', () => {
    // React's server renderer throws when it encounters a portal, so `Portal` must
    // render nothing, and must not create its host element, while server rendering.
    expect(renderToString(<Portal>portal content</Portal>)).toEqual('')
  })

  it('renders the Breadcrumbs overflow menu without layout', () => {
    // At most four crumbs are shown, so the server markup is collapsed before hydration.
    const html = renderToString(
      <Breadcrumbs overflow="menu">
        {['a', 'b', 'c', 'd', 'e', 'f'].map(label => (
          <Breadcrumbs.Item key={label} href="#">
            {label}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>,
    )
    expect(html.match(/<a /g)).toHaveLength(4)
    expect(html).toContain('2 more breadcrumb items')
  })
})
