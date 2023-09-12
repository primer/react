// eslint-disable-next-line no-restricted-imports
import {useEffect, useLayoutEffect} from 'react'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
  typeof window.document !== 'undefined' &&
  // eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect

export default useIsomorphicLayoutEffect
