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
 * @see {@link ./performance-types.ts} - Shared types and constants
 */

import React from 'react'
import {useChannel, useStorybookState} from 'storybook/manager-api'
import {AddonPanel} from 'storybook/internal/components'
import {styled, useTheme} from 'storybook/theming'
import {
  PERF_EVENTS,
  THRESHOLDS,
  DEFAULT_METRICS,
  getStatusVariant,
  getZeroIsGoodStatus,
  type PerformanceMetrics,
} from './performance-types'

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

const InfoIconWrapper = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'help',
  flexShrink: 0,
})

const InfoIconCircle = styled.span(({theme}) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '13px',
  height: '13px',
  fontSize: '9px',
  fontWeight: 600,
  fontStyle: 'italic',
  fontFamily: 'Georgia, serif',
  borderRadius: '50%',
  border: `1px solid ${theme.color.mediumdark}`,
  color: theme.color.mediumdark,
  userSelect: 'none',
  lineHeight: 1,
}))

interface TooltipPosition {
  horizontal: 'left' | 'center' | 'right'
  vertical: 'top' | 'bottom'
}

const TooltipContent = styled.span<{$position: TooltipPosition}>(({theme, $position}) => {
  const {horizontal, vertical} = $position

  // Horizontal transforms
  const transforms = {
    left: 'translateX(0)',
    center: 'translateX(-50%)',
    right: 'translateX(-100%)',
  }
  const leftValues = {
    left: '0',
    center: '50%',
    right: '100%',
  }
  // Arrow horizontal position
  const arrowLeft = {
    left: '12px',
    center: '50%',
    right: 'calc(100% - 12px)',
  }

  // Vertical positioning
  const verticalPos =
    vertical === 'bottom'
      ? {top: '100%', bottom: 'auto', marginTop: '8px', marginBottom: 0}
      : {top: 'auto', bottom: '100%', marginTop: 0, marginBottom: '8px'}

  // Arrow vertical positioning
  const arrowStyles =
    vertical === 'bottom'
      ? {
          bottom: '100%',
          top: 'auto',
          border: '5px solid transparent',
          borderBottomColor: theme.color.darkest,
          borderTopColor: 'transparent',
        }
      : {
          bottom: 'auto',
          top: '100%',
          border: '5px solid transparent',
          borderTopColor: theme.color.darkest,
          borderBottomColor: 'transparent',
        }

  return {
    visibility: 'hidden',
    opacity: 0,
    position: 'absolute',
    ...verticalPos,
    left: leftValues[horizontal],
    transform: transforms[horizontal],
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
      left: arrowLeft[horizontal],
      transform: 'translateX(-50%)',
      ...arrowStyles,
    },
  }
})

/**
 * Smart tooltip component that adjusts position to avoid viewport overflow.
 * Uses a ref to measure position and determines optimal alignment.
 */
function SmartTooltip({text}: {text: string}) {
  const wrapperRef = React.useRef<HTMLSpanElement>(null)
  const [position, setPosition] = React.useState<TooltipPosition>({horizontal: 'center', vertical: 'bottom'})
  const [isVisible, setIsVisible] = React.useState(false)

  const updatePosition = React.useCallback(() => {
    if (!wrapperRef.current) return

    const rect = wrapperRef.current.getBoundingClientRect()
    const tooltipWidth = 220 // max-width of tooltip
    const tooltipHeight = 80 // estimated height
    const padding = 8 // minimum distance from edge

    // Horizontal positioning
    let horizontal: 'left' | 'center' | 'right' = 'center'
    const centeredLeft = rect.left + rect.width / 2 - tooltipWidth / 2
    const centeredRight = rect.left + rect.width / 2 + tooltipWidth / 2

    if (centeredLeft < padding) {
      horizontal = 'left'
    } else if (centeredRight > window.innerWidth - padding) {
      horizontal = 'right'
    }

    // Vertical positioning - prefer bottom, use top if no room
    let vertical: 'top' | 'bottom' = 'bottom'
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    if (spaceBelow < tooltipHeight + padding && spaceAbove > tooltipHeight + padding) {
      vertical = 'top'
    }

    setPosition({horizontal, vertical})
  }, [])

  const handleMouseEnter = React.useCallback(() => {
    updatePosition()
    setIsVisible(true)
  }, [updatePosition])

  const handleMouseLeave = React.useCallback(() => {
    setIsVisible(false)
  }, [])

  return (
    <InfoIconWrapper ref={wrapperRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <InfoIconCircle>i</InfoIconCircle>
      <TooltipContent
        $position={position}
        style={{visibility: isVisible ? 'visible' : 'hidden', opacity: isVisible ? 1 : 0}}
      >
        {text}
      </TooltipContent>
    </InfoIconWrapper>
  )
}

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
// Helper Functions (aliases for imported utilities)
// ============================================================================

/** Alias for getStatusVariant from performance-types */
const getStatus = getStatusVariant

/** Alias for getZeroIsGoodStatus from performance-types */
const getZeroStatus = getZeroIsGoodStatus

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
        {tooltip && <SmartTooltip text={tooltip} />}
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
 * - Frame Jitter: Sudden spikes in frame time
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
  const frameJitterStatus = getZeroStatus(metrics.frameJitter)
  const stabilityStatus = metrics.frameStability >= 90 ? 'success' : metrics.frameStability >= 70 ? 'warning' : 'error'

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

      <Metric
        label="Frame Jitter"
        tooltip="Sudden spikes in frame time vs recent baseline. Indicates inconsistent rendering."
      >
        <StatusBadge variant={frameJitterStatus}>
          {metrics.frameJitter === 0 ? 'None ✓' : `${metrics.frameJitter} spikes`}
        </StatusBadge>
      </Metric>

      <Metric
        label="Frame Stability"
        tooltip="Frame time consistency (0-100%). 100% = perfectly smooth, lower = choppy/variable frame pacing."
      >
        <StatusBadge variant={stabilityStatus}>{metrics.frameStability}%</StatusBadge>
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
  const paintJitterStatus = getZeroStatus(metrics.paintJitter)

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

      <Metric
        label="Paint Jitter"
        tooltip="Sudden spikes in paint time vs recent baseline. Indicates rendering inconsistency."
      >
        <StatusBadge variant={paintJitterStatus}>
          {metrics.paintJitter === 0 ? 'None ✓' : `${metrics.paintJitter} spikes`}
        </StatusBadge>
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

      <Metric
        label="Input Jitter"
        tooltip="Unexpected input latency spikes causing visible hitches during interaction."
      >
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
        {metrics.reactMountCount}×
        {metrics.reactMountDuration > 0 && (
          <SecondaryValue>({formatMs(metrics.reactMountDuration)}ms total)</SecondaryValue>
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
