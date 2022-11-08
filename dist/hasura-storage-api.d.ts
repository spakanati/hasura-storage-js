import { ApiDeleteParams, ApiDeleteResponse, ApiGetPresignedUrlParams, ApiGetPresignedUrlResponse, ApiUploadParams, ApiUploadResponse } from './utils/types';
/**
 * @internal
 * This is an internal class.
 */
export declare class HasuraStorageApi {
    private url;
    private httpClient;
    private accessToken?;
    private adminSecret?;
    constructor({ url }: {
        url: string;
    });
    upload(params: ApiUploadParams): Promise<ApiUploadResponse>;
    getPresignedUrl(params: ApiGetPresignedUrlParams): Promise<ApiGetPresignedUrlResponse>;
    delete(params: ApiDeleteParams): Promise<ApiDeleteResponse>;
    /**
     * Set the access token to use for authentication.
     *
     * @param accessToken Access token
     * @returns Hasura Storage API instance
     */
    setAccessToken(accessToken?: string): HasuraStorageApi;
    /**
     * Set the admin secret to use for authentication.
     *
     * @param adminSecret Hasura admin secret
     * @returns Hasura Storage API instance
     */
    setAdminSecret(adminSecret?: string): HasuraStorageApi;
    private generateUploadHeaders;
    private generateAuthHeaders;
}
//# sourceMappingURL=hasura-storage-api.d.ts.map