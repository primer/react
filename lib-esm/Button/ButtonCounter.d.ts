/// <reference types="react" />
import { SxProp } from '../sx';
export declare type CounterProps = {
    children: number;
} & SxProp;
declare const Counter: ({ children, sx: sxProp, ...props }: CounterProps) => JSX.Element;
export { Counter };
