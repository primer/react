import React from 'react'
import {useChannel, useStorybookState} from 'storybook/manager-api'
import {AddonPanel} from 'storybook/internal/components'
import {styled, useTheme} from 'storybook/theming'
import {ADDON_ID} from './performance-tool'

// ============================================================================
// Channel Events
// ============================================================================

export const PERF_EVENTS = {
  METRICS_UPDATE: `${ADDON_ID}/metrics-update`,
  RESET: `${ADDON_ID}/reset`,
  REQUEST_METRICS: `${ADDON_ID}/request-metrics`,
}

// ============================================================================
// Thresholds (Web Vitals standards)
// ============================================================================

const THRESHOLDS = {
  FPS_GOOD: 55,
  FPS_WARNING: 30,
  FRAME_TIME_TARGET: 16.67,
  FRAME_TIME_WARNING: 32,
  INPUT_LATENCY_GOOD: 16,
  INPUT_LATENCY_WARNING: 50,
  LONG_TASKS_WARNING: 5,
  LONGEST_TASK_WARNING: 100,
  DROPPED_FRAMES_WARNING: 10,
  MEMORY_DELTA_WARNING: 5,
  MEMORY_DELTA_DANGER: 20,
  CLS_GOOD: 0.1,
  CLS_WARNING: 0.25,
  INP_GOOD: 200,
  INP_WARNING: 500,
  REACT_RENDER_GOOD: 8,
  REACT_RENDER_WARNING: 16,
  CASCADE_WARNING: 3,
} as const

// ============================================================================
// Types
// ============================================================================

interface PerformanceMetrics {
  fps: number
  frameTime: number
  maxFrameTime: number
  droppedFrames: number
  inputLatency: number
  maxInputLatency: number
  paintTime: number
  maxPaintTime: number
  longTasks: number
  longestTask: number
  styleWrites: number
  thrashingScore: number
  inputJitter: number
  layoutShiftScore: number
  layoutShiftCount: number
  interactionCount: number
  inpMs: number
  reactMountCount: number
  reactMountDuration: number
  reactRenderCount: number
  reactPostMountUpdateCount: number
  reactPostMountMaxDuration: number
  renderCascades: number
  memoryUsedMB: number | null
  memoryDeltaMB: number | null
  peakMemoryMB: number | null
  domElements: number | null
  fpsHistory: number[]
  frameTimeHistory: number[]
  memoryHistory: number[]
}

const DEFAULT_METRICS: PerformanceMetrics = {
  fps: 0,
  frameTime: 0,
  maxFrameTime: 0,
  droppedFrames: 0,
  inputLatency: 0,
  maxInputLatency: 0,
  paintTime: 0,
  maxPaintTime: 0,
  longTasks: 0,
  longestTask: 0,
  styleWrites: 0,
  thrashingScore: 0,
  inputJitter: 0,
  layoutShiftScore: 0,
  layoutShiftCount: 0,
  interactionCount: 0,
  inpMs: 0,
  reactMountCount: 0,
  reactMountDuration: 0,
  reactRenderCount: 0,
  reactPostMountUpdateCount: 0,
  reactPostMountMaxDuration: 0,
  renderCascades: 0,
  memoryUsedMB: null,
  memoryDeltaMB: null,
  peakMemoryMB: null,
  domElements: null,
  fpsHistory: [],
  frameTimeHistory: [],
  memoryHistory: [],
}

// ============================================================================
// Formatters
// ============================================================================

const formatMs = (value: number): string =>
  new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(value)

const formatMb = (value: number): string =>
  new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(value)

const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value)

// ============================================================================
// Styled Components (using Storybook theming)
// ============================================================================

const PanelWrapper = styled.div(({theme}) => ({
  padding: '16px',
  fontFamily: theme.typography.fonts.mono,
  fontSize: '12px',
  lineHeight: 1.6,
  color: theme.color.defaultText,
  overflow: 'auto',
  height: '100%',
  background: theme.background.content,
}))

const Header = styled.div(({theme}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: `1px solid ${theme.appBorderColor}`,
}))

const Title = styled.h2(({theme}) => ({
  margin: 0,
  fontSize: '14px',
  fontWeight: theme.typography.weight.bold,
  color: theme.color.defaultText,
}))

const ResetButton = styled.button(({theme}) => ({
  padding: '6px 12px',
  fontSize: '11px',
  fontWeight: 500,
  fontFamily: theme.typography.fonts.base,
  background: theme.button.background,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  color: theme.color.defaultText,
  cursor: 'pointer',
  transition: 'background 0.15s ease',
  '&:hover': {
    background: theme.color.medium,
  },
}))

const SectionsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px',
})

const Section = styled.section(({theme}) => ({
  background: theme.background.app,
  borderRadius: theme.appBorderRadius,
  border: `1px solid ${theme.appBorderColor}`,
  overflow: 'hidden',
}))

const SectionHeader = styled.header(({theme}) => ({
  padding: '10px 12px',
  background: theme.barBg,
  borderBottom: `1px solid ${theme.appBorderColor}`,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}))

const SectionTitle = styled.h3(({theme}) => ({
  margin: 0,
  fontSize: '11px',
  fontWeight: theme.typography.weight.bold,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: theme.color.defaultText,
}))

const SectionIcon = styled.span({
  fontSize: '14px',
})

const MetricsList = styled.dl({
  margin: 0,
  padding: '8px 0',
})

const MetricItem = styled.div(({theme}) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: '12px',
  padding: '6px 12px',
  borderBottom: `1px solid ${theme.appBorderColor}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}))

const MetricLabel = styled.dt(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  color: theme.color.mediumdark,
  margin: 0,
}))

const MetricValue = styled.dd(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  fontWeight: theme.typography.weight.bold,
  fontFamily: theme.typography.fonts.mono,
  color: theme.color.defaultText,
  margin: 0,
  textAlign: 'right',
}))

const SecondaryValue = styled.span(({theme}) => ({
  fontSize: '10px',
  fontWeight: 'normal',
  color: theme.color.mediumdark,
}))

const InfoIcon = styled.abbr(({theme}) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '14px',
  height: '14px',
  fontSize: '9px',
  borderRadius: '50%',
  background: theme.color.medium,
  color: theme.color.defaultText,
  textDecoration: 'none',
  cursor: 'help',
  flexShrink: 0,
}))

const StatusBadge = styled.span<{variant: 'success' | 'warning' | 'error' | 'neutral'}>(({theme, variant}) => {
  const colors = {
    success: theme.color.positive,
    warning: theme.color.warning,
    error: theme.color.negative,
    neutral: theme.color.defaultText,
  }
  return {
    color: colors[variant],
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  }
})

const SparklineContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '20px',
})

const EmptyState = styled.div(({theme}) => ({
  padding: '32px',
  textAlign: 'center',
  color: theme.color.mediumdark,
}))

const CodeSnippet = styled.code(({theme}) => ({
  padding: '2px 6px',
  background: theme.color.medium,
  borderRadius: theme.appBorderRadius,
  fontSize: '11px',
  fontFamily: theme.typography.fonts.mono,
}))

// ============================================================================
// Sparkline Component
// ============================================================================

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  goodThreshold?: number
  badThreshold?: number
  higherIsBetter?: boolean
}

function Sparkline({
  data,
  width = 80,
  height = 20,
  goodThreshold,
  badThreshold,
  higherIsBetter = false,
}: SparklineProps) {
  const theme = useTheme()

  if (data.length < 2) {
    return (
      <SparklineContainer>
        <svg width={width} height={height} aria-hidden="true">
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={theme.color.medium}
            strokeWidth={1}
            strokeDasharray="3,3"
          />
        </svg>
      </SparklineContainer>
    )
  }

  const padding = 2
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const getX = (index: number) => padding + (index / (data.length - 1)) * innerWidth
  const getY = (value: number) => padding + innerHeight - ((value - min) / range) * innerHeight

  const pathData = data.map((value, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(value).toFixed(1)}`)

  const currentValue = data[data.length - 1]
  let lineColor = theme.color.secondary

  if (goodThreshold !== undefined) {
    const isGood = higherIsBetter ? currentValue >= goodThreshold : currentValue <= goodThreshold
    const isBad =
      badThreshold !== undefined && (higherIsBetter ? currentValue < badThreshold : currentValue > badThreshold)

    if (isBad) {
      lineColor = theme.color.negative
    } else if (isGood) {
      lineColor = theme.color.positive
    } else {
      lineColor = theme.color.warning
    }
  }

  return (
    <SparklineContainer>
      <svg width={width} height={height} aria-hidden="true">
        {/* Threshold line */}
        {goodThreshold !== undefined && goodThreshold >= min && goodThreshold <= max && (
          <line
            x1={padding}
            y1={getY(goodThreshold)}
            x2={width - padding}
            y2={getY(goodThreshold)}
            stroke={theme.color.medium}
            strokeWidth={1}
            strokeDasharray="2,2"
            opacity={0.5}
          />
        )}
        {/* Data line */}
        <path d={pathData.join(' ')} fill="none" stroke={lineColor} strokeWidth={1.5} strokeLinecap="round" />
        {/* Current value dot */}
        <circle cx={getX(data.length - 1)} cy={getY(currentValue)} r={2.5} fill={lineColor} />
      </svg>
    </SparklineContainer>
  )
}

// ============================================================================
// Helper Functions
// ============================================================================

type StatusVariant = 'success' | 'warning' | 'error' | 'neutral'

function getStatus(value: number, good: number, warning: number, higherIsBetter = false): StatusVariant {
  if (higherIsBetter) {
    if (value >= good) return 'success'
    if (value >= warning) return 'warning'
    return 'error'
  }
  if (value <= good) return 'success'
  if (value <= warning) return 'warning'
  return 'error'
}

function getZeroStatus(value: number): StatusVariant {
  return value === 0 ? 'success' : 'error'
}

// ============================================================================
// Metric Components
// ============================================================================

interface MetricProps {
  label: string
  tooltip?: string
  children: React.ReactNode
}

function Metric({label, tooltip, children}: MetricProps) {
  return (
    <MetricItem>
      <MetricLabel>
        {label}
        {tooltip && <InfoIcon aria-label={tooltip}>?</InfoIcon>}
      </MetricLabel>
      <MetricValue>{children}</MetricValue>
    </MetricItem>
  )
}

// ============================================================================
// Section Components
// ============================================================================

interface SectionProps {
  icon: string
  title: string
  children: React.ReactNode
}

function MetricsSection({icon, title, children}: SectionProps) {
  return (
    <Section>
      <SectionHeader>
        <SectionIcon>{icon}</SectionIcon>
        <SectionTitle>{title}</SectionTitle>
      </SectionHeader>
      <MetricsList>{children}</MetricsList>
    </Section>
  )
}

// ============================================================================
// Frame Timing Section
// ============================================================================

function FrameTimingSection({metrics}: {metrics: PerformanceMetrics}) {
  const fpsStatus = getStatus(metrics.fps, THRESHOLDS.FPS_GOOD, THRESHOLDS.FPS_WARNING, true)
  const droppedStatus =
    metrics.droppedFrames > THRESHOLDS.DROPPED_FRAMES_WARNING
      ? 'error'
      : metrics.droppedFrames > 0
        ? 'warning'
        : 'success'

  return (
    <MetricsSection icon="📊" title="Frame Timing">
      <Metric label="FPS" tooltip="Frames per second. Target: 60fps. Below 30 causes visible stuttering.">
        <Sparkline
          data={metrics.fpsHistory}
          goodThreshold={THRESHOLDS.FPS_GOOD}
          badThreshold={THRESHOLDS.FPS_WARNING}
          higherIsBetter
        />
        <StatusBadge variant={fpsStatus}>{metrics.fps}</StatusBadge>
      </Metric>

      <Metric label="Frame Time" tooltip="Average time per frame. Target: ≤16.67ms for 60fps.">
        <Sparkline
          data={metrics.frameTimeHistory}
          goodThreshold={THRESHOLDS.FRAME_TIME_TARGET}
          badThreshold={THRESHOLDS.FRAME_TIME_WARNING}
        />
        <span>
          {formatMs(metrics.frameTime)}ms
          <SecondaryValue> (max {formatMs(metrics.maxFrameTime)})</SecondaryValue>
        </span>
      </Metric>

      <Metric label="Dropped Frames" tooltip="Frames taking >2× expected time. High count indicates stuttering.">
        <StatusBadge variant={droppedStatus}>
          {metrics.droppedFrames}
          {metrics.droppedFrames === 0 && ' ✓'}
        </StatusBadge>
      </Metric>
    </MetricsSection>
  )
}

// ============================================================================
// Input Responsiveness Section
// ============================================================================

function InputSection({metrics}: {metrics: PerformanceMetrics}) {
  const inputStatus = getStatus(metrics.inputLatency, THRESHOLDS.INPUT_LATENCY_GOOD, THRESHOLDS.INPUT_LATENCY_WARNING)
  const inpStatus = getStatus(metrics.inpMs, THRESHOLDS.INP_GOOD, THRESHOLDS.INP_WARNING)

  return (
    <MetricsSection icon="👆" title="Input Responsiveness">
      <Metric label="Input Latency" tooltip="Time from pointer event to next frame. Target: ≤16ms.">
        <StatusBadge variant={inputStatus}>{formatMs(metrics.inputLatency)}ms</StatusBadge>
        <SecondaryValue>(max {formatMs(metrics.maxInputLatency)})</SecondaryValue>
      </Metric>

      <Metric label="Paint Time" tooltip="Browser rendering time via double-RAF technique.">
        <span>
          {formatMs(metrics.paintTime)}ms
          <SecondaryValue> (max {formatMs(metrics.maxPaintTime)})</SecondaryValue>
        </span>
      </Metric>

      <Metric label="INP" tooltip="Interaction to Next Paint - worst click/key latency. Target: ≤200ms.">
        {metrics.interactionCount > 0 ? (
          <>
            <StatusBadge variant={inpStatus}>{Math.round(metrics.inpMs)}ms</StatusBadge>
            <SecondaryValue>({metrics.interactionCount} interactions)</SecondaryValue>
          </>
        ) : (
          <SecondaryValue>No interactions yet</SecondaryValue>
        )}
      </Metric>
    </MetricsSection>
  )
}

// ============================================================================
// Main Thread Section
// ============================================================================

function MainThreadSection({metrics}: {metrics: PerformanceMetrics}) {
  const longTaskStatus = getStatus(metrics.longTasks, 0, THRESHOLDS.LONG_TASKS_WARNING)
  const thrashingStatus = getZeroStatus(metrics.thrashingScore)
  const jitterStatus = getZeroStatus(metrics.inputJitter)

  return (
    <MetricsSection icon="⏱️" title="Main Thread">
      <Metric label="Long Tasks" tooltip="Tasks blocking main thread >50ms. Target: 0 during interactions.">
        <StatusBadge variant={longTaskStatus}>
          {metrics.longTasks}
          {metrics.longTasks === 0 && ' ✓'}
        </StatusBadge>
        {metrics.longestTask > 0 && <SecondaryValue>(max {Math.round(metrics.longestTask)}ms)</SecondaryValue>}
      </Metric>

      <Metric label="Style Writes" tooltip="Inline style mutations observed via MutationObserver.">
        {metrics.styleWrites}
      </Metric>

      <Metric label="Thrashing" tooltip="Frame blocking >50ms near style writes. Indicates forced synchronous layout.">
        <StatusBadge variant={thrashingStatus}>
          {metrics.thrashingScore === 0 ? 'None ✓' : `${metrics.thrashingScore} stalls`}
        </StatusBadge>
      </Metric>

      <Metric label="Jitter" tooltip="Unexpected latency spikes causing visible hitches during drag.">
        <StatusBadge variant={jitterStatus}>
          {metrics.inputJitter === 0 ? 'None ✓' : `${metrics.inputJitter} hitches`}
        </StatusBadge>
      </Metric>
    </MetricsSection>
  )
}

// ============================================================================
// Layout Stability Section
// ============================================================================

function LayoutSection({metrics}: {metrics: PerformanceMetrics}) {
  const clsStatus = getStatus(metrics.layoutShiftScore, THRESHOLDS.CLS_GOOD, THRESHOLDS.CLS_WARNING)

  return (
    <MetricsSection icon="📐" title="Layout Stability">
      <Metric label="CLS" tooltip="Cumulative Layout Shift. Target: <0.1 good, <0.25 needs work.">
        <StatusBadge variant={clsStatus}>
          {metrics.layoutShiftScore === 0 ? '0 ✓' : metrics.layoutShiftScore.toFixed(3)}
        </StatusBadge>
        {metrics.layoutShiftCount > 0 && <SecondaryValue>({metrics.layoutShiftCount} shifts)</SecondaryValue>}
      </Metric>
    </MetricsSection>
  )
}

// ============================================================================
// React Profiler Section
// ============================================================================

function ReactSection({metrics}: {metrics: PerformanceMetrics}) {
  const updateStatus =
    metrics.reactPostMountUpdateCount === 0
      ? 'success'
      : getStatus(metrics.reactPostMountMaxDuration, THRESHOLDS.REACT_RENDER_GOOD, THRESHOLDS.REACT_RENDER_WARNING)
  const cascadeStatus = getStatus(metrics.renderCascades, 0, THRESHOLDS.CASCADE_WARNING)

  return (
    <MetricsSection icon="⚛️" title="React Profiler">
      <Metric label="Mount" tooltip="Initial render count and total duration.">
        {metrics.reactMountCount > 0 ? (
          <>
            {metrics.reactMountCount}×<SecondaryValue>({formatMs(metrics.reactMountDuration)}ms total)</SecondaryValue>
          </>
        ) : (
          <SecondaryValue style={{fontStyle: 'italic'}}>Awaiting profiler data…</SecondaryValue>
        )}
      </Metric>

      <Metric label="Updates" tooltip="Re-renders after mount. Target: 0 for drag operations.">
        {metrics.reactRenderCount > 0 ? (
          <>
            <StatusBadge variant={updateStatus}>
              {metrics.reactPostMountUpdateCount}
              {metrics.reactPostMountUpdateCount === 0 && ' ✓'}
            </StatusBadge>
            {metrics.reactPostMountUpdateCount > 0 && (
              <SecondaryValue>(max {formatMs(metrics.reactPostMountMaxDuration)}ms)</SecondaryValue>
            )}
          </>
        ) : (
          <SecondaryValue style={{fontStyle: 'italic'}}>Use React profiling build</SecondaryValue>
        )}
      </Metric>

      <Metric label="Cascades" tooltip="Nested updates during commit phase. Often from setState in useLayoutEffect.">
        <StatusBadge variant={cascadeStatus}>
          {metrics.renderCascades}
          {metrics.renderCascades === 0 && ' ✓'}
        </StatusBadge>
      </Metric>
    </MetricsSection>
  )
}

// ============================================================================
// Memory Section
// ============================================================================

function MemorySection({metrics}: {metrics: PerformanceMetrics}) {
  if (metrics.memoryUsedMB === null) {
    return (
      <MetricsSection icon="🧠" title="Memory">
        <Metric label="Heap">
          <SecondaryValue>Not available (Chrome only)</SecondaryValue>
        </Metric>
      </MetricsSection>
    )
  }

  const deltaStatus =
    metrics.memoryDeltaMB === null
      ? 'neutral'
      : metrics.memoryDeltaMB > THRESHOLDS.MEMORY_DELTA_DANGER
        ? 'error'
        : metrics.memoryDeltaMB > THRESHOLDS.MEMORY_DELTA_WARNING
          ? 'warning'
          : 'success'

  const deltaText =
    metrics.memoryDeltaMB === null
      ? ''
      : metrics.memoryDeltaMB > 0.5
        ? `+${formatMb(metrics.memoryDeltaMB)}`
        : metrics.memoryDeltaMB < -0.5
          ? formatMb(metrics.memoryDeltaMB)
          : '±0'

  return (
    <MetricsSection icon="🧠" title="Memory & DOM">
      <Metric label="Heap" tooltip="Current JS heap size. Watch for sustained growth indicating leaks.">
        <Sparkline data={metrics.memoryHistory} />
        <span>
          {formatMb(metrics.memoryUsedMB)}MB
          {deltaText && <StatusBadge variant={deltaStatus}> ({deltaText})</StatusBadge>}
        </span>
      </Metric>

      <Metric label="Peak" tooltip="Highest heap size observed. Large gap from current indicates memory spikes.">
        {metrics.peakMemoryMB !== null ? (
          <>
            {formatMb(metrics.peakMemoryMB)}MB
            {metrics.peakMemoryMB > metrics.memoryUsedMB + 1 && (
              <SecondaryValue style={{color: 'inherit'}}>
                (+{formatMb(metrics.peakMemoryMB - metrics.memoryUsedMB)})
              </SecondaryValue>
            )}
          </>
        ) : (
          '—'
        )}
      </Metric>

      <Metric label="DOM Nodes" tooltip="Total elements in profiled component tree.">
        {metrics.domElements !== null ? formatNumber(metrics.domElements) : '—'}
      </Metric>
    </MetricsSection>
  )
}

// ============================================================================
// Main Panel Component
// ============================================================================

function PanelContent({active}: {active: boolean}) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(DEFAULT_METRICS)
  const [isConnected, setIsConnected] = React.useState(false)
  const state = useStorybookState()

  const emit = useChannel({
    [PERF_EVENTS.METRICS_UPDATE]: (data: PerformanceMetrics) => {
      setMetrics(data)
      setIsConnected(true)
    },
  })

  React.useEffect(() => {
    if (active) {
      emit(PERF_EVENTS.REQUEST_METRICS)
    }
  }, [active, emit, state.storyId])

  const handleReset = React.useCallback(() => {
    emit(PERF_EVENTS.RESET)
    setMetrics(DEFAULT_METRICS)
  }, [emit])

  if (!active) return null

  if (!isConnected) {
    return (
      <EmptyState>
        <p style={{marginBottom: '12px', fontSize: '13px'}}>Performance monitoring not active</p>
        <p style={{fontSize: '11px'}}>
          Add <CodeSnippet>withPerformanceMonitor</CodeSnippet> decorator to enable metrics collection.
        </p>
      </EmptyState>
    )
  }

  return (
    <PanelWrapper>
      <Header>
        <Title>⚡ Performance Monitor</Title>
        <ResetButton type="button" onClick={handleReset}>
          Reset Metrics
        </ResetButton>
      </Header>

      <SectionsGrid>
        <FrameTimingSection metrics={metrics} />
        <InputSection metrics={metrics} />
        <MainThreadSection metrics={metrics} />
        <LayoutSection metrics={metrics} />
        <ReactSection metrics={metrics} />
        <MemorySection metrics={metrics} />
      </SectionsGrid>
    </PanelWrapper>
  )
}

// ============================================================================
// Export
// ============================================================================

interface PerformancePanelProps {
  active: boolean
}

export function PerformancePanel({active}: PerformancePanelProps) {
  return (
    <AddonPanel active={active}>
      <PanelContent active={active} />
    </AddonPanel>
  )
}
