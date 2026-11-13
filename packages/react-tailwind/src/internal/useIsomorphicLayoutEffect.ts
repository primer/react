'use client'

import React from 'react'

/** A layout effect in the browser and a plain effect on the server, where React warns about layout effects. */
export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect
