import { createBrowserClient } from "@supabase/ssr"

let __supabaseBrowser__: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (!__supabaseBrowser__) {
    __supabaseBrowser__ = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return __supabaseBrowser__
}

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
