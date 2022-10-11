declare type DeprecationType = {
    name: string;
    message: string;
    version: string;
};
declare let deprecate: ({ name, message, version }: DeprecationType) => void | (() => void);
export { deprecate };
declare let useDeprecation: any;
export { useDeprecation };
export declare class Deprecations {
    static instance: Deprecations | null;
    deprecations: Array<DeprecationType>;
    static get(): Deprecations;
    constructor();
    static deprecate({ name, message, version }: DeprecationType): void;
    static getDeprecations(): DeprecationType[];
    static clearDeprecations(): void;
}
