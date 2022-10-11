import React from 'react';
/** createSlots is a factory that can create a
 *  typesafe Slots + Slot pair to use in a component definition
 *  For example: ActionList.Item uses createSlots to get a Slots wrapper
 *  + Slot component that is used by LeadingVisual, Description
 */
declare const createSlots: <SlotNames extends string>(slotNames: SlotNames[]) => {
    Slots: React.FC<React.PropsWithChildren<{
        context?: Record<string, unknown> | undefined;
        children: (slots: { [key in SlotNames]?: React.ReactNode; }) => React.ReactNode;
    }>>;
    Slot: React.FC<React.PropsWithChildren<{
        name: SlotNames;
        children: React.ReactNode;
    }>>;
};
export default createSlots;
