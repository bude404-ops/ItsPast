/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOC_API_URL?: string;
  readonly VITE_NARA_API_KEY?: string;
  readonly VITE_WIKIDATA_ENDPOINT?: string;
  readonly VITE_MAP_API_KEY?: string;
  readonly VITE_AI_PROVIDER_KEY?: string;
  readonly VITE_IMAGE_GENERATION_PROVIDER_KEY?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta { readonly env: ImportMetaEnv; }
