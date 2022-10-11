/// <reference types="react" />
import { IconButton } from './IconButton';
import { LinkButton } from './LinkButton';
export type { ButtonProps, IconButtonProps } from './types';
export { IconButton, LinkButton };
export declare const Button: import("react").ForwardRefExoticComponent<Pick<import("./types").ButtonProps, string | number | symbol> & import("react").RefAttributes<HTMLButtonElement>> & {
    Counter: ({ children, sx: sxProp, ...props }: import("./ButtonCounter").CounterProps) => JSX.Element;
};
