import type { Plugin } from 'rollup';
import postcss from 'postcss';
import postcssModules from 'postcss-modules';
interface ImportCSSOptions {
    /**
     * Provide the root directory for your package. This is used to calculate the
     * relative path for generated CSS files
     */
    modulesRoot: string;
    /**
     * Optionally provide an array of postcss plugins to use during CSS
     * compilation.
     */
    postcssPlugins?: Array<postcss.AcceptedPlugin>;
    /**
     * Optionally provide options to pass forward to `postcss-modules` when
     * compiling CSS
     */
    postcssModulesOptions?: Parameters<typeof postcssModules>[0];
}
export declare function importCSS(options: ImportCSSOptions): Plugin;
export {};
//# sourceMappingURL=index.d.ts.map