export namespace animation {
    const easeOutCubic: string;
}
export const borderWidths: (string | number)[];
export const breakpoints: string[];
export namespace fonts {
    const normal: any;
    const mono: any;
}
export const fontSizes: string[];
export namespace fontWeights {
    export const light: number;
    const normal_1: number;
    export { normal_1 as normal };
    export const semibold: number;
    export const bold: number;
}
export const lineHeights: {
    condensedUltra: number;
    condensed: number;
    default: number;
};
export const radii: string[];
export namespace sizes {
    const small: string;
    const medium: string;
    const large: string;
    const xlarge: string;
}
export const space: string[];
/**
 * @type Record<keyof typeof primitives.colors, Record<'colors' | 'shadows', Partial<typeof primitives.colors.light>>
 */
export const colorSchemes: Record<keyof typeof primitives.colors, Record<'colors' | 'shadows', Partial<typeof primitives.colors.light>>>;
import { default as primitives } from "@primer/primitives";
