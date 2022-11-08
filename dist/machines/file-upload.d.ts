import { ErrorPayload } from '@nhost/core';
export declare type FileUploadContext = {
    progress: number | null;
    loaded: number;
    error: ErrorPayload | null;
    id?: string;
    bucketId?: string;
    file?: File;
};
export declare type FileUploadEvents = {
    type: 'ADD';
    file: File;
    id?: string;
    bucketId?: string;
    name?: string;
} | {
    type: 'UPLOAD';
    url: string;
    file?: File;
    id?: string;
    bucketId?: string;
    name?: string;
    accessToken?: string;
    adminSecret?: string;
} | {
    type: 'UPLOAD_PROGRESS';
    progress: number;
    loaded: number;
    additions: number;
} | {
    type: 'UPLOAD_DONE';
    id: string;
    bucketId: string;
} | {
    type: 'UPLOAD_ERROR';
    error: ErrorPayload;
} | {
    type: 'CANCEL';
} | {
    type: 'DESTROY';
};
export declare const INITIAL_FILE_CONTEXT: FileUploadContext;
export declare type FileUploadMachine = ReturnType<typeof createFileUploadMachine>;
export declare const createFileUploadMachine: () => import("xstate").StateMachine<FileUploadContext, any, {
    type: 'ADD';
    file: File;
    id?: string | undefined;
    bucketId?: string | undefined;
    name?: string | undefined;
} | {
    type: 'UPLOAD';
    url: string;
    file?: File | undefined;
    id?: string | undefined;
    bucketId?: string | undefined;
    name?: string | undefined;
    accessToken?: string | undefined;
    adminSecret?: string | undefined;
} | {
    type: 'UPLOAD_PROGRESS';
    progress: number;
    loaded: number;
    additions: number;
} | {
    type: 'UPLOAD_DONE';
    id: string;
    bucketId: string;
} | {
    type: 'UPLOAD_ERROR';
    error: ErrorPayload;
} | {
    type: 'CANCEL';
} | {
    type: 'DESTROY';
}, {
    value: any;
    context: FileUploadContext;
}, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("./file-upload.typegen").Typegen0, {
    type: 'ADD';
    file: File;
    id?: string | undefined;
    bucketId?: string | undefined;
    name?: string | undefined;
} | {
    type: 'UPLOAD';
    url: string;
    file?: File | undefined;
    id?: string | undefined;
    bucketId?: string | undefined;
    name?: string | undefined;
    accessToken?: string | undefined;
    adminSecret?: string | undefined;
} | {
    type: 'UPLOAD_PROGRESS';
    progress: number;
    loaded: number;
    additions: number;
} | {
    type: 'UPLOAD_DONE';
    id: string;
    bucketId: string;
} | {
    type: 'UPLOAD_ERROR';
    error: ErrorPayload;
} | {
    type: 'CANCEL';
} | {
    type: 'DESTROY';
}, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
//# sourceMappingURL=file-upload.d.ts.map