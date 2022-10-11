import React from 'react';

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
function useControllableState({
  name = 'custom',
  defaultValue,
  value,
  onChange
}) {
  const [state, internalSetState] = React.useState(value !== null && value !== void 0 ? value : defaultValue);
  const controlled = React.useRef(null);
  const stableOnChange = React.useRef(onChange);
  React.useEffect(() => {
    stableOnChange.current = onChange;
  });

  if (controlled.current === null) {
    controlled.current = value !== undefined;
  }

  const setState = React.useCallback(stateOrUpdater => {
    var _stableOnChange$curre;

    const value = typeof stateOrUpdater === 'function' ? // @ts-ignore stateOrUpdater is a function
    stateOrUpdater(state) : stateOrUpdater;

    if (controlled.current === false) {
      internalSetState(value);
    }

    (_stableOnChange$curre = stableOnChange.current) === null || _stableOnChange$curre === void 0 ? void 0 : _stableOnChange$curre.call(stableOnChange, value);
  }, [state]);
  React.useEffect(() => {
    const controlledValue = value !== undefined; // Uncontrolled -> Controlled
    // If the component prop is uncontrolled, the prop value should be undefined

    if (controlled.current === false && controlledValue) ; // Controlled -> Uncontrolled
    // If the component prop is controlled, the prop value should be defined


    if (controlled.current === true && !controlledValue) ;
  }, [name, value]);

  if (controlled.current === true) {
    return [value, setState];
  }

  return [state, setState];
}

export { useControllableState };
