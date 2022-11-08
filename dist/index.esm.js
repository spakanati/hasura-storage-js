var L = Object.defineProperty;
var _ = (r, e, t) => e in r ? L(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var c = (r, e, t) => (_(r, typeof e != "symbol" ? e + "" : e, t), t);
import D from "axios";
import R from "form-data";
import { createMachine as O, assign as n, spawn as T, send as f, actions as I } from "xstate";
class k {
  constructor({ url: e }) {
    c(this, "url");
    c(this, "httpClient");
    c(this, "accessToken");
    c(this, "adminSecret");
    this.url = e, this.httpClient = D.create({
      baseURL: this.url,
      maxBodylength: 1 / 0
    });
  }
  async upload(e) {
    const { formData: t } = e;
    try {
      return { fileMetadata: (await this.httpClient.post("/files", t, {
        headers: {
          ...this.generateUploadHeaders(e),
          ...this.generateAuthHeaders(),
          "Content-Type": "multipart/form-data"
        }
      })).data, error: null };
    } catch (s) {
      return { fileMetadata: null, error: s };
    }
  }
  async getPresignedUrl(e) {
    try {
      const { fileId: t } = e;
      return { presignedUrl: (await this.httpClient.get(`/files/${t}/presignedurl`, {
        headers: {
          ...this.generateAuthHeaders()
        }
      })).data, error: null };
    } catch (t) {
      return { presignedUrl: null, error: t };
    }
  }
  async delete(e) {
    try {
      const { fileId: t } = e;
      return await this.httpClient.delete(`/files/${t}`, {
        headers: {
          ...this.generateAuthHeaders()
        }
      }), { error: null };
    } catch (t) {
      return { error: t };
    }
  }
  setAccessToken(e) {
    return this.accessToken = e, this;
  }
  setAdminSecret(e) {
    return this.adminSecret = e, this;
  }
  generateUploadHeaders(e) {
    const { bucketId: t, name: s, id: a } = e, i = {};
    return t && (i["x-nhost-bucket-id"] = t), a && (i["x-nhost-file-id"] = a), s && (i["x-nhost-file-name"] = s), i;
  }
  generateAuthHeaders() {
    return !this.adminSecret && !this.accessToken ? null : this.adminSecret ? {
      "x-hasura-admin-secret": this.adminSecret
    } : {
      Authorization: `Bearer ${this.accessToken}`
    };
  }
}
class F {
  constructor({ url: e, adminSecret: t }) {
    c(this, "url");
    c(this, "api");
    this.url = e, this.api = new k({ url: e }), this.setAdminSecret(t);
  }
  async upload(e) {
    let t;
    "file" in e ? (t = new R(), t.append("file", e.file)) : t = e.formData;
    const { fileMetadata: s, error: a } = await this.api.upload({
      ...e,
      formData: t
    });
    return a ? { fileMetadata: null, error: a } : s ? { fileMetadata: s, error: null } : { fileMetadata: null, error: new Error("Invalid file returned") };
  }
  getUrl(e) {
    return this.getPublicUrl(e);
  }
  getPublicUrl(e) {
    const { fileId: t } = e;
    return `${this.url}/files/${t}`;
  }
  async getPresignedUrl(e) {
    const { presignedUrl: t, error: s } = await this.api.getPresignedUrl(e);
    return s ? { presignedUrl: null, error: s } : t ? { presignedUrl: t, error: null } : { presignedUrl: null, error: new Error("Invalid file id") };
  }
  async delete(e) {
    const { error: t } = await this.api.delete(e);
    return t ? { error: t } : { error: null };
  }
  setAccessToken(e) {
    return this.api.setAccessToken(e), this;
  }
  setAdminSecret(e) {
    return this.api.setAdminSecret(e), this;
  }
}
const S = { progress: null, loaded: 0, error: null }, C = () => O(
  {
    predictableActionArguments: !0,
    schema: {
      context: {},
      events: {}
    },
    tsTypes: {},
    context: { ...S },
    initial: "idle",
    on: {
      DESTROY: { actions: "sendDestroy", target: "stopped" }
    },
    states: {
      idle: {
        on: {
          ADD: { actions: "addFile" },
          UPLOAD: { cond: "hasFile", target: "uploading" }
        }
      },
      uploading: {
        entry: "resetProgress",
        on: {
          UPLOAD_PROGRESS: { actions: ["incrementProgress", "sendProgress"] },
          UPLOAD_DONE: "uploaded",
          UPLOAD_ERROR: "error",
          CANCEL: "idle"
        },
        invoke: { src: "uploadFile" }
      },
      uploaded: { entry: ["setFileMetadata", "sendDone"] },
      error: { entry: ["setError", "sendError"] },
      stopped: { type: "final" }
    }
  },
  {
    guards: {
      hasFile: (r, e) => !!r.file || !!e.file
    },
    actions: {
      incrementProgress: n({
        loaded: (r, { loaded: e }) => e,
        progress: (r, { progress: e }) => e
      }),
      setFileMetadata: n({
        id: (r, { id: e }) => e,
        bucketId: (r, { bucketId: e }) => e,
        progress: (r) => 100
      }),
      setError: n({ error: (r, { error: e }) => e }),
      sendProgress: () => {
      },
      sendError: () => {
      },
      sendDestroy: () => {
      },
      sendDone: () => {
      },
      resetProgress: n({ progress: (r) => null, loaded: (r) => 0 }),
      addFile: n({
        file: (r, { file: e }) => e,
        bucketId: (r, { bucketId: e }) => e,
        id: (r, { id: e }) => e
      })
    },
    services: {
      uploadFile: (r, e) => (t) => {
        const s = {
          "Content-Type": "multipart/form-data"
        }, a = e.id || r.id;
        a && (s["x-nhost-file-id"] = a);
        const i = e.bucketId || r.bucketId;
        i && (s["x-nhost-bucket-id"] = i);
        const d = e.file || r.file;
        s["x-nhost-file-name"] = e.name || d.name;
        const u = new FormData();
        u.append("file", d), e.adminSecret && (s["x-hasura-admin-secret"] = e.adminSecret), e.accessToken && (s.Authorization = `Bearer ${e.accessToken}`);
        let h = 0;
        const A = new AbortController();
        return D.post(e.url + "/files", u, {
          headers: s,
          signal: A.signal,
          onUploadProgress: (o) => {
            const l = Math.round(o.loaded * d.size / o.total), p = l - h;
            h = l, t({
              type: "UPLOAD_PROGRESS",
              progress: Math.round(l * 100 / o.total),
              loaded: l,
              additions: p
            });
          }
        }).then(({ data: { id: o, bucketId: l } }) => {
          t({ type: "UPLOAD_DONE", id: o, bucketId: l });
        }).catch(({ response: o, message: l }) => {
          var p, P, U, y, E;
          t({
            type: "UPLOAD_ERROR",
            error: {
              status: (p = o == null ? void 0 : o.status) != null ? p : 0,
              message: ((U = (P = o == null ? void 0 : o.data) == null ? void 0 : P.error) == null ? void 0 : U.message) || l,
              error: ((E = (y = o == null ? void 0 : o.data) == null ? void 0 : y.error) == null ? void 0 : E.message) || l
            }
          });
        }), () => {
          A.abort();
        };
      }
    }
  }
), { pure: m, sendParent: g } = I, N = () => O(
  {
    id: "files-list",
    schema: {
      context: {},
      events: {}
    },
    tsTypes: {},
    predictableActionArguments: !0,
    context: {
      progress: null,
      files: [],
      loaded: 0,
      total: 0
    },
    initial: "idle",
    on: {
      UPLOAD: { cond: "hasFileToDownload", actions: "addItem", target: "uploading" },
      ADD: { actions: "addItem" },
      REMOVE: { actions: "removeItem" }
    },
    states: {
      idle: {
        entry: ["resetProgress", "resetLoaded", "resetTotal"],
        on: {
          CLEAR: { actions: "clearList", target: "idle" }
        }
      },
      uploading: {
        entry: ["upload", "startProgress", "resetLoaded", "resetTotal"],
        on: {
          UPLOAD_PROGRESS: { actions: ["incrementProgress"] },
          UPLOAD_DONE: [
            { cond: "isAllUploaded", target: "uploaded" },
            { cond: "isAllUploadedOrError", target: "error" }
          ],
          UPLOAD_ERROR: [
            { cond: "isAllUploaded", target: "uploaded" },
            { cond: "isAllUploadedOrError", target: "error" }
          ],
          CANCEL: { actions: "cancel", target: "idle" }
        }
      },
      uploaded: {
        entry: "setUploaded",
        on: {
          CLEAR: { actions: "clearList", target: "idle" }
        }
      },
      error: {
        on: {
          CLEAR: { actions: "clearList", target: "idle" }
        }
      }
    }
  },
  {
    guards: {
      hasFileToDownload: (r, e) => r.files.some((t) => t.getSnapshot().matches("idle")) || !!e.files,
      isAllUploaded: (r) => r.files.every((e) => {
        var t;
        return (t = e.getSnapshot()) == null ? void 0 : t.matches("uploaded");
      }),
      isAllUploadedOrError: (r) => r.files.every((e) => {
        const t = e.getSnapshot();
        return (t == null ? void 0 : t.matches("error")) || (t == null ? void 0 : t.matches("uploaded"));
      })
    },
    actions: {
      incrementProgress: n((r, e) => {
        const t = r.loaded + e.additions, s = Math.round(t * 100 / r.total);
        return { ...r, loaded: t, progress: s };
      }),
      setUploaded: n({
        progress: (r) => 100,
        loaded: ({ files: r }) => r.map((e) => e.getSnapshot()).filter((e) => e.matches("uploaded")).reduce((e, t) => {
          var s;
          return e + ((s = t.context.file) == null ? void 0 : s.size);
        }, 0)
      }),
      resetTotal: n({
        total: ({ files: r }) => r.map((e) => e.getSnapshot()).filter((e) => !e.matches("uploaded")).reduce((e, t) => {
          var s;
          return e + ((s = t.context.file) == null ? void 0 : s.size);
        }, 0)
      }),
      resetLoaded: n({ loaded: (r) => 0 }),
      startProgress: n({ progress: (r) => 0 }),
      resetProgress: n({ progress: (r) => null }),
      addItem: n((r, { files: e, bucketId: t }) => {
        const s = e ? Array.isArray(e) ? e : "length" in e ? Array.from(e) : [e] : [], a = r.total + s.reduce((d, u) => d + u.size, 0), i = Math.round(r.loaded * 100 / a);
        return {
          files: [
            ...r.files,
            ...s.map(
              (d) => T(
                C().withConfig({
                  actions: {
                    sendProgress: g((u, { additions: h }) => ({
                      type: "UPLOAD_PROGRESS",
                      additions: h
                    })),
                    sendDone: g("UPLOAD_DONE"),
                    sendError: g("UPLOAD_ERROR"),
                    sendDestroy: g("REMOVE")
                  }
                }).withContext({ ...S, file: d, bucketId: t }),
                { sync: !0 }
              )
            )
          ],
          total: a,
          loaded: r.loaded,
          progress: i
        };
      }),
      removeItem: n({
        files: (r) => r.files.filter((e) => {
          var s, a;
          const t = (s = e.getSnapshot()) == null ? void 0 : s.matches("stopped");
          return t && ((a = e.stop) == null || a.call(e)), !t;
        })
      }),
      clearList: m(
        (r) => r.files.map((e) => f({ type: "DESTROY" }, { to: e.id }))
      ),
      upload: m((r, e) => r.files.map((t) => f(e, { to: t.id }))),
      cancel: m(
        (r) => r.files.map((e) => f({ type: "CANCEL" }, { to: e.id }))
      )
    }
  }
), H = async (r, e, t) => new Promise((s) => {
  e.send({
    type: "UPLOAD",
    url: r.storage.url,
    accessToken: r.auth.getAccessToken(),
    adminSecret: r.adminSecret,
    ...t
  }), e.subscribe((a) => {
    var i;
    a.matches("error") ? s({
      error: a.context.error,
      isError: !0,
      isUploaded: !1
    }) : a.matches("uploaded") && s({
      error: null,
      isError: !1,
      isUploaded: !0,
      id: a.context.id,
      bucketId: a.context.id,
      name: (i = a.context.file) == null ? void 0 : i.name
    });
  });
}), $ = async (r, e, t) => new Promise((s) => {
  e.send({
    type: "UPLOAD",
    url: r.storage.url,
    accessToken: r.auth.getAccessToken(),
    adminSecret: r.adminSecret,
    bucketId: t == null ? void 0 : t.bucketId,
    files: t == null ? void 0 : t.files
  }), e.onTransition((a) => {
    a.matches("error") ? s({
      errors: a.context.files.filter((i) => {
        var d;
        return (d = i.getSnapshot()) == null ? void 0 : d.context.error;
      }),
      isError: !0,
      files: []
    }) : a.matches("uploaded") && s({ errors: [], isError: !1, files: a.context.files });
  });
});
export {
  k as HasuraStorageApi,
  F as HasuraStorageClient,
  S as INITIAL_FILE_CONTEXT,
  C as createFileUploadMachine,
  N as createMultipleFilesUploadMachine,
  H as uploadFilePromise,
  $ as uploadMultipleFilesPromise
};
//# sourceMappingURL=index.esm.js.map
