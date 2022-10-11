import React from 'react';
import styled from 'styled-components';
import sx from '../../sx.js';
import { Header } from './Header.js';

/**
 * Contract for props passed to the `Group` component.
 */

const StyledGroup = styled.div.withConfig({
  displayName: "Group__StyledGroup",
  componentId: "sc-1s2aw76-0"
})(["", ""], sx);
/**
 * Collects related `Items` in an `ActionList`.
 */

function Group({
  header,
  items,
  ...props
}) {
  return /*#__PURE__*/React.createElement(StyledGroup, props, header && /*#__PURE__*/React.createElement(Header, header), items);
}
Group.displayName = "Group";

export { Group };
