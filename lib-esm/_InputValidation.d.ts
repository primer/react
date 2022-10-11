import React from 'react';
import { SxProp } from './sx';
import { FormValidationStatus } from './utils/types/FormValidationStatus';
declare type Props = {
    id: string;
    validationStatus?: FormValidationStatus;
} & SxProp;
declare const InputValidation: React.FC<React.PropsWithChildren<Props>>;
export default InputValidation;
