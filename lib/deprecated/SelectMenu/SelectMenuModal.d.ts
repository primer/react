import React from 'react';
import { WidthProps } from 'styled-system';
import { SxProp } from '../../sx';
import { ComponentProps } from '../../utils/types';
declare type StyledModalProps = {
    filter?: boolean;
} & WidthProps;
declare const ModalWrapper: import("styled-components").StyledComponent<"div", any, {
    align?: "left" | "right" | undefined;
} & SxProp, never>;
declare type SelectMenuModalInternalProps = Pick<StyledModalProps, 'width'> & ComponentProps<typeof ModalWrapper>;
declare const SelectMenuModal: React.ForwardRefExoticComponent<Pick<SelectMenuModalInternalProps, "width" | "theme" | "key" | keyof React.HTMLAttributes<HTMLDivElement> | "sx" | "align"> & React.RefAttributes<HTMLDivElement>>;
export declare type SelectMenuModalProps = ComponentProps<typeof SelectMenuModal>;
export default SelectMenuModal;
