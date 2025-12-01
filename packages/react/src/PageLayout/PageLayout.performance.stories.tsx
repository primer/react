import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageLayout} from './PageLayout'
import {Button} from '../Button'
import Label from '../Label'

const meta: Meta<typeof PageLayout> = {
  title: 'Components/PageLayout/Performance Tests',
  component: PageLayout,
}

export default meta

type Story = StoryObj<typeof PageLayout>

// ============================================================================
// Shared Performance Monitor Hook & Component
// ============================================================================

function usePerformanceMonitor(
  fpsRef: React.RefObject<HTMLSpanElement | null>,
  avgRef: React.RefObject<HTMLSpanElement | null>,
  minRef: React.RefObject<HTMLSpanElement | null>,
  maxRef: React.RefObject<HTMLSpanElement | null>,
  minGoodFps: number,
  minOkFps: number,
) {
  React.useEffect(() => {
    const frameTimes: number[] = []
    let lastFrameTime = 0
    let lastUpdateTime = 0
    let animationFrameId: number

    const measureFPS = (timestamp: number) => {
      if (lastFrameTime) {
        const frameTime = timestamp - lastFrameTime
        frameTimes.push(frameTime)

        if (frameTimes.length > 120) {
          frameTimes.shift()
        }

        // Update DOM directly every 500ms - zero React overhead
        if (timestamp - lastUpdateTime >= 500) {
          const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
          const currentFps = Math.round(1000 / avgFrameTime)
          const maxFrameTime = Math.max(...frameTimes)
          const minFrameTime = Math.min(...frameTimes)

          // Direct DOM updates - no React re-renders
          if (fpsRef.current) {
            fpsRef.current.textContent = isFinite(currentFps) ? String(currentFps) : '—'
            fpsRef.current.style.color =
              currentFps >= minGoodFps
                ? 'var(--fgColor-success)'
                : currentFps >= minOkFps
                  ? 'var(--fgColor-attention)'
                  : 'var(--fgColor-danger)'
          }
          if (avgRef.current) avgRef.current.textContent = isFinite(avgFrameTime) ? `${avgFrameTime.toFixed(2)}ms` : '—'
          if (minRef.current) minRef.current.textContent = isFinite(minFrameTime) ? `${minFrameTime.toFixed(2)}ms` : '—'
          if (maxRef.current) maxRef.current.textContent = isFinite(maxFrameTime) ? `${maxFrameTime.toFixed(2)}ms` : '—'

          lastUpdateTime = timestamp
        }
      }

      lastFrameTime = timestamp
      animationFrameId = requestAnimationFrame(measureFPS)
    }

    animationFrameId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [fpsRef, avgRef, minRef, maxRef, minGoodFps, minOkFps])
}

interface PerformanceHeaderProps {
  title: string
  loadDescription: string
  targetFps: string
  minGoodFps?: number
  minOkFps?: number
}

function PerformanceHeader({
  title,
  loadDescription,
  targetFps,
  minGoodFps = 55,
  minOkFps = 40,
}: PerformanceHeaderProps) {
  const fpsRef = React.useRef<HTMLSpanElement>(null)
  const avgRef = React.useRef<HTMLSpanElement>(null)
  const minRef = React.useRef<HTMLSpanElement>(null)
  const maxRef = React.useRef<HTMLSpanElement>(null)

  usePerformanceMonitor(fpsRef, avgRef, minRef, maxRef, minGoodFps, minOkFps)

  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--bgColor-canvas-subtle)',
        borderRadius: '6px',
      }}
    >
      <h1>{title}</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginTop: '12px',
        }}
      >
        <div>
          <strong>FPS:</strong>{' '}
          <span ref={fpsRef} style={{fontSize: '24px'}}>
            0
          </span>
        </div>
        <div>
          <strong>Avg:</strong> <span ref={avgRef}>0ms</span>
        </div>
        <div>
          <strong>Min:</strong> <span ref={minRef}>0ms</span>
        </div>
        <div>
          <strong>Max:</strong> <span ref={maxRef}>0ms</span>
        </div>
      </div>
      <p style={{marginTop: '12px', fontSize: '14px'}}>
        <strong>Load:</strong> {loadDescription}
        <br />
        <strong>Target:</strong> {targetFps}
      </p>
    </div>
  )
}

// ============================================================================
// Story 0: Empty Baseline - No PageLayout
// ============================================================================

export const EmptyBaseline: Story = {
  name: '0. Empty Baseline - No PageLayout (diagnostic)',
  render: () => {
    const fpsRef = React.useRef<HTMLSpanElement>(null)
    const avgRef = React.useRef<HTMLSpanElement>(null)
    const minRef = React.useRef<HTMLSpanElement>(null)
    const maxRef = React.useRef<HTMLSpanElement>(null)

    usePerformanceMonitor(fpsRef, avgRef, minRef, maxRef, 55, 40)

    return (
      <div
        style={{
          padding: '16px',
          background: 'var(--bgColor-canvas-subtle)',
          borderRadius: '6px',
          maxWidth: '600px',
          margin: '20px',
        }}
      >
        <h1>Diagnostic: Empty Page FPS</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginTop: '12px',
          }}
        >
          <div>
            <strong>FPS:</strong>{' '}
            <span ref={fpsRef} style={{fontSize: '24px'}}>
              0
            </span>
          </div>
          <div>
            <strong>Avg:</strong> <span ref={avgRef}>0ms</span>
          </div>
          <div>
            <strong>Min:</strong> <span ref={minRef}>0ms</span>
          </div>
          <div>
            <strong>Max:</strong> <span ref={maxRef}>0ms</span>
          </div>
        </div>
        <p style={{marginTop: '12px', fontSize: '14px'}}>
          This page has NO PageLayout component - just the FPS monitor.
          <br />
          If this shows 30 FPS, the issue is external (browser throttling, power settings, etc).
          <br />
          If this shows 60 FPS, the issue is in PageLayout.
        </p>
      </div>
    )
  },
}

// ============================================================================
// Story 1: Baseline - Light Content (~100 elements)
// ============================================================================

export const BaselineLight: Story = {
  name: '1. Light Content - Baseline (~100 elements)',
  render: () => {
    return (
      <PageLayout>
        <PageLayout.Header>
          <PerformanceHeader
            title="Performance Test: Light Content"
            loadDescription="Minimal DOM elements (~100 elements)"
            targetFps="60 FPS, ~8-10ms frame time"
          />
        </PageLayout.Header>

        <PageLayout.Content>
          <div style={{padding: '16px'}}>
            <h2>Light Content Baseline</h2>
            <p>Minimal DOM elements to establish baseline.</p>
            <p>Should be effortless 60 FPS.</p>
          </div>
        </PageLayout.Content>

        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <h1>Resizable Pane</h1>
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
      <PageLayout>
        <PageLayout.Header>
          <PerformanceHeader
            title="Performance Test: Medium Load"
            loadDescription="~3,000 DOM elements (300 table rows × 10 columns)"
            targetFps="55-60 FPS during drag"
          />
        </PageLayout.Header>
        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <p>Performance Monitor</p>
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
              <strong>Target:</strong> 55-60 FPS
            </div>
            <p style={{fontSize: '13px'}}>
              This table has enough elements to show performance differences. Drag and watch FPS.
            </p>
          </div>
        </PageLayout.Pane>
        <PageLayout.Content>
          <div style={{padding: '16px'}}>
            {/* Large table with complex cells */}
            <h2 style={{marginBottom: '16px'}}>Data Table (300 rows × 10 columns)</h2>
            <div
              tabIndex={0}
              style={{
                overflow: 'auto',
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
      <PageLayout>
        <PageLayout.Header>
          <PerformanceHeader
            title="Performance Test: Heavy Load"
            loadDescription="~5,000 DOM elements (multiple heavy sections)"
            targetFps="50-60 FPS during drag (stress test)"
            minGoodFps={50}
            minOkFps={30}
          />
        </PageLayout.Header>

        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <h1>Stress Test</h1>
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
              <strong>Target:</strong> 50-60 FPS
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
            <p style={{fontSize: '13px', marginTop: '12px'}}>
              This should show measurable FPS impact. Target is 50-60 FPS.
            </p>
          </div>
        </PageLayout.Pane>

        <PageLayout.Content>
          <div tabIndex={0} style={{padding: '16px', overflow: 'auto', height: '600px'}}>
            {/* Section 1: Large card grid */}
            <div style={{marginBottom: '32px'}}>
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
            </div>

            {/* Section 2: Large table */}
            <div style={{marginBottom: '32px'}}>
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
            </div>

            {/* Section 3: List with nested content */}
            <div>
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
            </div>
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
      <PageLayout>
        <PageLayout.Header>
          <PerformanceHeader
            title="Responsive Constraints Test"
            loadDescription={`Viewport: ${viewportWidth}px | Max Pane: ${calculatedMaxWidth}px`}
            targetFps="Resize window and verify max pane width updates"
            minGoodFps={55}
            minOkFps={40}
          />
        </PageLayout.Header>

        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <h1>Resizable Pane</h1>
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
      <PageLayout>
        <PageLayout.Header>
          <PerformanceHeader
            title="Keyboard & ARIA Test"
            loadDescription="Tab to resize handle, use arrow keys (← → ↑ ↓)"
            targetFps="Test keyboard navigation and screen reader support"
            minGoodFps={55}
            minOkFps={40}
          />
        </PageLayout.Header>

        <PageLayout.Pane position="start" resizable>
          <div style={{padding: '16px'}}>
            <h1>Resizable Pane</h1>
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
              <h1 style={{marginBottom: '12px'}}>Live ARIA attributes</h1>
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
