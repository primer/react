export declare type KeyPaths<O> = {
    [K in keyof O]: K extends string ? (O[K] extends Record<string, unknown> ? `${K}.${KeyPaths<O[K]>}` : `${K}`) : never;
}[keyof O];
