/**
 * @fileoverview Performance Monitor Addon - Panel Component
 *
 * This file implements the manager-side UI panel for the Performance Monitor
 * Storybook addon. It displays real-time metrics received from the preview
 * via the Storybook channel API.
 *
 * ## Architecture
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        Manager (Addon Panel)                             │
 * │  ┌─────────────────────────────────────────────────────────────────┐    │
 * │  │  PerformancePanel                                                │    │
 * │  │  ├─ ContentArea (scrollable grid)                               │    │
 * │  │  │  ├─ FrameTimingSection    [FPS, Frame Time, Dropped]         │    │
 * │  │  │  ├─ InputSection          [Latency, INP, Jitter]             │    │
 * │  │  │  ├─ MainThreadSection     [Long Tasks, TBT, Longest]         │    │
 * │  │  │  ├─ ReactSection          [Mounts, Updates, Cascades, P95]   │    │
 * │  │  │  ├─ LayoutSection         [CLS, Reflows, DOM Mutations]      │    │
 * │  │  │  └─ MemorySection         [Heap, Delta, Peak, GC]            │    │
 * │  │  └─ SideToolbar (reset button)                                  │    │
 * │  └─────────────────────────────────────────────────────────────────┘    │
 * └─────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * ## Metric Thresholds
 *
 * Metrics are color-coded based on Web Vitals standards:
 * - 🟢 Green: Good performance (meets targets)
 * - 🟡 Yellow: Needs improvement (may cause issues)
 * - 🔴 Red: Poor performance (likely causing issues)
 *
 * ## Communication
 *
 * Uses Storybook's channel API to receive metrics:
 * - `PERF_EVENTS.METRICS_UPDATE` - Receives metrics from decorator
 * - `PERF_EVENTS.RESET` - Emits to reset all metrics
 * - `PERF_EVENTS.REQUEST_METRICS` - Requests immediate metrics update
 *
 * @module performance-panel
 * @see {@link ./performance-decorator.tsx} - The metrics collector
 * @see {@link ./performance-tool.tsx} - Addon registration
 */

import React from 'react'
import {useChannel, useStorybookState} from 'storybook/manager-api'
import {AddonPanel} from 'storybook/internal/components'
import {styled, useTheme} from 'storybook/theming'
import {ADDON_ID} from './performance-tool'

// ============================================================================
// Channel Events
// ============================================================================

/**
 * Channel event names for panel↔decorator communication.
 * Must match values in performance-decorator.tsx.
 * @constant {Object}
 */
export const PERF_EVENTS = {
  /** Decorator → Panel: New metrics available */
  METRICS_UPDATE: `${ADDON_ID}/metrics-update`,
  /** Panel → Decorator: Reset all metrics to baseline */
  RESET: `${ADDON_ID}/reset`,
  /** Panel → Decorator: Request immediate metrics update */
  REQUEST_METRICS: `${ADDON_ID}/request-metrics`,
}

// ============================================================================
// Thresholds
// ============================================================================

/**
 * Performance thresholds for metric color-coding.
 *
 * Based on Web Vitals standards where applicable:
 * - FPS/Frame timing: 60fps target (16.67ms frame budget)
 * - Input latency: <100ms good, <300ms acceptable (RAIL model)
 * - CLS: <0.1 good, <0.25 needs improvement (Core Web Vital)
 * - INP: <200ms good, <500ms needs improvement (Core Web Vital)
 * - TBT: <200ms good, <600ms needs improvement (Lighthouse)
 *
 * @constant {Object}
 */
const THRESHOLDS = {
  // Frame timing
  /** FPS above this is good (green) */
  FPS_GOOD: 55,
  /** FPS below this is poor (red) */
  FPS_WARNING: 30,
  /** Target frame time for 60fps (ms) */
  FRAME_TIME_TARGET: 16.67,
  /** Frame time above this is poor (ms) */
  FRAME_TIME_WARNING: 32,

  // Input responsiveness
  /** Input latency below this is excellent (ms) */
  INPUT_LATENCY_GOOD: 16,
  /** Input latency above this needs attention (ms) */
  INPUT_LATENCY_WARNING: 50,
  /** INP below this is good - Core Web Vital (ms) */
  INP_GOOD: 200,
  /** INP above this is poor - Core Web Vital (ms) */
  INP_WARNING: 500,

  // Main thread
  /** Long tasks above this count needs attention */
  LONG_TASKS_WARNING: 5,
  /** Longest task above this is concerning (ms) */
  LONGEST_TASK_WARNING: 100,
  /** Dropped frames above this indicates jank */
  DROPPED_FRAMES_WARNING: 10,
  /** TBT below this is good (ms) - Lighthouse metric */
  TBT_WARNING: 200,
  /** TBT above this is poor (ms) */
  TBT_DANGER: 600,

  // Layout & Style
  /** CLS below this is good - Core Web Vital */
  CLS_GOOD: 0.1,
  /** CLS above this is poor - Core Web Vital */
  CLS_WARNING: 0.25,
  /** Forced reflows above this needs attention */
  FORCED_REFLOW_WARNING: 5,
  /** Forced reflows above this is serious */
  FORCED_REFLOW_DANGER: 20,
  /** DOM mutations/frame above this may cause jank */
  DOM_MUTATIONS_WARNING: 50,
  /** DOM mutations/frame above this likely causes jank */
  DOM_MUTATIONS_DANGER: 200,

  // React
  /** React render time below this is good (ms) */
  REACT_RENDER_GOOD: 8,
  /** React render time above this is slow (ms) */
  REACT_RENDER_WARNING: 16,
  /** Render cascades above this is problematic */
  CASCADE_WARNING: 3,
  /** Slow updates above this needs attention */
  SLOW_UPDATES_WARNING: 3,
  /** Slow updates above this is serious */
  SLOW_UPDATES_DANGER: 10,
  /** P95 React duration above this needs attention (ms) */
  REACT_P95_WARNING: 8,
  /** P95 React duration above this is poor (ms) */
  REACT_P95_DANGER: 16,

  // Memory
  /** Memory growth above this needs attention (MB) */
  MEMORY_DELTA_WARNING: 5,
  /** Memory growth above this indicates leak (MB) */
  MEMORY_DELTA_DANGER: 20,
  /** GC pressure above this indicates allocation issues (MB/s) */
  GC_PRESSURE_WARNING: 1,
  /** GC pressure above this is serious (MB/s) */
  GC_PRESSURE_DANGER: 5,

  // Observers (informational)
  /** Event listeners above this is high */
  EVENT_LISTENERS_WARNING: 50,
  /** Event listeners above this is very high */
  EVENT_LISTENERS_DANGER: 100,
  /** Observers above this is high */
  OBSERVERS_WARNING: 10,
  /** Observers above this is very high */
  OBSERVERS_DANGER: 25,
  /** CSS var changes above this is excessive */
  CSS_VAR_CHANGES_WARNING: 50,
  /** Compositor layers above this needs attention */
  LAYERS_WARNING: 20,
  /** Compositor layers above this is concerning */
  LAYERS_DANGER: 50,
} as const

// ============================================================================
// Types
// ============================================================================

/**
 * Performance metrics received from the decorator.
 * Mirrors ComputedMetrics from performance-decorator.tsx.
 * @interface PerformanceMetrics
 * @private
 */
interface PerformanceMetrics {
  // Frame timing
  fps: number
  frameTime: number
  maxFrameTime: number
  droppedFrames: number

  // Input
  inputLatency: number
  maxInputLatency: number
  inputJitter: number
  interactionCount: number
  inpMs: number

  // Paint
  paintTime: number
  maxPaintTime: number
  paintCount: number

  // Main thread
  longTasks: number
  longestTask: number
  totalBlockingTime: number

  // Layout & Style
  styleWrites: number
  thrashingScore: number
  layoutShiftScore: number
  layoutShiftCount: number
  forcedReflowCount: number
  domMutationsPerFrame: number
  cssVarChanges: number

  // React
  reactMountCount: number
  reactMountDuration: number
  reactRenderCount: number
  reactPostMountUpdateCount: number
  reactPostMountMaxDuration: number
  renderCascades: number
  slowReactUpdates: number
  reactP95Duration: number

  // Memory
  memoryUsedMB: number | null
  memoryDeltaMB: number | null
  peakMemoryMB: number | null
  gcPressure: number

  // DOM
  domElements: number | null
  scriptEvalTime: number

  // Observers
  eventListenerCount: number
  observerCount: number
  compositorLayers: number | null

  // Sparkline data
  fpsHistory: number[]
  frameTimeHistory: number[]
  memoryHistory: number[]
}

/**
 * Default/initial metrics state (all zeros/nulls).
 * @constant {PerformanceMetrics}
 * @private
 */
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

/**
 * Formats a number as milliseconds with 1 decimal place.
 * @param value - Duration in milliseconds
 * @returns Formatted string (e.g., "16.7")
 * @private
 */
const formatMs = (value: number): string =>
  new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(value)

/**
 * Formats a number as megabytes with 1 decimal place.
 * @param value - Size in megabytes
 * @returns Formatted string (e.g., "45.2")
 * @private
 */
const formatMb = (value: number): string =>
  new Intl.NumberFormat('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(value)

/**
 * Formats a number with thousand separators.
 * @param value - Number to format
 * @returns Formatted string (e.g., "1,234")
 * @private
 */
const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value)

// ============================================================================
// Styled Components
// ============================================================================

/**
 * Styled components using Storybook's theming system.
 * All styles adapt to Storybook's light/dark theme automatically.
 *
 * Layout structure:
 * - PanelWrapper: Flex container (content + sidebar)
 * - ContentArea: Scrollable grid of metric sections
 * - SideToolbar: Thin vertical strip with reset button
 * - SectionsGrid: Auto-fit grid of Section cards
 */

/** Root container - horizontal flex with content area and sidebar */
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
// Section Components
// ============================================================================

/**
 * Frame Timing Section - Core rendering performance metrics.
 *
 * Displays:
 * - FPS: Frames per second with sparkline trend
 * - Frame Time: Average/max frame duration
 * - Dropped Frames: Count of frames exceeding 2× budget
 *
 * @component
 * @param props.metrics - Current performance metrics
 */
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

// ----------------------------------------------------------------------------
// Input Responsiveness Section
// ----------------------------------------------------------------------------

/**
 * Input Section - User interaction latency metrics.
 *
 * Displays:
 * - Input Latency: Time from event to next frame
 * - Paint Time: Browser rendering duration
 * - INP: Interaction to Next Paint (Core Web Vital)
 *
 * @component
 * @param props.metrics - Current performance metrics
 */
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

// ----------------------------------------------------------------------------
// Main Thread Section
// ----------------------------------------------------------------------------

/**
 * Main Thread Section - Thread blocking and jank metrics.
 *
 * Displays:
 * - Long Tasks: Tasks >50ms blocking the main thread
 * - TBT: Total Blocking Time (Core Web Vital correlate)
 * - Thrashing: Style write + forced layout combinations
 * - DOM Churn: Mutations per measurement period
 *
 * @component
 * @param props.metrics - Current performance metrics
 */
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

// ----------------------------------------------------------------------------
// Layout & Stability Section
// ----------------------------------------------------------------------------

/**
 * Layout & Internals Section - Layout stability and browser internals.
 *
 * Displays:
 * - CLS: Cumulative Layout Shift (Core Web Vital)
 * - Forced Reflows: Synchronous layout caused by read-after-write
 * - Style Writes: Inline style mutations
 * - Jitter: Input latency spikes
 *
 * @component
 * @param props.metrics - Current performance metrics
 */
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

// ----------------------------------------------------------------------------
// React Profiler Section
// ----------------------------------------------------------------------------

/**
 * React Section - React Profiler-based render metrics.
 *
 * Displays:
 * - Mount: Initial render count and duration
 * - Slow Updates: Renders exceeding 16ms frame budget
 * - P95 Duration: 95th percentile render time
 * - Cascades: setState during render (nested-update)
 *
 * @component
 * @param props.metrics - Current performance metrics
 */
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

// ----------------------------------------------------------------------------
// Memory & Rendering Section
// ----------------------------------------------------------------------------

/**
 * Memory & Rendering Section - Heap usage and rendering metrics.
 *
 * Displays:
 * - Heap: Current JS heap size with sparkline (Chrome only)
 * - Peak / DOM: Peak memory and DOM node count
 * - GC Pressure: Memory allocation rate (MB/s)
 * - Paint / Layers: Paint count and compositor layers
 *
 * Shows alternate view when memory API is unavailable (Firefox/Safari).
 *
 * @component
 * @param props.metrics - Current performance metrics
 */
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
// Main Panel Content
// ============================================================================

/**
 * Inner panel content component with metrics display.
 *
 * Manages:
 * - Channel subscription for METRICS_UPDATE events
 * - Connection state (connecting → connected | disconnected)
 * - Reset functionality
 * - Story change detection via useStorybookState
 *
 * Renders appropriate state:
 * - "Connecting..." while waiting for first metrics
 * - "Decorator not active" if story doesn't use withPerformanceMonitor
 * - Full metrics grid when connected
 *
 * @component
 * @param props.active - Whether the panel tab is currently selected
 * @private
 */
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
// Exports
// ============================================================================

/**
 * Props for the PerformancePanel component.
 * @interface PerformancePanelProps
 */
interface PerformancePanelProps {
  /** Whether the panel is currently visible/active */
  active: boolean
}

/**
 * Main addon panel component for the Performance Monitor.
 *
 * This is the entry point registered with Storybook's addon API.
 * Wraps PanelContent in an AddonPanel for proper Storybook integration.
 *
 * @component
 * @param props - Component props
 * @param props.active - Whether the panel is currently visible
 *
 * @example
 * // Registered in manager.tsx via addons.add()
 * addons.add(PANEL_ID, {
 *   type: types.PANEL,
 *   render: ({active}) => <PerformancePanel active={active} />,
 * })
 *
 * @see {@link ./performance-tool.tsx} - Where this panel is registered
 */
export function PerformancePanel({active}: PerformancePanelProps) {
  return (
    <AddonPanel active={active}>
      <PanelContent active={active} />
    </AddonPanel>
  )
}
