import React from 'react';
export declare type TreeViewProps = {
    'aria-label'?: React.AriaAttributes['aria-label'];
    'aria-labelledby'?: React.AriaAttributes['aria-labelledby'];
    children: React.ReactNode;
};
export declare type TreeViewItemProps = {
    children: React.ReactNode;
    current?: boolean;
    defaultExpanded?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    onSelect?: (event: React.MouseEvent<HTMLElement> | KeyboardEvent) => void;
};
export declare type TreeViewLinkItemProps = TreeViewItemProps & {
    href?: string;
};
export declare type TreeViewSubTreeProps = {
    children?: React.ReactNode;
};
export declare type TreeViewVisualProps = {
    children: React.ReactNode | ((props: {
        isExpanded: boolean;
    }) => React.ReactNode);
};
export declare const TreeView: React.FC<TreeViewProps> & {
    Item: React.FC<TreeViewItemProps>;
    LinkItem: React.FC<TreeViewLinkItemProps>;
    LoadingItem: React.FC<{}>;
    SubTree: React.FC<TreeViewSubTreeProps>;
    LeadingVisual: React.FC<TreeViewVisualProps>;
    TrailingVisual: React.FC<TreeViewVisualProps>;
    DirectoryIcon: () => JSX.Element;
};
