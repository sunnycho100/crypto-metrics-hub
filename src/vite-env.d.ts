/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_NEWS_API_KEY?: string;
  readonly VITE_CRYPTOPANIC_API_KEY?: string;
  readonly VITE_CRYPTOQUANT_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
