import React from 'react';
import { ButtonProps } from '../..';
export declare const Footer: ({ actionButtons, uploadButtonProps, fileUploadProgress, fileDraggedOver, errorMessage, previewMode }: {
    actionButtons: React.ReactNode;
    uploadButtonProps: Partial<ButtonProps> | null;
    fileUploadProgress?: [number, number] | undefined;
    fileDraggedOver: boolean;
    errorMessage?: string | undefined;
    previewMode: boolean;
}) => JSX.Element;
