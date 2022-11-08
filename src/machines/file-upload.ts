import axios, { AxiosError, AxiosRequestHeaders } from 'axios'
import { assign, createMachine } from 'xstate'

import { ErrorPayload } from '@nhost/core'

export type FileUploadContext = {
  progress: number | null
  loaded: number
  error: ErrorPayload | null
  id?: string
  bucketId?: string
  file?: File
}

export type FileUploadEvents =
  | { type: 'ADD'; file: File; id?: string; bucketId?: string; name?: string }
  | {
      type: 'UPLOAD'
      url: string
      file?: File
      id?: string
      bucketId?: string
      name?: string
      accessToken?: string
      adminSecret?: string
    }
  | { type: 'UPLOAD_PROGRESS'; progress: number; loaded: number; additions: number }
  | { type: 'UPLOAD_DONE'; id: string; bucketId: string }
  | { type: 'UPLOAD_ERROR'; error: ErrorPayload }
  | { type: 'CANCEL' }
  | { type: 'DESTROY' }

export const INITIAL_FILE_CONTEXT: FileUploadContext = { progress: null, loaded: 0, error: null }

export type FileUploadMachine = ReturnType<typeof createFileUploadMachine>
export const createFileUploadMachine = () =>
  createMachine(
    {
      predictableActionArguments: true,
      schema: {
        context: {} as FileUploadContext,
        events: {} as FileUploadEvents
      },
      tsTypes: {} as import('./file-upload.typegen').Typegen0,
      context: { ...INITIAL_FILE_CONTEXT },
      initial: 'idle',
      on: {
        DESTROY: { actions: 'sendDestroy', target: 'stopped' }
      },
      states: {
        idle: {
          on: {
            ADD: { actions: 'addFile' },
            UPLOAD: { cond: 'hasFile', target: 'uploading' }
          }
        },
        uploading: {
          entry: 'resetProgress',
          on: {
            UPLOAD_PROGRESS: { actions: ['incrementProgress', 'sendProgress'] },
            UPLOAD_DONE: 'uploaded',
            UPLOAD_ERROR: 'error',
            CANCEL: 'idle'
          },
          invoke: { src: 'uploadFile' }
        },
        uploaded: { entry: ['setFileMetadata', 'sendDone'] },
        error: { entry: ['setError', 'sendError'] },
        stopped: { type: 'final' }
      }
    },
    {
      guards: {
        hasFile: (context, event) => !!context.file || !!event.file
      },

      actions: {
        incrementProgress: assign({
          loaded: (_, { loaded }) => loaded,
          progress: (_, { progress }) => progress
        }),
        setFileMetadata: assign({
          id: (_, { id }) => id,
          bucketId: (_, { bucketId }) => bucketId,
          progress: (_) => 100
        }),
        setError: assign({ error: (_, { error }) => error }),
        sendProgress: () => {},
        sendError: () => {},
        sendDestroy: () => {},
        sendDone: () => {},
        resetProgress: assign({ progress: (_) => null, loaded: (_) => 0 }),
        addFile: assign({
          file: (_, { file }) => file,
          bucketId: (_, { bucketId }) => bucketId,
          id: (_, { id }) => id
        })
      },
      services: {
        uploadFile: (context, event) => (callback) => {
          const headers: AxiosRequestHeaders = {
            'Content-Type': 'multipart/form-data'
          }
          const fileId = event.id || context.id
          if (fileId) {
            headers['x-nhost-file-id'] = fileId
          }
          const bucketId = event.bucketId || context.bucketId
          if (bucketId) {
            headers['x-nhost-bucket-id'] = bucketId
          }
          const file = (event.file || context.file)!
          headers['x-nhost-file-name'] = event.name || file.name
          const data = new FormData()
          data.append('file', file)
          if (event.adminSecret) {
            headers['x-hasura-admin-secret'] = event.adminSecret
          }
          if (event.accessToken) {
            headers['Authorization'] = `Bearer ${event.accessToken}`
          }
          let currentLoaded = 0
          const controller = new AbortController()
          axios
            .post<{
              bucketId: string
              createdAt: string
              etag: string
              id: string
              isUploaded: true
              mimeType: string
              name: string
              size: number
              updatedAt: string
              uploadedByUserId: string
            }>(event.url + '/files', data, {
              headers,
              signal: controller.signal,
              onUploadProgress: (event: ProgressEvent) => {
                const loaded = Math.round((event.loaded * file.size!) / event.total)
                const additions = loaded - currentLoaded
                currentLoaded = loaded
                callback({
                  type: 'UPLOAD_PROGRESS',
                  progress: Math.round((loaded * 100) / event.total),
                  loaded,
                  additions
                })
              }
            })
            .then(({ data: { id, bucketId } }) => {
              callback({ type: 'UPLOAD_DONE', id, bucketId })
            })
            .catch(({ response, message }: AxiosError<{ error?: { message: string } }>) => {
              callback({
                type: 'UPLOAD_ERROR',
                error: {
                  status: response?.status ?? 0,
                  message: response?.data?.error?.message || message,
                  // TODO errors from hasura-storage are not codified
                  error: response?.data?.error?.message || message
                }
              })
            })

          return () => {
            controller.abort()
          }
        }
      }
    }
  )
