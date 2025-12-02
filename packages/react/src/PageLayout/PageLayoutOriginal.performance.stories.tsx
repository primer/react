import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from './PageLayoutOriginal'
import {Button} from '../Button'
import Label from '../Label'
import Heading from '../Heading'
import Text from '../Text'
import {Stack} from '../Stack'
import {withPerformancePanel} from './PageLayoutPerformanceStoryGenerator'

const meta: Meta<typeof PageLayout> = {
  title: 'Components/PageLayoutOriginal/Performance Tests',
  component: PageLayout,
  parameters: {
    // These performance only tests can freeze the accessibility scanner in a browser, so disable axe for them
    a11y: {disable: true},
  },
  decorators: [withPerformancePanel('PageLayoutOriginal')],
}

export default meta

type Story = StoryObj<typeof PageLayout>

// ============================================================================
// Story 1: Baseline - Light Content (< 100 elements)
// ============================================================================

export const BaselineLight: Story = {
  name: '1. Light Content - Baseline',
  render: () => {
    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Light Content Baseline</Heading>
        </PageLayout.Header>

        <PageLayout.Content>
          <Stack padding="normal" gap="condensed">
            <Text>Minimal DOM elements to establish baseline.</Text>
            <Text>Should be effortless 60 FPS.</Text>
          </Stack>
        </PageLayout.Content>

        <PageLayout.Pane position="start" resizable>
          <Stack padding="normal" gap="condensed">
            <Text>Drag to test - should be instant.</Text>
          </Stack>
        </PageLayout.Pane>
      </PageLayout>
    )
  },
}

export const MediumContent: Story = {
  name: '2. Medium Content',

  render: function Render() {
    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Medium Content</Heading>
        </PageLayout.Header>
        <PageLayout.Pane widthStorageKey="medium-content" position="start" resizable>
          <Stack padding="normal" gap="condensed">
            <div
              style={{
                padding: '12px',
                background: 'var(--bgColor-canvas-subtle)',
                borderRadius: '6px',
              }}
            >
              <Text weight="semibold">Table:</Text> 100 rows × 6 cols
            </div>
          </Stack>
        </PageLayout.Pane>
        <PageLayout.Content>
          <Stack padding="normal" gap="normal">
            <Heading as="h2">Data Table (100 rows × 6 columns)</Heading>
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
                    {['ID', 'Name', 'Role', 'Status', 'Date', 'Actions'].map((header, i) => (
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
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length: 100}).map((_, rowIndex) => (
                    <tr key={rowIndex} style={{borderBottom: '1px solid var(--borderColor-default)'}}>
                      <td style={{padding: '8px 12px', fontSize: '13px'}}>#{1000 + rowIndex}</td>
                      <td style={{padding: '8px 12px', fontWeight: '500'}}>
                        {['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'][rowIndex % 5]}{' '}
                        {['Smith', 'Jones', 'Davis'][rowIndex % 3]}
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
                      <td style={{padding: '8px 12px'}}>
                        <Stack direction="horizontal" gap="condensed">
                          <Button size="small">Edit</Button>
                          <Button size="small">Delete</Button>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Stack>
        </PageLayout.Content>
      </PageLayout>
    )
  },
}

export const LargeContent: Story = {
  name: '3. Large Content',

  render: () => {
    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Large Content - Large Table</Heading>
        </PageLayout.Header>
        <PageLayout.Pane widthStorageKey="large-content" position="start" resizable>
          <Stack padding="normal" gap="condensed">
            <div
              style={{
                padding: '12px',
                background: 'var(--bgColor-canvas-subtle)',
                borderRadius: '6px',
              }}
            >
              <Text weight="semibold">Table:</Text> 300 rows × 10 cols
            </div>
          </Stack>
        </PageLayout.Pane>
        <PageLayout.Content>
          <Stack padding="normal" gap="normal">
            {/* Large table with complex cells */}
            <Heading as="h2">Data Table (300 rows × 10 columns)</Heading>
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
                        <Stack direction="horizontal" gap="condensed">
                          <Label variant="success" size="small">
                            tag{rowIndex % 10}
                          </Label>
                          <Label variant="attention" size="small">
                            type{rowIndex % 5}
                          </Label>
                        </Stack>
                      </td>
                      <td style={{padding: '8px 12px'}}>
                        <Stack direction="horizontal" gap="condensed">
                          <Button size="small">Edit</Button>
                          <Button size="small">Delete</Button>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Stack>
        </PageLayout.Content>
      </PageLayout>
    )
  },
}

export const ExtraLargeContent: Story = {
  name: '4. Extra Large Content',
  render: () => {
    return (
      <PageLayout padding="none" containerWidth="full">
        <PageLayout.Header>
          <Heading as="h1">Extra Large Content - Multiple Sections</Heading>
        </PageLayout.Header>

        <PageLayout.Pane position="start" resizable>
          <Stack padding="normal" gap="condensed">
            <div
              style={{
                padding: '12px',
                background: 'var(--bgColor-canvas-subtle)',
                borderRadius: '6px',
              }}
            >
              <Text weight="semibold">Mix:</Text> Cards, tables, lists
            </div>
            <Text size="medium" weight="semibold">
              Sections:
            </Text>
            <ul style={{fontSize: '12px', paddingLeft: '20px', margin: 0}}>
              <li>400 activity cards</li>
              <li>350-row table</li>
              <li>400 issue items</li>
              <li>+ Headers, buttons, etc</li>
            </ul>
          </Stack>
        </PageLayout.Pane>

        <PageLayout.Content>
          <div tabIndex={0} style={{padding: '16px', overflowY: 'auto', height: '600px'}}>
            {/* Section 1: Large card grid */}
            <Stack as="section" gap="normal" style={{marginBottom: '32px'}}>
              <Heading as="h2">Activity Feed (400 cards)</Heading>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px'}}>
                {Array.from({length: 400}).map((_, i) => (
                  <Stack
                    key={i}
                    padding="normal"
                    gap="condensed"
                    style={{
                      border: '1px solid var(--borderColor-default)',
                      borderRadius: '6px',
                      background: 'var(--bgColor-default)',
                    }}
                  >
                    <Stack direction="horizontal" justify="space-between">
                      <Text weight="semibold">Activity #{i + 1}</Text>
                      <Text size="small" style={{color: 'var(--fgColor-muted)'}}>
                        {i % 60}m ago
                      </Text>
                    </Stack>
                    <Text size="small" style={{color: 'var(--fgColor-muted)'}}>
                      User {['Alice', 'Bob', 'Charlie'][i % 3]} performed action on item {i}
                    </Text>
                    <Stack direction="horizontal" gap="condensed">
                      <Label variant="success" size="small">
                        {['create', 'update', 'delete'][i % 3]}
                      </Label>
                      <Label variant="accent" size="small">
                        priority-{(i % 3) + 1}
                      </Label>
                    </Stack>
                  </Stack>
                ))}
              </div>
            </Stack>

            {/* Section 2: Large table */}
            <Stack as="section" gap="normal" style={{marginBottom: '32px'}}>
              <Heading as="h2">Data Table (350 rows × 8 columns)</Heading>
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
                  {Array.from({length: 350}).map((_, i) => (
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
            </Stack>

            {/* Section 3: List with nested content */}
            <Stack as="section" gap="condensed">
              <Heading as="h2">Issue Tracker (400 items)</Heading>
              {Array.from({length: 400}).map((_, i) => (
                <Stack
                  key={i}
                  padding="normal"
                  gap="condensed"
                  style={{
                    background: i % 2 === 0 ? 'var(--bgColor-default)' : 'var(--bgColor-canvas-subtle)',
                    borderRadius: '6px',
                    border: '1px solid var(--borderColor-default)',
                  }}
                >
                  <Stack direction="horizontal" justify="space-between" align="center">
                    <Stack direction="horizontal" gap="condensed" align="center">
                      <Text weight="semibold">Issue #{i + 1}</Text>
                      <Label variant={(['success', 'attention', 'severe'] as const)[i % 3]} size="small">
                        {['bug', 'feature', 'enhancement'][i % 3]}
                      </Label>
                    </Stack>
                    <Text size="small" style={{color: 'var(--fgColor-muted)'}}>
                      {i % 10}d ago
                    </Text>
                  </Stack>
                  <Text size="medium">
                    Description for issue {i + 1}: This is some text that describes the issue in detail.
                  </Text>
                  <Text size="small" style={{color: 'var(--fgColor-muted)'}}>
                    <span style={{marginRight: '12px'}}>👤 {['alice', 'bob', 'charlie'][i % 3]}</span>
                    <span style={{marginRight: '12px'}}>💬 {i % 15} comments</span>
                    <span>⭐ {i % 20} reactions</span>
                  </Text>
                </Stack>
              ))}
            </Stack>
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
          <Stack padding="normal" gap="condensed">
            <Text>Max width: {calculatedMaxWidth}px</Text>
          </Stack>
        </PageLayout.Pane>

        <PageLayout.Content>
          <Stack padding="normal" gap="condensed">
            <Heading as="h2">Test responsive max width constraints</Heading>
            <Text>Resize window and watch max pane width update.</Text>
          </Stack>
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
          <Stack padding="normal" gap="condensed">
            <Text>Use keyboard: ← → ↑ ↓</Text>
          </Stack>
        </PageLayout.Pane>

        <PageLayout.Content>
          <Stack padding="normal" gap="normal">
            <Heading as="h2">Test Instructions</Heading>
            <ol>
              <li>Tab to resize handle</li>
              <li>Use arrow keys to resize</li>
              <li>Test with screen reader</li>
            </ol>
            <Stack
              padding="normal"
              gap="normal"
              style={{
                border: '1px solid var(--borderColor-default)',
                borderRadius: '6px',
                background: 'var(--bgColor-canvas-subtle)',
              }}
            >
              <Text>Live ARIA attributes</Text>
              <dl
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'max-content 1fr',
                  gap: '8px 16px',
                  margin: 0,
                }}
              >
                <Text as="dt" weight="semibold">
                  aria-valuemin
                </Text>
                <dd style={{margin: 0}}>{ariaAttributes.valuemin}</dd>
                <Text as="dt" weight="semibold">
                  aria-valuemax
                </Text>
                <dd style={{margin: 0}}>{ariaAttributes.valuemax}</dd>
                <Text as="dt" weight="semibold">
                  aria-valuenow
                </Text>
                <dd style={{margin: 0}}>{ariaAttributes.valuenow}</dd>
                <Text as="dt" weight="semibold">
                  aria-valuetext
                </Text>
                <dd style={{margin: 0}}>{ariaAttributes.valuetext}</dd>
              </dl>
              <Text size="small" style={{color: 'var(--fgColor-muted)'}}>
                Values update live when the slider handle changes size via keyboard or pointer interactions.
              </Text>
            </Stack>
          </Stack>
        </PageLayout.Content>
      </PageLayout>
    )
  },
}
