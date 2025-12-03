/**
 * @fileoverview Performance Monitor Addon - Tool Registration
 *
 * Re-exports addon identifiers from the shared types module.
 * This file exists for backward compatibility and as the conventional
 * entry point for Storybook addon registration.
 *
 * @module performance-tool
 * @see {@link ./performance-types.ts} - Shared types and constants
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

export {ADDON_ID, PANEL_ID} from './performance-types'
