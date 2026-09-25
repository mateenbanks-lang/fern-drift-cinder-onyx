import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  vercel: {
    functions: {
      includes: [
        "_libs/pglite.wasm",
        "_libs/pglite.data"
      ]
    }
  }
});