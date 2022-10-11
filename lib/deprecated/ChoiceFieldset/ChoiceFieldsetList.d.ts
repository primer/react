import React from 'react';
export interface ChoiceFieldsetListProps {
    /**
     * Whether multiple items or a single item can be selected
     */
    selectionVariant?: 'single' | 'multiple';
}
declare const ChoiceFieldsetList: React.FC<React.PropsWithChildren<ChoiceFieldsetListProps>>;
export default ChoiceFieldsetList;
