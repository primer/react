import React from 'react';
import { MenuContextProps } from '../ActionMenu';
/**
 * Keyboard navigation is a mix of 4 hooks
 * 1. useMenuInitialFocus
 * 2. useTypeaheadFocus
 * 3. useCloseMenuOnTab
 * 4. useMoveFocusToMenuItem
 */
export declare const useMenuKeyboardNavigation: (open: boolean, onClose: MenuContextProps['onClose'], containerRef: React.RefObject<HTMLElement>, anchorRef: React.RefObject<HTMLElement>) => void;
