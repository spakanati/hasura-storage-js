import { StorageDeleteParams, StorageDeleteResponse, StorageGetPresignedUrlParams, StorageGetPresignedUrlResponse, StorageGetUrlParams, StorageUploadFileParams, StorageUploadFormDataParams, StorageUploadResponse } from './utils/types';
interface NhostStorageConstructorParams {
    /**
     * Storage endpoint.
     */
    url: string;
    /**
     * Admin secret. When set, it is sent as an `x-hasura-admin-secret` header for all requests.
     */
    adminSecret?: string;
}
/**
 * @alias Storage
 */
export declare class HasuraStorageClient {
    readonly url: string;
    private api;
    constructor({ url, adminSecret }: NhostStorageConstructorParams);
    /**
     * Use `nhost.storage.upload` to upload a file.
     *
     * It's possible to use [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) or [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to upload a file. The `File` instance is only available in the browser while `FormData` with [`form-data`](https://www.npmjs.com/package/form-data) works both in the browser and in NodeJS (server).
     *
     * If no `bucketId` is specified the bucket `default` is used.
     *
     * @example
     *
     * Upload a file from a browser using `File`.
     *
     * ```ts
     * await nhost.storage.upload({ file })
     * ```
     *
     * Upload a file from a browser using `File` to a specific Bucket.
     *
      @example
     * ```ts
     * await nhost.storage.upload({ file, bucketId: '<Bucket-ID>' })
     * ```
     *
     * Upload a file from a server using `FormData` with [`form-data`](https://www.npmjs.com/package/form-data).
     *
     * @example
     * ```ts
     * const fd = new FormData()
     * fd.append('file', fs.createReadStream('./tests/assets/sample.pdf'))
     *
     * await storage.upload({
     *   formData: fd
     * })
     * ```
     *
     * @docs https://docs.nhost.io/reference/javascript/storage/upload
     */
    upload(params: StorageUploadFileParams): Promise<StorageUploadResponse>;
    upload(params: StorageUploadFormDataParams): Promise<StorageUploadResponse>;
    /**
     * @deprecated Use `nhost.storage.getPublicUrl()` instead.
     */
    getUrl(params: StorageGetUrlParams): string;
    /**
     * Use `nhost.storage.getPublicUrl` to get the public URL of a file. The public URL can be used for un-authenticated users to access files. To access public files the `public` role must have permissions to select the file in the `storage.files` table.
     *
     * @example
     * ```ts
     * const publicUrl = nhost.storage.getPublicUrl({ fileId: '<File-ID>' })
     * ```
     *
     * @docs https://docs.nhost.io/reference/javascript/storage/get-public-url
     */
    getPublicUrl(params: StorageGetUrlParams): string;
    /**
     * Use `nhost.storage.getPresignedUrl` to get a presigned URL of a file. To get a presigned URL the user must have permission to select the file in the `storage.files` table.
     *
     * @example
     * ```ts
     * const { presignedUrl, error} = await nhost.storage.getPresignedUrl({ fileId: '<File-ID>' })
     *
     * if (error) {
     *   throw error;
     * }
     *
     * console.log('url: ', presignedUrl.url)
     * console.log('expiration: ', presignedUrl.expiration)
     * ```
     *
     * @docs https://docs.nhost.io/reference/javascript/storage/get-presigned-url
     */
    getPresignedUrl(params: StorageGetPresignedUrlParams): Promise<StorageGetPresignedUrlResponse>;
    /**
     * Use `nhost.storage.delete` to delete a file. To delete a file the user must have permissions to delete the file in the `storage.files` table. Deleting the file using `nhost.storage.delete()` will delete both the file and its metadata.
     *
     * @example
     * ```ts
     * const { error } = await nhost.storage.delete({ fileId: 'uuid' })
     * ```
     *
     * @docs https://docs.nhost.io/reference/javascript/storage/delete
     */
    delete(params: StorageDeleteParams): Promise<StorageDeleteResponse>;
    /**
     * Use `nhost.storage.setAccessToken` to a set an access token to be used in subsequent storage requests. Note that if you're signin in users with `nhost.auth.signIn()` the access token will be set automatically.
     *
     * @example
     * ```ts
     * nhost.storage.setAccessToken('some-access-token')
     * ```
     *
     * @param accessToken Access token
     *
     * @docs https://docs.nhost.io/reference/javascript/storage/set-access-token
     */
    setAccessToken(accessToken?: string): HasuraStorageClient;
    /**
     * Use `nhost.storage.adminSecret` to set the admin secret to be used for subsequent storage requests. This is useful if you want to run storage in "admin mode".
     *
     * @example
     * ```ts
     * nhost.storage.setAdminSecret('some-admin-secret')
     * ```
     *
     * @param adminSecret Hasura admin secret
     *
     * @docs https://docs.nhost.io/reference/javascript/storage/set-admin-secret
     */
    setAdminSecret(adminSecret?: string): HasuraStorageClient;
}
export {};
//# sourceMappingURL=hasura-storage-client.d.ts.map