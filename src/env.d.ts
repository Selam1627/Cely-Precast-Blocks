/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Address the contact form opens a pre-filled email to. Public: bundled into the site. */
  readonly VITE_CONTACT_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
