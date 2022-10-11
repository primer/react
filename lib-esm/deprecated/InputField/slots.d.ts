/// <reference types="react" />
export declare const Slots: import("react").FC<import("react").PropsWithChildren<{
    context?: Record<string, unknown> | undefined;
    children: (slots: {
        Caption?: import("react").ReactNode;
        Label?: import("react").ReactNode;
        LeadingVisual?: import("react").ReactNode;
        Input?: import("react").ReactNode;
    }) => import("react").ReactNode;
}>>, Slot: import("react").FC<import("react").PropsWithChildren<{
    name: "Caption" | "Label" | "LeadingVisual" | "Input";
    children: import("react").ReactNode;
}>>;
