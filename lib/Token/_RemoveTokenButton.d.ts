import React from 'react';
import { SxProp } from '../sx';
import { ComponentProps } from '../utils/types';
import { TokenSizeKeys } from './TokenBase';
interface TokenButtonProps {
    borderOffset?: number;
    size?: TokenSizeKeys;
    isParentInteractive?: boolean;
}
declare const StyledTokenButton: import("styled-components").StyledComponent<"span", any, TokenButtonProps & SxProp, never>;
declare const RemoveTokenButton: React.FC<React.PropsWithChildren<ComponentProps<typeof StyledTokenButton>>>;
export default RemoveTokenButton;
