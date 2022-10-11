import React from 'react';
import { SxProp } from '../sx';
import { ForwardRefComponent as PolymorphicForwardRefComponent } from '../utils/polymorphic';
declare const LinkButton: PolymorphicForwardRefComponent<"a", Omit<(Pick<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "key" | keyof React.ButtonHTMLAttributes<HTMLButtonElement>> & {
    ref?: ((instance: HTMLButtonElement | null) => void) | React.RefObject<HTMLButtonElement> | null | undefined;
}) | (Pick<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "key" | keyof React.AnchorHTMLAttributes<HTMLAnchorElement>> & {
    ref?: ((instance: HTMLAnchorElement | null) => void) | React.RefObject<HTMLAnchorElement> | null | undefined;
}), string | number | symbol> & {
    leadingIcon?: React.FunctionComponent<React.PropsWithChildren<import("@primer/octicons-react/dist/icons").IconProps>> | undefined;
    trailingIcon?: React.FunctionComponent<React.PropsWithChildren<import("@primer/octicons-react/dist/icons").IconProps>> | undefined;
    children: React.ReactNode;
} & {
    variant?: import("./types").VariantType | undefined;
    size?: import("./types").Size | undefined;
    disabled?: boolean | undefined;
} & SxProp & React.HTMLAttributes<HTMLButtonElement> & {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} & {
    as?: "a" | "button" | undefined;
}>;
export { LinkButton };
