import { SystemCssProperties, SystemStyleObject } from '@styled-system/css';
import { ThemeColorPaths, ThemeShadowPaths } from './theme';
import { ColorProps, ShadowProps } from 'styled-system';
import merge from 'deepmerge';
export declare type BetterCssProperties = {
    [K in keyof SystemCssProperties]: K extends keyof ColorProps ? ThemeColorPaths | SystemCssProperties[K] : K extends keyof ShadowProps ? ThemeShadowPaths | SystemCssProperties[K] : SystemCssProperties[K];
};
declare type CSSCustomProperties = {
    [key: `--${string}`]: string | number;
};
declare type CSSSelectorObject = {
    [cssSelector: string]: SystemStyleObject | CSSCustomProperties;
};
export declare type BetterSystemStyleObject = BetterCssProperties | SystemStyleObject | CSSCustomProperties | CSSSelectorObject;
export interface SxProp {
    sx?: BetterSystemStyleObject;
}
declare const sx: (props: SxProp) => import("@styled-system/css").CssFunctionReturnType;
export default sx;
export { merge };
