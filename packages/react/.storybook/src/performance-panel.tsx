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
  // New thresholds
  FORCED_REFLOW_WARNING: 5,
  FORCED_REFLOW_DANGER: 20,
  EVENT_LISTENERS_WARNING: 50,
  EVENT_LISTENERS_DANGER: 100,
  OBSERVERS_WARNING: 10,
  OBSERVERS_DANGER: 25,
  CSS_VAR_CHANGES_WARNING: 50,
  GC_PRESSURE_WARNING: 1, // MB/s
  GC_PRESSURE_DANGER: 5,
  LAYERS_WARNING: 20,
  LAYERS_DANGER: 50,
  // Jank-specific thresholds
  TBT_WARNING: 200, // ms - Total Blocking Time
  TBT_DANGER: 600,
  DOM_MUTATIONS_WARNING: 50, // per sample period
  DOM_MUTATIONS_DANGER: 200,
  SLOW_UPDATES_WARNING: 3,
  SLOW_UPDATES_DANGER: 10,
  REACT_P95_WARNING: 8, // ms
  REACT_P95_DANGER: 16,
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
  // New metrics
  forcedReflowCount: number
  eventListenerCount: number
  observerCount: number
  cssVarChanges: number
  scriptEvalTime: number
  gcPressure: number
  paintCount: number
  compositorLayers: number | null
  // Additional jank metrics
  totalBlockingTime: number
  domMutationsPerFrame: number
  slowReactUpdates: number
  reactP95Duration: number
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
  forcedReflowCount: 0,
  eventListenerCount: 0,
  observerCount: 0,
  cssVarChanges: 0,
  scriptEvalTime: 0,
  gcPressure: 0,
  paintCount: 0,
  compositorLayers: null,
  totalBlockingTime: 0,
  domMutationsPerFrame: 0,
  slowReactUpdates: 0,
  reactP95Duration: 0,
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
  display: 'flex',
  fontFamily: theme.typography.fonts.mono,
  fontSize: '12px',
  lineHeight: 1.6,
  color: theme.color.defaultText,
  height: '100%',
  background: theme.background.content,
}))

const ContentArea = styled.div({
  flex: 1,
  overflow: 'auto',
  padding: '8px',
})

const SideToolbar = styled.div(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 6px',
  borderLeft: `1px solid ${theme.appBorderColor}`,
  background: theme.barBg,
}))

const ResetButton = styled.button(({theme}) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  padding: 0,
  fontSize: '14px',
  fontFamily: theme.typography.fonts.base,
  background: theme.button.background,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  color: theme.color.mediumdark,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: theme.color.medium,
    color: theme.color.defaultText,
  },
}))

const SectionsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '8px',
})

const Section = styled.section(({theme}) => ({
  background: theme.background.app,
  borderRadius: theme.appBorderRadius,
  border: `1px solid ${theme.appBorderColor}`,
}))

const SectionHeader = styled.header(({theme}) => ({
  padding: '6px 10px',
  background: theme.barBg,
  borderBottom: `1px solid ${theme.appBorderColor}`,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
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
  padding: '4px 0',
})

const MetricItem = styled.div(({theme}) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 10px',
  borderBottom: `1px solid ${theme.appBorderColor}`,
  position: 'relative',
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

const InfoIcon = styled.span(({theme}) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '14px',
  height: '14px',
  fontSize: '9px',
  borderRadius: '50%',
  background: theme.color.medium,
  color: theme.color.defaultText,
  cursor: 'help',
  flexShrink: 0,
  userSelect: 'none',
  '&:hover > span': {
    visibility: 'visible',
    opacity: 1,
  },
}))

const TooltipContent = styled.span(({theme}) => ({
  visibility: 'hidden',
  opacity: 0,
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  marginTop: '8px',
  padding: '6px 10px',
  background: theme.color.darkest,
  color: theme.color.lightest,
  fontSize: '11px',
  fontWeight: 'normal',
  fontFamily: theme.typography.fonts.base,
  lineHeight: 1.4,
  borderRadius: theme.appBorderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  whiteSpace: 'normal',
  width: 'max-content',
  maxWidth: '220px',
  zIndex: 9999,
  transition: 'opacity 0.15s ease, visibility 0.15s ease',
  pointerEvents: 'none',
  // Arrow
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '5px solid transparent',
    borderBottomColor: theme.color.darkest,
  },
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
        {tooltip && (
          <InfoIcon>
            ?<TooltipContent>{tooltip}</TooltipContent>
          </InfoIcon>
        )}
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
  const tbtStatus = getStatus(metrics.totalBlockingTime, 0, THRESHOLDS.TBT_WARNING)
  const thrashingStatus = getZeroStatus(metrics.thrashingScore)
  const domMutationStatus = getStatus(metrics.domMutationsPerFrame, 0, THRESHOLDS.DOM_MUTATIONS_WARNING)

  return (
    <MetricsSection icon="⏱️" title="Main Thread">
      <Metric label="Long Tasks" tooltip="Tasks blocking main thread >50ms. Target: 0 during interactions.">
        <StatusBadge variant={longTaskStatus}>
          {metrics.longTasks}
          {metrics.longTasks === 0 && ' ✓'}
        </StatusBadge>
        {metrics.longestTask > 0 && <SecondaryValue>(max {Math.round(metrics.longestTask)}ms)</SecondaryValue>}
      </Metric>

      <Metric
        label="TBT"
        tooltip="Total Blocking Time - sum of time beyond 50ms for each long task. Key Core Web Vital."
      >
        <StatusBadge variant={tbtStatus}>
          {metrics.totalBlockingTime}ms
          {metrics.totalBlockingTime === 0 && ' ✓'}
        </StatusBadge>
      </Metric>

      <Metric label="Thrashing" tooltip="Frame blocking >50ms near style writes. Indicates forced synchronous layout.">
        <StatusBadge variant={thrashingStatus}>
          {metrics.thrashingScore === 0 ? 'None ✓' : `${metrics.thrashingScore} stalls`}
        </StatusBadge>
      </Metric>

      <Metric label="DOM Churn" tooltip="DOM mutations per sample period. High values indicate excessive re-rendering.">
        <StatusBadge variant={domMutationStatus}>
          {metrics.domMutationsPerFrame}
          {metrics.domMutationsPerFrame === 0 && ' ✓'}
        </StatusBadge>
        <SecondaryValue>/period</SecondaryValue>
      </Metric>
    </MetricsSection>
  )
}

// ============================================================================
// Layout & Browser Internals Section (combined for better density)
// ============================================================================

function LayoutAndInternalsSection({metrics}: {metrics: PerformanceMetrics}) {
  const clsStatus = getStatus(metrics.layoutShiftScore, THRESHOLDS.CLS_GOOD, THRESHOLDS.CLS_WARNING)
  const reflowStatus = getStatus(metrics.forcedReflowCount, 0, THRESHOLDS.FORCED_REFLOW_WARNING)
  const jitterStatus = getZeroStatus(metrics.inputJitter)

  return (
    <MetricsSection icon="📐" title="Layout & Stability">
      <Metric label="CLS" tooltip="Cumulative Layout Shift. Target: <0.1 good, <0.25 needs work.">
        <StatusBadge variant={clsStatus}>
          {metrics.layoutShiftScore === 0 ? '0 ✓' : metrics.layoutShiftScore.toFixed(3)}
        </StatusBadge>
        {metrics.layoutShiftCount > 0 && <SecondaryValue>({metrics.layoutShiftCount} shifts)</SecondaryValue>}
      </Metric>

      <Metric
        label="Forced Reflows"
        tooltip="Layout reads after style writes force synchronous layout. Major perf killer during drag."
      >
        <StatusBadge variant={reflowStatus}>
          {metrics.forcedReflowCount}
          {metrics.forcedReflowCount === 0 && ' ✓'}
        </StatusBadge>
      </Metric>

      <Metric label="Style Writes" tooltip="Inline style mutations observed via MutationObserver.">
        {metrics.styleWrites}
        {metrics.cssVarChanges > 0 && <SecondaryValue>({metrics.cssVarChanges} CSS vars)</SecondaryValue>}
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
// React Profiler Section
// ============================================================================

function ReactSection({metrics}: {metrics: PerformanceMetrics}) {
  const slowUpdateStatus = getStatus(metrics.slowReactUpdates, 0, THRESHOLDS.SLOW_UPDATES_WARNING)
  const p95Status = getStatus(metrics.reactP95Duration, 0, THRESHOLDS.REACT_P95_WARNING)
  const cascadeStatus = getStatus(metrics.renderCascades, 0, THRESHOLDS.CASCADE_WARNING)

  return (
    <MetricsSection icon="⚛️" title="React Performance">
      <Metric label="Mount" tooltip="Initial render count and total duration.">
        {metrics.reactMountCount > 0 ? (
          <>
            {metrics.reactMountCount}×<SecondaryValue>({formatMs(metrics.reactMountDuration)}ms total)</SecondaryValue>
          </>
        ) : (
          <SecondaryValue style={{fontStyle: 'italic'}}>Awaiting profiler data…</SecondaryValue>
        )}
      </Metric>

      <Metric label="Slow Updates" tooltip="React updates taking >16ms (one frame budget). These cause visible jank.">
        {metrics.reactRenderCount > 0 ? (
          <>
            <StatusBadge variant={slowUpdateStatus}>
              {metrics.slowReactUpdates}
              {metrics.slowReactUpdates === 0 && ' ✓'}
            </StatusBadge>
            <SecondaryValue>/ {metrics.reactPostMountUpdateCount} total</SecondaryValue>
          </>
        ) : (
          <SecondaryValue style={{fontStyle: 'italic'}}>Use React profiling build</SecondaryValue>
        )}
      </Metric>

      <Metric
        label="P95 Duration"
        tooltip="95th percentile React update duration. Represents worst-case user experience."
      >
        {metrics.reactP95Duration > 0 ? (
          <StatusBadge variant={p95Status}>
            {formatMs(metrics.reactP95Duration)}ms
            {metrics.reactP95Duration < THRESHOLDS.REACT_P95_WARNING && ' ✓'}
          </StatusBadge>
        ) : (
          <SecondaryValue>—</SecondaryValue>
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
// Memory & Rendering Section (combined for better density)
// ============================================================================

function MemoryAndRenderingSection({metrics}: {metrics: PerformanceMetrics}) {
  const gcStatus = getStatus(metrics.gcPressure, 0, THRESHOLDS.GC_PRESSURE_WARNING)
  const layerStatus =
    metrics.compositorLayers === null ? 'neutral' : getStatus(metrics.compositorLayers, 0, THRESHOLDS.LAYERS_WARNING)

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

  if (metrics.memoryUsedMB === null) {
    return (
      <MetricsSection icon="🧠" title="Memory & Rendering">
        <Metric label="Heap">
          <SecondaryValue>Not available (Chrome only)</SecondaryValue>
        </Metric>
        <Metric label="Paint Count" tooltip="Number of paint operations.">
          {metrics.paintCount}
        </Metric>
        <Metric label="Compositor Layers" tooltip="Elements promoted to GPU layers.">
          {metrics.compositorLayers !== null ? (
            <StatusBadge variant={layerStatus}>{metrics.compositorLayers}</StatusBadge>
          ) : (
            '—'
          )}
        </Metric>
      </MetricsSection>
    )
  }

  return (
    <MetricsSection icon="🧠" title="Memory & Rendering">
      <Metric label="Heap" tooltip="Current JS heap size. Watch for sustained growth indicating leaks.">
        <Sparkline data={metrics.memoryHistory} />
        <span>
          {formatMb(metrics.memoryUsedMB)}MB
          {deltaText && <StatusBadge variant={deltaStatus}> ({deltaText})</StatusBadge>}
        </span>
      </Metric>

      <Metric label="Peak / DOM" tooltip="Peak heap and DOM node count.">
        {metrics.peakMemoryMB !== null ? `${formatMb(metrics.peakMemoryMB)}MB` : '—'}
        <SecondaryValue>
          / {metrics.domElements !== null ? formatNumber(metrics.domElements) : '—'} nodes
        </SecondaryValue>
      </Metric>

      <Metric label="GC Pressure" tooltip="Memory allocation rate. High values cause GC pauses.">
        <StatusBadge variant={gcStatus}>
          {metrics.gcPressure > 0.01 ? `${metrics.gcPressure.toFixed(2)} MB/s` : 'Low ✓'}
        </StatusBadge>
      </Metric>

      <Metric label="Paint / Layers" tooltip="Paint operations and compositor layer count.">
        {metrics.paintCount}
        <SecondaryValue>
          /{' '}
          {metrics.compositorLayers !== null ? (
            <StatusBadge variant={layerStatus}>{metrics.compositorLayers} layers</StatusBadge>
          ) : (
            '—'
          )}
        </SecondaryValue>
      </Metric>
    </MetricsSection>
  )
}

// ============================================================================
// Main Panel Component
// ============================================================================

function PanelContent({active}: {active: boolean}) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(DEFAULT_METRICS)
  const [connectionState, setConnectionState] = React.useState<'connecting' | 'connected' | 'disconnected'>(
    'connecting',
  )
  const state = useStorybookState()
  const connectionTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const emit = useChannel({
    [PERF_EVENTS.METRICS_UPDATE]: (data: PerformanceMetrics) => {
      setMetrics(data)
      setConnectionState('connected')
      // Clear timeout if we receive data
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
        connectionTimeoutRef.current = null
      }
    },
  })

  React.useEffect(() => {
    if (active) {
      // Reset to connecting state on story change
      setConnectionState('connecting')

      // Request metrics immediately
      emit(PERF_EVENTS.REQUEST_METRICS)

      // Also request again after a short delay to handle race conditions
      const retryTimeout = setTimeout(() => {
        emit(PERF_EVENTS.REQUEST_METRICS)
      }, 100)

      // Only show "not active" after waiting a bit
      connectionTimeoutRef.current = setTimeout(() => {
        setConnectionState(prev => (prev === 'connecting' ? 'disconnected' : prev))
      }, 500)

      return () => {
        clearTimeout(retryTimeout)
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current)
        }
      }
    }
    return undefined
  }, [active, emit, state.storyId])

  const handleReset = React.useCallback(() => {
    emit(PERF_EVENTS.RESET)
    setMetrics(DEFAULT_METRICS)
  }, [emit])

  if (!active) return null

  if (connectionState === 'connecting') {
    return (
      <EmptyState>
        <p style={{fontSize: '12px', color: 'inherit'}}>Connecting…</p>
      </EmptyState>
    )
  }

  if (connectionState === 'disconnected') {
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
      <ContentArea>
        <SectionsGrid>
          <FrameTimingSection metrics={metrics} />
          <InputSection metrics={metrics} />
          <MainThreadSection metrics={metrics} />
          <ReactSection metrics={metrics} />
          <LayoutAndInternalsSection metrics={metrics} />
          <MemoryAndRenderingSection metrics={metrics} />
        </SectionsGrid>
      </ContentArea>
      <SideToolbar>
        <ResetButton type="button" onClick={handleReset} title="Reset all metrics">
          ↺
        </ResetButton>
      </SideToolbar>
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
