import type React from 'react';
/**
 * Utility that mirrors the functionality of the `Box` component from
 * `@primer/react`. Used to create a styled component variant of a component
 * from `@primer/react` that no longer supports `sx` or other styled-system
 * props.
 *
 * Note: make sure to include #__PURE__ when using this function to create a
 * component. For example:
 *
 * ```tsx
 * const Link = \/*#__PURE__*\/ createStyledComponent(PrimerLink)
 * ```
 */
export declare function createStyledComponent<P>(Component: React.ComponentType<P>): import("styled-components").StyledComponent<React.ComponentType<P>, any, any, never>;
//# sourceMappingURL=createStyledComponent.d.ts.map