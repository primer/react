import React from 'react';
export declare type PaginationProps = {
    theme?: Record<string, unknown>;
    pageCount: number;
    currentPage: number;
    onPageChange?: (e: React.MouseEvent, n: number) => void;
    hrefBuilder?: (n: number) => string;
    marginPageCount: number;
    showPages?: boolean;
    surroundingPageCount?: number;
};
declare function Pagination({ theme, pageCount, currentPage, onPageChange, hrefBuilder, marginPageCount, showPages, surroundingPageCount, ...rest }: PaginationProps): JSX.Element;
declare namespace Pagination {
    var defaultProps: {
        hrefBuilder: typeof defaultHrefBuilder;
        marginPageCount: number;
        onPageChange: typeof noop;
        showPages: boolean;
        surroundingPageCount: number;
    };
}
declare function defaultHrefBuilder(pageNum: number): string;
declare function noop(): void;
export default Pagination;
