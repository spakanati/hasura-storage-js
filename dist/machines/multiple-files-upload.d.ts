import { ActorRefFrom } from 'xstate';
import { FileUploadMachine } from './file-upload';
export declare type FileItemRef = ActorRefFrom<FileUploadMachine>;
export declare type AnyFileList = File | File[] | FileList;
export declare type MultipleFilesUploadContext = {
    progress: number | null;
    files: FileItemRef[];
    loaded: number;
    total: number;
};
export declare type MultipleFilesUploadEvents = {
    type: 'ADD';
    files: AnyFileList;
    bucketId?: string;
} | {
    type: 'UPLOAD';
    url: string;
    files?: AnyFileList;
    bucketId?: string;
    accessToken?: string;
    adminSecret?: string;
} | {
    type: 'UPLOAD_PROGRESS';
    additions: number;
} | {
    type: 'UPLOAD_DONE';
} | {
    type: 'UPLOAD_ERROR';
} | {
    type: 'CANCEL';
} | {
    type: 'REMOVE';
} | {
    type: 'CLEAR';
};
export declare type MultipleFilesUploadMachine = ReturnType<typeof createMultipleFilesUploadMachine>;
export declare const createMultipleFilesUploadMachine: () => import("xstate").StateMachine<MultipleFilesUploadContext, any, {
    type: 'ADD';
    files: AnyFileList;
    bucketId?: string | undefined;
} | {
    type: 'UPLOAD';
    url: string;
    files?: AnyFileList | undefined;
    bucketId?: string | undefined;
    accessToken?: string | undefined;
    adminSecret?: string | undefined;
} | {
    type: 'UPLOAD_PROGRESS';
    additions: number;
} | {
    type: 'UPLOAD_DONE';
} | {
    type: 'UPLOAD_ERROR';
} | {
    type: 'CANCEL';
} | {
    type: 'REMOVE';
} | {
    type: 'CLEAR';
}, {
    value: any;
    context: MultipleFilesUploadContext;
}, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("./multiple-files-upload.typegen").Typegen0, {
    type: 'ADD';
    files: AnyFileList;
    bucketId?: string | undefined;
} | {
    type: 'UPLOAD';
    url: string;
    files?: AnyFileList | undefined;
    bucketId?: string | undefined;
    accessToken?: string | undefined;
    adminSecret?: string | undefined;
} | {
    type: 'UPLOAD_PROGRESS';
    additions: number;
} | {
    type: 'UPLOAD_DONE';
} | {
    type: 'UPLOAD_ERROR';
} | {
    type: 'CANCEL';
} | {
    type: 'REMOVE';
} | {
    type: 'CLEAR';
}, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
//# sourceMappingURL=multiple-files-upload.d.ts.map