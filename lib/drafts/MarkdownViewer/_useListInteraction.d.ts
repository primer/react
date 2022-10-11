declare type UseListInteractionSettings = {
    htmlContainer: HTMLDivElement | null;
    markdownValue: string;
    onChange: (markdown: string) => void | Promise<void>;
    disabled?: boolean;
};
/**
 * Adds support for list interaction to rendered Markdown.
 *
 * Currently only supports checking / unchecking list items - reordering and task-item to
 * issue conversion are not supported yet.
 */
export declare const useListInteraction: ({ htmlContainer, markdownValue, onChange, disabled }: UseListInteractionSettings) => void;
export {};
