'use strict';

var React = require('react');

/**
 * This hook will flash the scrollbars for a ref of a container that has scrollable overflow
 * @param scrollContainerRef The ref of the scrollable content
 */

function useScrollFlash(scrollContainerRef) {
  // https://adxlv.computer/projects/flash-scrollers/
  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const currentScroll = scrollContainer.scrollTop;
    const maxScroll = scrollContainer.scrollHeight;
    const altScroll = currentScroll < Math.min(1, maxScroll) ? currentScroll + 1 : currentScroll - 1;
    scrollContainer.scrollTop = altScroll;
    scrollContainer.scrollTop = currentScroll;
  }, [scrollContainerRef]);
}

module.exports = useScrollFlash;
