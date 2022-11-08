import { InterpreterFrom } from 'xstate';
import { AnyFileList, FileItemRef, MultipleFilesUploadMachine } from '../machines';
import { NhostClientReturnType } from '../utils/types';
export interface MultipleUploadProgressState {
    /**
     * Returns `true` when the files are being uploaded.
     */
    isUploading: boolean;
    /**
     * Returns the overall progress of the upload, from 0 to 100. Returns null if the upload has not started yet.
     */
    progress: number | null;
}
export interface MultipleFilesHandlerResult {
    /**
     * The list of file uploads. The properties can be accessed through `item.getSnapshot()` of with the `useFileUploadItem` hook.
     */
    files: FileItemRef[];
    /**
     * Returns `true` when all upload request are processed, but at least one of them has failed.
     */
    isError: boolean;
    /**
     * Returns the list of file uploads that have failed
     */
    errors: FileItemRef[];
}
export interface MultipleFilesUploadState extends MultipleFilesHandlerResult, MultipleUploadProgressState {
    /**
     * Returns `true` when all the files have been successfully uploaded.
     */
    isUploaded: boolean;
}
export declare type UploadMultipleFilesActionParams = {
    files?: AnyFileList;
    bucketId?: string;
};
export declare const uploadMultipleFilesPromise: (nhost: NhostClientReturnType, service: InterpreterFrom<MultipleFilesUploadMachine>, params?: UploadMultipleFilesActionParams) => Promise<MultipleFilesHandlerResult>;
//# sourceMappingURL=multiple-files-upload.d.ts.map