import React from 'react';
declare type Viewports = 'narrow' | 'regular' | 'wide';
declare type HiddenProps = {
    on: Array<Viewports> | Viewports;
    children: React.ReactNode;
};
export declare const Hidden: ({ on: hiddenViewports, children }: HiddenProps) => JSX.Element | null;
export {};
