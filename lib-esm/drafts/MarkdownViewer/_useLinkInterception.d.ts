declare type UseLinkInterceptionSettings = {
    htmlContainer: HTMLDivElement;
    onLinkClick?: (event: MouseEvent) => void;
    openLinksInNewTab: boolean;
};
/**
 * Updates all links in the container to open a new tab and call `onLinkClick` on click.
 */
export declare const useLinkInterception: ({ htmlContainer, onLinkClick, openLinksInNewTab }: UseLinkInterceptionSettings) => void;
export {};
