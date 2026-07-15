import type React from 'react'
import {useId} from '../hooks/useId'
import classes from './AnchorPosition.module.css'

type AnchorName = `--${string}`
type Placement = 'above' | 'below' | 'start' | 'end'
type Alignment = 'start' | 'center' | 'end'
type FallbackStrategy = 'default' | 'none' | 'opposite-side'

type AnchorPositionTargetOptions = {
  /**
   * The target's logical placement relative to the anchor.
   * @default 'below'
   */
  placement?: Placement
  /**
   * The target's alignment along the placement axis.
   * @default 'start'
   */
  alignment?: Alignment
  /**
   * Controls which CSS anchor-positioning fallbacks the browser may try.
   * @default 'default'
   */
  fallbackStrategy?: FallbackStrategy
  /**
   * The space between the anchor and target.
   * @default 'var(--base-size-4)'
   */
  gap?: number | string
}

type UseAnchorPositionConfig = {
  /**
   * A custom CSS anchor name shared by the anchor and target.
   * @default A generated anchor name
   */
  anchorName?: AnchorName
}

type AnchorPositionStyle = React.CSSProperties & {
  '--anchor-position-name': AnchorName
  '--anchor-position-gap'?: string
}

type TargetDataAttributes = {
  'data-alignment': Alignment
  'data-fallback-strategy': FallbackStrategy
  'data-placement': Placement
}

type UseAnchorPositionReturn = {
  anchorName: AnchorName
  getAnchorProps: () => React.HTMLAttributes<HTMLElement>
  getTargetProps: (options?: AnchorPositionTargetOptions) => React.HTMLAttributes<HTMLElement> & TargetDataAttributes
}

/**
 * Connects an anchor and target with CSS anchor positioning without prescribing
 * their rendered markup.
 */
function useAnchorPosition({anchorName: customAnchorName}: UseAnchorPositionConfig = {}): UseAnchorPositionReturn {
  const id = useId()
  const anchorName = customAnchorName ?? (`--anchor-position-${id.replaceAll(':', '')}` as AnchorName)

  function getAnchorProps(): React.HTMLAttributes<HTMLElement> {
    return {
      className: classes.Anchor,
      style: {
        '--anchor-position-name': anchorName,
      } as AnchorPositionStyle,
    }
  }

  function getTargetProps({
    alignment = 'start',
    fallbackStrategy = 'default',
    gap,
    placement = 'below',
  }: AnchorPositionTargetOptions = {}): React.HTMLAttributes<HTMLElement> & TargetDataAttributes {
    const resolvedGap = typeof gap === 'number' ? `${gap}px` : gap

    return {
      className: classes.Target,
      'data-alignment': alignment,
      'data-fallback-strategy': fallbackStrategy,
      'data-placement': placement,
      style: {
        '--anchor-position-name': anchorName,
        ...(resolvedGap === undefined ? {} : {'--anchor-position-gap': resolvedGap}),
      } as AnchorPositionStyle,
    }
  }

  return {
    anchorName,
    getAnchorProps,
    getTargetProps,
  }
}

export {useAnchorPosition}
export type {
  UseAnchorPositionConfig,
  UseAnchorPositionReturn,
  AnchorPositionTargetOptions,
  AnchorName,
  Placement,
  Alignment,
  FallbackStrategy,
}
