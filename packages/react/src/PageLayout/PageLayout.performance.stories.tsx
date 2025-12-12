import React, {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from './PageLayout'
import {Button} from '../Button'
import Label from '../Label'
import Heading from '../Heading'
import Autocomplete from '../Autocomplete'
import FormControl from '../FormControl'

const meta: Meta<typeof PageLayout> = {
  title: 'Components/PageLayout/Performance Tests',
  component: PageLayout,
}

export default meta

type Story = StoryObj<typeof PageLayout>

// Autocomplete suggestions data
const suggestions = [
  {id: '1', text: 'JavaScript'},
  {id: '2', text: 'TypeScript'},
  {id: '3', text: 'React'},
  {id: '4', text: 'Vue'},
  {id: '5', text: 'Angular'},
  {id: '6', text: 'Svelte'},
  {id: '7', text: 'Node.js'},
  {id: '8', text: 'Python'},
  {id: '9', text: 'Ruby'},
  {id: '10', text: 'Go'},
]

// Reusable stateful autocomplete search component
function SearchInput() {
  const [filterValue, setFilterValue] = useState('')
  const filteredItems = suggestions.filter(item => item.text.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <FormControl>
      <FormControl.Label>Search</FormControl.Label>
      <Autocomplete>
        <Autocomplete.Input
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
          placeholder="Search items..."
        />
        <Autocomplete.Overlay>
          <Autocomplete.Menu
            items={filteredItems}
            selectedItemIds={[]}
            aria-labelledby="autocomplete-label"
            selectionVariant="single"
          />
        </Autocomplete.Overlay>
      </Autocomplete>
    </FormControl>
  )
}

// ============================================================================
// Story 1: Baseline - Light Content (~100 elements)
// ============================================================================

export const BaselineLight: Story = {
  name: '1. Light Content - Baseline (~100 elements)',
  render: () => {
    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Light Content Baseline</Heading>
        </PageLayout.Header>

        <PageLayout.Content>
          <div style={{padding: '16px'}}>
            <SearchInput />
            <p style={{marginTop: '16px'}}>Minimal DOM elements to establish baseline.</p>
            <p>Should be effortless 60 FPS.</p>
          </div>
        </PageLayout.Content>

        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <p>Drag to test - should be instant.</p>
          </div>
        </PageLayout.Pane>
      </PageLayout>
    )
  },
}

// ============================================================================
// Story 2: Medium Content - Virtualized Table (~3000 elements)
// ============================================================================

export const MediumContent: Story = {
  name: '2. Medium Content - Large Table (~3000 elements)',
  render: () => {
    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Medium Content - Large Table</Heading>
        </PageLayout.Header>
        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <div
              style={{
                padding: '12px',
                background: 'var(--bgColor-canvas-subtle)',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              <strong>DOM Load:</strong> ~3,000 elements
              <br />
              <strong>Table:</strong> 300 rows × 10 cols
              <br />
            </div>
          </div>
        </PageLayout.Pane>
        <PageLayout.Content>
          <div style={{padding: '16px'}}>
            <SearchInput />
            {/* Large table with complex cells */}
            <h2 style={{marginTop: '16px', marginBottom: '16px'}}>Data Table (300 rows × 10 columns)</h2>
            <div
              tabIndex={0}
              style={{
                overflowY: 'auto',
                height: '600px',
                border: '1px solid var(--borderColor-default)',
              }}
            >
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead style={{position: 'sticky', top: 0, background: 'var(--bgColor-default)', zIndex: 1}}>
                  <tr style={{background: 'var(--bgColor-canvas-subtle)'}}>
                    {['ID', 'Name', 'Email', 'Role', 'Status', 'Date', 'Count', 'Value', 'Tags', 'Actions'].map(
                      (header, i) => (
                        <th
                          key={i}
                          style={{
                            padding: '8px 12px',
                            textAlign: 'left',
                            borderBottom: '2px solid var(--borderColor-default)',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {header}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length: 300}).map((_, rowIndex) => (
                    <tr key={rowIndex} style={{borderBottom: '1px solid var(--borderColor-default)'}}>
                      <td style={{padding: '8px 12px', fontSize: '13px'}}>#{10000 + rowIndex}</td>
                      <td style={{padding: '8px 12px', fontWeight: '500'}}>
                        {['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'][rowIndex % 5]}{' '}
                        {['Smith', 'Jones', 'Davis'][rowIndex % 3]}
                      </td>
                      <td style={{padding: '8px 12px', fontSize: '12px', color: 'var(--fgColor-muted)'}}>
                        user{rowIndex}@example.com
                      </td>
                      <td style={{padding: '8px 12px', fontSize: '13px'}}>
                        {['Admin', 'Editor', 'Viewer', 'Manager'][rowIndex % 4]}
                      </td>
                      <td style={{padding: '8px 12px'}}>
                        <Label
                          variant={rowIndex % 3 === 0 ? 'success' : rowIndex % 2 === 0 ? 'attention' : 'danger'}
                          size="small"
                        >
                          {rowIndex % 3 === 0 ? 'Active' : rowIndex % 2 === 0 ? 'Pending' : 'Inactive'}
                        </Label>
                      </td>
                      <td style={{padding: '8px 12px', fontSize: '12px', color: 'var(--fgColor-muted)'}}>
                        2024-{String((rowIndex % 12) + 1).padStart(2, '0')}-
                        {String((rowIndex % 28) + 1).padStart(2, '0')}
                      </td>
                      <td style={{padding: '8px 12px', fontSize: '13px', textAlign: 'right'}}>
                        {(rowIndex * 17) % 1000}
                      </td>
                      <td style={{padding: '8px 12px', fontWeight: '500', textAlign: 'right'}}>
                        ${((rowIndex * 123.45) % 10000).toFixed(2)}
                      </td>
                      <td style={{padding: '8px 12px', fontSize: '11px'}}>
                        <Label variant="success" size="small" style={{marginRight: '4px'}}>
                          tag{rowIndex % 10}
                        </Label>
                        <Label variant="attention" size="small">
                          type{rowIndex % 5}
                        </Label>
                      </td>
                      <td style={{padding: '8px 12px'}}>
                        <Button size="small" style={{marginRight: '4px'}}>
                          Edit
                        </Button>
                        <Button size="small">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PageLayout.Content>
      </PageLayout>
    )
  },
}

// ============================================================================
// Story 3: Heavy Content - Multiple Sections (~5000 elements)
// ============================================================================

export const HeavyContent: Story = {
  name: '3. Heavy Content - Multiple Sections (~5000 elements)',
  render: () => {
    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Heavy Content - Multiple Sections (~5000 elements)</Heading>
        </PageLayout.Header>

        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <div
              style={{
                padding: '12px',
                background: 'var(--bgColor-canvas-subtle)',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              <strong>DOM Load:</strong> ~5,000 elements
              <br />
              <strong>Mix:</strong> Cards, tables, lists
              <br />
            </div>
            <p style={{fontSize: '13px'}}>
              <strong>Sections:</strong>
            </p>
            <ul style={{fontSize: '12px', paddingLeft: '20px'}}>
              <li>200 activity cards (~1000 elem)</li>
              <li>150-row table (~1200 elem)</li>
              <li>200 issue items (~1200 elem)</li>
              <li>+ Headers, buttons, etc</li>
            </ul>
          </div>
        </PageLayout.Pane>

        <PageLayout.Content>
          <div tabIndex={0} style={{padding: '16px', overflowY: 'auto', height: '600px'}}>
            <SearchInput />
            {/* Section 1: Large card grid */}
            <section style={{marginTop: '16px', marginBottom: '32px'}}>
              <h2 style={{marginBottom: '16px'}}>Activity Feed (200 cards)</h2>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px'}}>
                {Array.from({length: 200}).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px',
                      border: '1px solid var(--borderColor-default)',
                      borderRadius: '6px',
                      background: 'var(--bgColor-default)',
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span style={{fontWeight: '600', fontSize: '14px'}}>Activity #{i + 1}</span>
                      <span style={{fontSize: '11px', color: 'var(--fgColor-muted)'}}>{i % 60}m ago</span>
                    </div>
                    <div style={{fontSize: '12px', color: 'var(--fgColor-muted)', marginBottom: '8px'}}>
                      User {['Alice', 'Bob', 'Charlie'][i % 3]} performed action on item {i}
                    </div>
                    <div style={{display: 'flex', gap: '4px'}}>
                      <Label variant="success" size="small">
                        {['create', 'update', 'delete'][i % 3]}
                      </Label>
                      <Label variant="accent" size="small">
                        priority-{(i % 3) + 1}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Large table */}
            <section style={{marginBottom: '32px'}}>
              <h2 style={{marginBottom: '16px'}}>Data Table (150 rows × 8 columns)</h2>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead style={{position: 'sticky', top: 0, background: 'var(--bgColor-default)'}}>
                  <tr style={{background: 'var(--bgColor-canvas-subtle)'}}>
                    {['ID', 'Name', 'Type', 'Status', 'Date', 'Value', 'Priority', 'Owner'].map((header, i) => (
                      <th
                        key={i}
                        style={{
                          padding: '8px 12px',
                          textAlign: 'left',
                          borderBottom: '2px solid var(--borderColor-default)',
                          fontWeight: '600',
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length: 150}).map((_, i) => (
                    <tr key={i} style={{borderBottom: '1px solid var(--borderColor-default)'}}>
                      <td style={{padding: '8px 12px', fontSize: '12px'}}>#{5000 + i}</td>
                      <td style={{padding: '8px 12px', fontSize: '13px'}}>Item {i + 1}</td>
                      <td style={{padding: '8px 12px', fontSize: '12px'}}>
                        {['Type A', 'Type B', 'Type C', 'Type D'][i % 4]}
                      </td>
                      <td style={{padding: '8px 12px'}}>
                        <Label variant={i % 2 === 0 ? 'success' : 'attention'} size="small">
                          {i % 2 === 0 ? 'Done' : 'In Progress'}
                        </Label>
                      </td>
                      <td style={{padding: '8px 12px', fontSize: '12px', color: 'var(--fgColor-muted)'}}>
                        Dec {(i % 30) + 1}
                      </td>
                      <td style={{padding: '8px 12px', fontWeight: '500'}}>${(i * 50 + 100).toFixed(2)}</td>
                      <td style={{padding: '8px 12px', fontSize: '12px'}}>{['Low', 'Medium', 'High'][i % 3]}</td>
                      <td style={{padding: '8px 12px', fontSize: '12px'}}>user{i % 20}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Section 3: List with nested content */}
            <section>
              <h2 style={{marginBottom: '16px'}}>Issue Tracker (200 items)</h2>
              {Array.from({length: 200}).map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    background: i % 2 === 0 ? 'var(--bgColor-default)' : 'var(--bgColor-canvas-subtle)',
                    borderRadius: '6px',
                    border: '1px solid var(--borderColor-default)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <div>
                      <span style={{fontWeight: '600', marginRight: '8px'}}>Issue #{i + 1}</span>
                      <Label variant={(['success', 'attention', 'severe'] as const)[i % 3]} size="small">
                        {['bug', 'feature', 'enhancement'][i % 3]}
                      </Label>
                    </div>
                    <span style={{fontSize: '11px', color: 'var(--fgColor-muted)'}}>{i % 10}d ago</span>
                  </div>
                  <div style={{fontSize: '13px', marginBottom: '6px'}}>
                    Description for issue {i + 1}: This is some text that describes the issue in detail.
                  </div>
                  <div style={{fontSize: '11px', color: 'var(--fgColor-muted)'}}>
                    <span style={{marginRight: '12px'}}>👤 {['alice', 'bob', 'charlie'][i % 3]}</span>
                    <span style={{marginRight: '12px'}}>💬 {i % 15} comments</span>
                    <span>⭐ {i % 20} reactions</span>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </PageLayout.Content>
      </PageLayout>
    )
  },
}

export const ResponsiveConstraintsTest: Story = {
  render: () => {
    const [viewportWidth, setViewportWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1280)

    React.useEffect(() => {
      const handleResize = () => setViewportWidth(window.innerWidth)
      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    const maxWidthDiff = viewportWidth >= 1280 ? 959 : 511
    const calculatedMaxWidth = Math.max(256, viewportWidth - maxWidthDiff)

    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Responsive Constraints Test</Heading>
        </PageLayout.Header>

        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <p>Max width: {calculatedMaxWidth}px</p>
          </div>
        </PageLayout.Pane>

        <PageLayout.Content>
          <div style={{padding: '16px'}}>
            <h2>Test responsive max width constraints</h2>
            <p>Resize window and watch max pane width update.</p>
          </div>
        </PageLayout.Content>
      </PageLayout>
    )
  },
}

export const KeyboardARIATest: Story = {
  name: 'Keyboard & ARIA Test',
  render: () => {
    const [ariaAttributes, setAriaAttributes] = React.useState({
      valuemin: '—',
      valuemax: '—',
      valuenow: '—',
      valuetext: '—',
    })

    React.useEffect(() => {
      if (typeof window === 'undefined') {
        return undefined
      }

      const ATTRIBUTE_NAMES = ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'] as const
      const attributeFilter = ATTRIBUTE_NAMES.map(attribute => attribute)
      let handleElement: HTMLElement | null = null
      const mutationObserver = new MutationObserver(() => {
        if (!handleElement) return
        setAriaAttributes({
          valuemin: handleElement.getAttribute('aria-valuemin') ?? '—',
          valuemax: handleElement.getAttribute('aria-valuemax') ?? '—',
          valuenow: handleElement.getAttribute('aria-valuenow') ?? '—',
          valuetext: handleElement.getAttribute('aria-valuetext') ?? '—',
        })
      })

      const attachObserver = () => {
        handleElement = document.querySelector<HTMLElement>("[role='slider'][aria-label='Draggable pane splitter']")
        if (!handleElement) return false

        mutationObserver.observe(handleElement, {
          attributes: true,
          attributeFilter,
        })

        setAriaAttributes({
          valuemin: handleElement.getAttribute('aria-valuemin') ?? '—',
          valuemax: handleElement.getAttribute('aria-valuemax') ?? '—',
          valuenow: handleElement.getAttribute('aria-valuenow') ?? '—',
          valuetext: handleElement.getAttribute('aria-valuetext') ?? '—',
        })

        return true
      }

      const retryInterval = window.setInterval(() => {
        if (attachObserver()) {
          window.clearInterval(retryInterval)
        }
      }, 100)

      return () => {
        window.clearInterval(retryInterval)
        mutationObserver.disconnect()
      }
    }, [])

    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Keyboard & ARIA Test</Heading>
        </PageLayout.Header>

        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <p>Use keyboard: ← → ↑ ↓</p>
          </div>
        </PageLayout.Pane>

        <PageLayout.Content>
          <div style={{padding: '16px'}}>
            <h2>Test Instructions</h2>
            <ol>
              <li>Tab to resize handle</li>
              <li>Use arrow keys to resize</li>
              <li>Test with screen reader</li>
            </ol>
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                border: '1px solid var(--borderColor-default)',
                borderRadius: '6px',
                background: 'var(--bgColor-canvas-subtle)',
              }}
            >
              <p style={{marginBottom: '12px'}}>Live ARIA attributes</p>
              <dl
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'max-content 1fr',
                  gap: '8px 16px',
                  margin: 0,
                }}
              >
                <dt style={{fontWeight: 600}}>aria-valuemin</dt>
                <dd style={{margin: 0}}>{ariaAttributes.valuemin}</dd>
                <dt style={{fontWeight: 600}}>aria-valuemax</dt>
                <dd style={{margin: 0}}>{ariaAttributes.valuemax}</dd>
                <dt style={{fontWeight: 600}}>aria-valuenow</dt>
                <dd style={{margin: 0}}>{ariaAttributes.valuenow}</dd>
                <dt style={{fontWeight: 600}}>aria-valuetext</dt>
                <dd style={{margin: 0}}>{ariaAttributes.valuetext}</dd>
              </dl>
              <p style={{marginTop: '12px', fontSize: '12px', color: 'var(--fgColor-muted)'}}>
                Values update live when the slider handle changes size via keyboard or pointer interactions.
              </p>
            </div>
          </div>
        </PageLayout.Content>
      </PageLayout>
    )
  },
}
