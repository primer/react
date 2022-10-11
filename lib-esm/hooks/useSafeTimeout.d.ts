declare type SetTimeout = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
declare type ClearTimeout = (id: number) => void;
/**
 * Safely call `setTimeout` and `clearTimeout` within a component.
 *
 * This hook ensures that all timeouts are cleared when the component unmounts.
 */
export default function useSafeTimeout(): {
    safeSetTimeout: SetTimeout;
    safeClearTimeout: ClearTimeout;
};
export {};
