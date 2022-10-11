import * as styledSystem from 'styled-system';
export declare const get: (key: string) => (props: any) => any;
export declare const COMMON: styledSystem.styleFn;
export interface SystemCommonProps extends styledSystem.ColorProps, styledSystem.SpaceProps, styledSystem.DisplayProps {
}
export declare const TYPOGRAPHY: styledSystem.styleFn;
export interface SystemTypographyProps extends styledSystem.TypographyProps {
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
}
export declare const BORDER: styledSystem.styleFn;
export interface SystemBorderProps extends styledSystem.BorderProps, styledSystem.ShadowProps {
}
export declare const LAYOUT: styledSystem.styleFn;
export declare type SystemLayoutProps = styledSystem.LayoutProps;
