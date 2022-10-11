import React from 'react';
import type { AnchorPosition, PositionSettings } from '@primer/behaviors';
export interface AnchoredPositionHookSettings extends Partial<PositionSettings> {
    floatingElementRef?: React.RefObject<Element>;
    anchorElementRef?: React.RefObject<Element>;
}
/**
 * Calculates the top and left values for an absolutely-positioned floating element
 * to be anchored to some anchor element. Returns refs for the floating element
 * and the anchor element, along with the position.
 * @param settings Settings for calculating the anchored position.
 * @param dependencies Dependencies to determine when to re-calculate the position.
 * @returns An object of {top: number, left: number} to absolutely-position the
 * floating element.
 */
export declare function useAnchoredPosition(settings?: AnchoredPositionHookSettings, dependencies?: React.DependencyList): {
    floatingElementRef: React.RefObject<Element>;
    anchorElementRef: React.RefObject<Element>;
    position: AnchorPosition | undefined;
};
