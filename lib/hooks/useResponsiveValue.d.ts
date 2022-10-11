export declare const viewportRanges: {
    narrow: string;
    regular: string;
    wide: string;
};
export declare type ResponsiveValue<TRegular, TNarrow = TRegular, TWide = TRegular> = {
    narrow?: TNarrow;
    regular?: TRegular;
    wide?: TWide;
};
/**
 * Flattens all possible value types into single union type
 * For example, if `T` is `'none' | 'line' | Responsive<'none' | 'line' | 'filled'>`,
 * `FlattenResponsiveValue<T>` will be `'none' | 'line' | 'filled'`
 */
export declare type FlattenResponsiveValue<T> = (T extends ResponsiveValue<infer TRegular, infer TNarrow, infer TWide> ? TRegular | TNarrow | TWide : never) | Exclude<T, ResponsiveValue<any>>;
/**
 * Checks if the value is a responsive value.
 * In other words, is it an object with viewport range keys?
 */
export declare function isResponsiveValue(value: any): value is ResponsiveValue<any>;
/**
 * Resolves responsive values based on the current viewport width.
 * For example, if the current viewport width is narrow (less than 768px), the value of `{regular: 'foo', narrow: 'bar'}` will resolve to `'bar'`.
 *
 * @example
 * const value = useResponsiveValue({regular: 'foo', narrow: 'bar'})
 * console.log(value) // 'bar'
 */
export declare function useResponsiveValue<T, F>(value: T, fallback: F): FlattenResponsiveValue<T> | F;
