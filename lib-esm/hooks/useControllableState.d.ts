import React from 'react';
declare type ControllableStateOptions<T> = {
    /**
     * A unique name for the state value.
     */
    name?: string;
    /**
     * The default value used for the state. This will be
     * the fallback value used if `value` is not defined.
     * */
    defaultValue: T;
    /**
     * A controlled value. Omitting this means that the state is uncontrolled.
     */
    value?: T;
    /**
     * An optional function that is called when the value of the state changes.
     * This is useful for communicating to parents of controlled components
     * that the value is requesting to be changed.
     */
    onChange?: (value: T) => void;
};
/**
 * This custom hook simplifies the behavior of a component if it has state that
 * can be both controlled and uncontrolled. It functions identical to a
 * useState() hook and provides [state, setState] for you to use. You can use
 * the `onChange` argument to allow updates to the `state` to be communicated to
 * owners of controlled components.
 *
 * Note: This hook will warn if a component is switching from controlled to
 * uncontrolled, or vice-versa.
 */
export declare function useControllableState<T>({ name, defaultValue, value, onChange }: ControllableStateOptions<T>): [T, React.Dispatch<React.SetStateAction<T>>];
export {};
