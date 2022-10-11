/// <reference types="react" />
import { UnderlineNavProps } from './UnderlineNav';
import { UnderlineNavItemProps } from './UnderlineNavItem';
declare const UnderlineNav: import("react").ForwardRefExoticComponent<UnderlineNavProps & import("react").RefAttributes<unknown>> & {
    Item: import("../utils/polymorphic").ForwardRefComponent<"a", UnderlineNavItemProps>;
};
export { UnderlineNav };
export type { UnderlineNavProps, UnderlineNavItemProps };
