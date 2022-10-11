'use strict';

var React = require('react');

const useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? React.useLayoutEffect : React.useEffect;

module.exports = useIsomorphicLayoutEffect;
