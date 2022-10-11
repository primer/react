import React from 'react';
import styled from 'styled-components';
import { get } from '../../constants.js';

const StyledDivider = styled.div.withConfig({
  displayName: "Divider__StyledDivider",
  componentId: "sc-1s7tlfq-0"
})(["height:1px;background:", ";margin-top:calc(", " - 1px);margin-bottom:", ";"], get('colors.border.muted'), get('space.2'), get('space.2'));
/**
 * Visually separates `Item`s or `Group`s in an `ActionList`.
 */

function Divider() {
  return /*#__PURE__*/React.createElement(StyledDivider, null);
}
Divider.displayName = "Divider";

/**
 * `Divider` fulfills the `ItemPropsWithCustomRenderer` contract,
 * so it can be used inline in an `ActionList`’s `items` prop.
 * In other words, `items={[ActionList.Divider]}` is supported as a concise
 * alternative to `items={[{renderItem: () => <ActionList.Divider />}]}`.
 */
Divider.renderItem = Divider;

export { Divider, StyledDivider };
