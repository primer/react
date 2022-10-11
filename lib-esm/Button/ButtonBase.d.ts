import { ComponentPropsWithRef } from 'react';
import { ForwardRefComponent as PolymorphicForwardRefComponent } from '../utils/polymorphic';
import { ButtonProps } from './types';
declare const ButtonBase: PolymorphicForwardRefComponent<"a" | "button", ButtonProps>;
export declare type ButtonBaseProps = ComponentPropsWithRef<typeof ButtonBase>;
export { ButtonBase };
