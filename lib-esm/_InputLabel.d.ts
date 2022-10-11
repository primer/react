import React from 'react';
import { SxProp } from './sx';
declare type BaseProps = SxProp & {
    disabled?: boolean;
    required?: boolean;
    visuallyHidden?: boolean;
    id?: string;
};
declare type LabelProps = BaseProps & {
    htmlFor?: string;
    as?: 'label';
};
declare type LegendProps = BaseProps & {
    as: 'legend';
    htmlFor?: undefined;
};
declare type Props = LabelProps | LegendProps;
declare const InputLabel: React.FC<React.PropsWithChildren<Props>>;
export default InputLabel;
