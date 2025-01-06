export function parseSizeFromArgs<
  T extends Partial<Record<'size' | 'sizeAtNarrow' | 'sizeAtRegular' | 'sizeAtWide', number | undefined>>,
>({size, sizeAtNarrow, sizeAtRegular, sizeAtWide}: T) {
  return size && !(sizeAtNarrow || sizeAtRegular || sizeAtWide)
    ? size
    : {
        narrow: sizeAtNarrow,
        regular: sizeAtRegular,
        wide: sizeAtWide,
      }
}
