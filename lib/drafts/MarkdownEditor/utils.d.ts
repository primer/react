export declare const getSelectedLineRange: (textarea: HTMLTextAreaElement) => [number, number];
export declare const markdownComment: (text: string) => string;
export declare const markdownLink: (text: string, url: string) => string;
export declare const markdownImage: (altText: string, url: string) => string;
export declare const isModifierKey: (event: KeyboardEvent | React.KeyboardEvent<unknown>) => boolean;
