import theme from './theme-preval';
import { KeyPaths } from './utils/types/KeyPaths';
export default theme;
declare type ThemeColors = {
    fg: {
        default: string;
        muted: string;
        subtle: string;
        onEmphasis: string;
    };
    canvas: {
        default: string;
        overlay: string;
        inset: string;
        subtle: string;
    };
    border: {
        default: string;
        muted: string;
        subtle: string;
    };
    neutral: {
        emphasisPlus: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    accent: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    success: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    attention: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    severe: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    danger: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    open: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    closed: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    done: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
    sponsors: {
        fg: string;
        emphasis: string;
        muted: string;
        subtle: string;
    };
};
declare type ThemeShadows = {
    shadow: {
        small: string;
        medium: string;
        large: string;
        extraLarge: string;
    };
};
export declare type ThemeColorPaths = KeyPaths<ThemeColors>;
export declare type ThemeShadowPaths = KeyPaths<ThemeShadows>;
