/// <reference types="hoist-non-react-statics" />
import { SxProp } from '../sx';
import { ComponentProps } from '../utils/types';
declare const FormGroup: import("styled-components").StyledComponent<"div", any, SxProp, never>;
/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */
declare const FormGroupLabel: import("styled-components").StyledComponent<"label", any, SxProp, never>;
export declare type FormGroupProps = ComponentProps<typeof FormGroup>;
export declare type FormGroupLabelProps = ComponentProps<typeof FormGroupLabel>;
declare const _default: string & import("styled-components").StyledComponentBase<"div", any, SxProp, never> & import("hoist-non-react-statics").NonReactStatics<never, {}> & {
    Label: import("styled-components").StyledComponent<"label", any, SxProp, never>;
};
/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */
export default _default;
