import React from 'react';
import { IconButtonProps } from '../../Button';
export declare const ToolbarButton: React.ForwardRefExoticComponent<Pick<IconButtonProps, string | number | symbol> & React.RefAttributes<HTMLButtonElement>>;
export declare const DefaultToolbarButtons: React.MemoExoticComponent<() => JSX.Element>;
export declare const CoreToolbar: ({ children }: {
    children?: React.ReactNode;
}) => JSX.Element;
export declare const Toolbar: {
    ({ children }: {
        children?: React.ReactNode;
    }): JSX.Element;
    displayName: string;
};
