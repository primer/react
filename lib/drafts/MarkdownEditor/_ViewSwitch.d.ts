/// <reference types="react" />
export declare type MarkdownViewMode = 'preview' | 'edit';
declare type ViewSwitchProps = {
    selectedView: MarkdownViewMode;
    onViewSelect?: (view: MarkdownViewMode) => void;
    disabled?: boolean;
    /** Called when the preview should be loaded. */
    onLoadPreview: () => void;
};
export declare const ViewSwitch: ({ selectedView, onViewSelect, onLoadPreview, disabled }: ViewSwitchProps) => JSX.Element;
export {};
