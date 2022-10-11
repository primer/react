/// <reference types="react" />
import { FileType, UnifiedFileSelectResult } from '../hooks/useUnifiedFileSelect';
import { SyntheticChangeEmitter } from '../hooks/useSyntheticChange';
export type { FileType } from '../hooks/useUnifiedFileSelect';
declare type UploadProgress = [current: number, total: number];
declare type UseFileHandlingResult = UnifiedFileSelectResult & {
    errorMessage?: string;
    uploadProgress?: UploadProgress;
};
declare type UseFileHandlingProps = {
    repositoryId?: number;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    emitChange: SyntheticChangeEmitter;
    disabled?: boolean;
    value: string;
    onUploadFile?: (file: File) => Promise<FileUploadResult>;
    acceptedFileTypes?: FileType[];
};
export declare type FileUploadResult = {
    /** The URL of the uploaded file. `null` if the upoad failed (or reject the promise). */
    url: string;
    /**
     * The file that was uploaded. Typically the client-side detected name, size, and content
     * type can be unreliable, so your file upload service may provide more accurate data. By
     * receiving an updated File instance with the more accurate data, the Markdown editor can
     * make better decisions.
     */
    file: File;
};
export declare const useFileHandling: ({ emitChange, value, inputRef, disabled, onUploadFile, acceptedFileTypes }: UseFileHandlingProps) => UseFileHandlingResult | null;
