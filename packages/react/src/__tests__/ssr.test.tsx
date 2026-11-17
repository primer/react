/**
 * Tests that run in a real server environment, where there is no `document`.
 * @vitest-environment node
 */
import {describe, expect, it} from 'vitest'
import {renderToString} from 'react-dom/server'
import Portal from '../Portal'
import Breadcrumbs from '../Breadcrumbs'
import {SelectPanel} from '../SelectPanel'

describe('server rendering', () => {
  it('has no DOM available', () => {
    expect(typeof document).toEqual('undefined')
  })

  it('renders Portal without touching the DOM', () => {
    // React's server renderer throws when it encounters a portal, so `Portal` must
    // render nothing, and must not create its host element, while server rendering.
    expect(renderToString(<Portal>portal content</Portal>)).toEqual('')
  })

  it('renders a composed SelectPanel without browser platform APIs', () => {
    const html = renderToString(
      <SelectPanel.Root defaultOpen>
        <SelectPanel.Trigger>Choose fruit</SelectPanel.Trigger>
        <SelectPanel.Overlay>
          <SelectPanel.Content>
            <SelectPanel.Title>Fruit</SelectPanel.Title>
            <SelectPanel.List>
              <SelectPanel.Item value="apple">Apple</SelectPanel.Item>
            </SelectPanel.List>
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    )
    expect(html).toMatch(/<dialog[ >]/)
    expect(html).toContain('Choose fruit')
    expect(html).toContain('Apple')
    expect(html).not.toContain('commandfor=')
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

  it('renders a hidden Breadcrumbs overflow menu for the pre-hydration narrow rule', () => {
    const html = renderToString(
      <Breadcrumbs overflow="menu">
        {['a', 'b', 'c'].map(label => (
          <Breadcrumbs.Item key={label} href="#">
            {label}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>,
    )
    expect(html).toMatch(/<li[^>]*data-overflow-menu=""[^>]*hidden=""/)
    expect(html).toContain('data-narrow-collapse')
    expect(html).not.toContain('data-hydrated')
  })
})
