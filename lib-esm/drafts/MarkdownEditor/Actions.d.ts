import React from 'react';
import { ButtonProps } from '../../Button';
export declare const Actions: {
    ({ children }: {
        children?: React.ReactNode;
    }): JSX.Element;
    displayName: string;
};
export declare const ActionButton: React.ForwardRefExoticComponent<Pick<ButtonProps, string | number | symbol> & React.RefAttributes<HTMLButtonElement>>;
