import React from 'react';
import { SxProp } from './sx';
export declare type AvatarStackProps = {
    alignRight?: boolean;
    children: React.ReactNode;
} & SxProp;
declare const AvatarStack: ({ children, alignRight, sx: sxProp }: AvatarStackProps) => JSX.Element;
export default AvatarStack;
