/// <reference types="react" />
declare type UseDetailsParameters = {
    ref?: React.RefObject<HTMLElement>;
    closeOnOutsideClick?: boolean;
    defaultOpen?: boolean;
    onClickOutside?: (event: MouseEvent) => void;
};
declare function useDetails({ ref, closeOnOutsideClick, defaultOpen, onClickOutside }: UseDetailsParameters): {
    open: boolean | undefined;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean | undefined>>;
    getDetailsProps: () => {
        onToggle: (e: React.SyntheticEvent<HTMLElement, Event>) => void;
        open: boolean | undefined;
        ref: import("react").RefObject<HTMLElement>;
    };
};
export default useDetails;
