export declare function polyfill(): void;
declare global {
    interface AddEventListenerOptions {
        signal?: AbortSignal;
    }
}
