import { InterpreterFrom } from 'xstate';
import { ActionErrorState } from '@nhost/core';
import { FileItemRef, FileUploadMachine } from '../machines';
import { NhostClientReturnType, StorageUploadFileParams } from '../utils/types';
export interface UploadProgressState {
    /**
     * Returns `true` when the file is being uploaded.
     */
    isUploading: boolean;
    /**
     * Returns the progress of the upload, from 0 to 100. Returns null if the upload has not started yet.
     */
    progress: number | null;
}
export interface UploadFileHandlerResult extends ActionErrorState {
    /**
     * Returns `true` when the file has been successfully uploaded.
     */
    isUploaded: boolean;
    /**
     * Returns the id of the file.
     */
    id?: string;
    /**
     * Returns the bucket id.
     */
    bucketId?: string;
    /**
     * Returns the name of the file.
     */
    name?: string;
}
export interface FileUploadState extends UploadFileHandlerResult, UploadProgressState {
}
export declare const uploadFilePromise: (nhost: NhostClientReturnType, interpreter: FileItemRef | InterpreterFrom<FileUploadMachine>, params: Partial<StorageUploadFileParams>) => Promise<UploadFileHandlerResult>;
//# sourceMappingURL=file-upload.d.ts.map