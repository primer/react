/** This context can be used by components that compose ActionList inside a Menu */
import React from 'react';
import { AriaRole } from '../utils/types';
declare type ContextProps = {
    container?: string;
    listRole?: AriaRole;
    selectionVariant?: 'single' | 'multiple';
    selectionAttribute?: 'aria-selected' | 'aria-checked';
    listLabelledBy?: string;
    afterSelect?: Function;
};
export declare const ActionListContainerContext: React.Context<ContextProps>;
export {};
