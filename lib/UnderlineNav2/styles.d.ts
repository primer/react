/// <reference types="react" />
import { Theme } from '../ThemeProvider';
import { BetterSystemStyleObject } from '../sx';
import { UnderlineNavProps } from './UnderlineNav';
export declare const iconWrapStyles: {
    alignItems: string;
    display: string;
    marginRight: number;
};
export declare const wrapperStyles: {
    display: string;
    paddingY: number;
    paddingX: number;
    borderRadius: number;
};
export declare const counterStyles: {
    marginLeft: number;
    display: string;
    alignItems: string;
};
export declare const getNavStyles: (theme?: Theme | undefined, props?: Partial<Pick<UnderlineNavProps, "align">> | undefined) => {
    display: string;
    paddingX: number;
    justifyContent: string;
    borderBottom: string;
    borderBottomColor: string;
    align: string;
    alignItems: string;
    position: string;
};
export declare const ulStyles: {
    display: string;
    listStyle: string;
    padding: string;
    margin: string;
    marginBottom: string;
    alignItems: string;
};
export declare const getDividerStyle: (theme?: Theme | undefined) => {
    display: string;
    borderLeft: string;
    width: string;
    borderLeftColor: string;
    marginRight: number;
};
export declare const moreBtnStyles: {
    margin: number;
    border: number;
    background: string;
    fontWeight: string;
    boxShadow: string;
    paddingY: number;
    paddingX: number;
};
export declare const btnWrapperStyles: (theme?: Theme | undefined, direction?: string, show?: boolean, translateX?: number, display?: string) => {
    position: string;
    zIndex: number;
    top: number;
    bottom: number;
    left: string | number;
    right: string | number;
    alignItems: string;
    background: string;
    transform: string;
    display: string;
};
export declare const getArrowBtnStyles: (theme?: Theme | undefined, direction?: string) => {
    fontWeight: string;
    boxShadow: string;
    margin: number;
    border: number;
    borderRadius: number;
    paddingX: string;
    paddingY: number;
    background: string;
    height: string;
    '&:hover:not([disabled]), &:focus-visible': {
        background: any;
    };
    '&:focus:not(:disabled)': {
        outline: number;
        boxShadow: string;
        background: string;
    };
    '&:not(:focus-visible)': {
        boxShadow: string;
        background: string;
    };
    '&:focus-visible:not(:disabled)': {
        boxShadow: string;
        background: string;
    };
};
export declare const getLinkStyles: (theme?: Theme | undefined, props?: Partial<Pick<UnderlineNavProps, "variant">> | undefined, selectedLink?: import("react").RefObject<HTMLElement> | undefined, ref?: import("react").RefObject<HTMLElement> | undefined) => {
    '@media (hover:hover)': {
        '&:hover > div[data-component="wrapper"] ': {
            backgroundColor: any;
            transition: string;
        };
    };
    '&:focus': {
        outline: number;
        '& > div[data-component="wrapper"]': {
            boxShadow: string;
        };
        '&:not(:focus-visible) > div[data-component="wrapper"]': {
            boxShadow: string;
        };
    };
    '&:focus-visible > div[data-component="wrapper"]': {
        boxShadow: string;
    };
    '& span[data-content]::before': {
        content: string;
        display: string;
        height: number;
        fontWeight: string;
        visibility: string;
        whiteSpace: string;
    };
    '&::after': {
        position: string;
        right: string;
        bottom: number;
        width: string;
        height: number;
        content: string;
        bg: any;
        borderRadius: number;
        transform: string;
    };
    '@media (forced-colors: active)': {
        '::after': {
            bg: string;
        };
    };
    paddingY: number;
    fontSize: number;
    position: string;
    display: string;
    color: string;
    textAlign: string;
    textDecoration: string;
    paddingX: number;
};
export declare const scrollStyles: BetterSystemStyleObject;
export declare const moreMenuStyles: BetterSystemStyleObject;
export declare const menuItemStyles: {
    '& > span': {
        display: string;
    };
};
