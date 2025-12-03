/**
 * @fileoverview Performance Monitor Addon - Tool Registration
 *
 * This file defines the addon identifiers used to register the Performance Monitor
 * as a Storybook addon. The addon provides real-time performance metrics for
 * React components rendered in Storybook stories.
 *
 * @module performance-tool
 * @see {@link ./performance-panel.tsx} - The UI panel that displays metrics
 * @see {@link ./performance-decorator.tsx} - The decorator that collects metrics
 *
 * @example
 * // In .storybook/manager.ts
 * import { addons, types } from 'storybook/manager-api';
 * import { ADDON_ID, PANEL_ID } from './src/performance-tool';
 * import { PerformancePanel } from './src/performance-panel';
 *
 * addons.register(ADDON_ID, () => {
 *   addons.add(PANEL_ID, {
 *     type: types.PANEL,
 *     title: 'Performance',
 *     render: ({ active }) => <PerformancePanel active={active} />,
 *   });
 * });
 */

/**
 * Unique identifier for the Performance Monitor addon.
 * Used for addon registration and channel event namespacing.
 * @constant {string}
 */
export const ADDON_ID = 'primer-performance-monitor'

/**
 * Panel identifier for the Performance Monitor UI.
 * Used when registering the addon panel in Storybook's manager.
 * @constant {string}
 */
export const PANEL_ID = `${ADDON_ID}/panel`
