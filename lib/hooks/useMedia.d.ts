import React from 'react';
/**
 * `useMedia` will use the given `mediaQueryString` with `matchMedia` to
 * determine if the document matches the media query string.
 *
 * If `MatchMedia` is used as an ancestor, `useMedia` will instead use the
 * value of the media query string, if available
 *
 * @example
 * function Example() {
 *   const coarsePointer = useMedia('(pointer: coarse)');
 *   // ...
 * }
 */
export declare function useMedia(mediaQueryString: string, defaultState?: boolean): boolean;
declare type MediaQueryFeatures = {
    [key: string]: boolean | undefined;
};
declare type MatchMediaProps = {
    children: React.ReactNode;
    features?: MediaQueryFeatures;
};
/**
 * Use `MatchMedia` to emulate media conditions by passing in feature
 * queries to the `features` prop. If a component uses `useMedia` with the
 * feature passed in to `MatchMedia` it will force its value to match what is
 * provided to `MatchMedia`
 *
 * This should be used for development and documentation only in situations
 * where devtools cannot emulate this feature
 *
 * @example
 * <MatchMedia features={{ "(pointer: coarse)": true}}>
 *   <Children />
 * </MatchMedia>
 */
export declare function MatchMedia({ children, features }: MatchMediaProps): JSX.Element;
export {};
