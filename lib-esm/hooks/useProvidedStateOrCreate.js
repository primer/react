import { useState, useCallback } from 'react';

/**
 * There are some situations where we want to give users the option to control state externally with their own state handlers
 * or default to using internal state handlers. Because of the 'rules-of-hooks', we cannot conditionally make a call to `React.useState`
 * only in the situations where the state is not provided as a prop.
 * This hook aims to encapsulate that logic, so the consumer doesn't need to be concerned with violating `rules-of-hooks`.
 * @param externalState The state to use - if undefined, will use the state from a call to React.useState
 * @param setExternalState The setState to use - if undefined, will use the setState from a call to React.useState
 * @param defaultState The defaultState to use, if using internal state.
 */

function useProvidedStateOrCreate(externalState, setExternalState, defaultState) {
  const [internalState, setInternalState] = useState(defaultState);
  const state = externalState !== null && externalState !== void 0 ? externalState : internalState;
  const setState = useCallback(s => {
    setInternalState(s);
    if (setExternalState) setExternalState(s);
  }, [setExternalState]);
  return [state, setState];
}

export { useProvidedStateOrCreate };
