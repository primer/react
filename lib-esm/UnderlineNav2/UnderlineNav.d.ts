import React from 'react';
import { SxProp } from '../sx';
export declare type UnderlineNavProps = {
    'aria-label'?: React.AriaAttributes['aria-label'];
    as?: React.ElementType;
    align?: 'right';
    sx?: SxProp;
    variant?: 'default' | 'small';
    /**
     * loading state for all counters (to prevent multiple layout shifts)
     */
    loadingCounters?: boolean;
    afterSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void;
    children: React.ReactNode;
};
export declare const UnderlineNav: React.ForwardRefExoticComponent<UnderlineNavProps & React.RefAttributes<unknown>>;
