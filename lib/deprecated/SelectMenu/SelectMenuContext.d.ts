/// <reference types="react" />
export declare const MenuContext: import("react").Context<{
    selectedTab?: string | undefined;
    setSelectedTab?: import("react").Dispatch<import("react").SetStateAction<string>> | undefined;
    setOpen?: import("react").Dispatch<import("react").SetStateAction<boolean>> | undefined;
    open?: boolean | undefined;
    initialTab?: string | undefined;
}>;
