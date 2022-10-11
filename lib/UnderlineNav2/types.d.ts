/// <reference types="react" />
import { BetterSystemStyleObject } from '../sx';
export declare type ChildWidthArray = Array<{
    text: string;
    width: number;
}>;
export declare type ResponsiveProps = {
    items: Array<React.ReactElement>;
    actions: Array<React.ReactElement>;
    overflowStyles: BetterSystemStyleObject;
};
export declare type OnScrollWithButtonEventType = (event: React.MouseEvent<HTMLButtonElement>, direction: -1 | 1) => void;
