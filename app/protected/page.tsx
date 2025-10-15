"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"

type User = {
  id: string
  email?: string
}

export default function ProtectedPage() {
  const supabase = useMemo(
    () => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),
    [],
  )

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const { data } = await supabase.auth.getUser()
        if (isMounted) setUser((data.user as any) ?? null)
      } catch (e) {
        console.log("[v0] protected: getUser error", (e as Error).message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setUser((sess?.user as any) ?? null)
    })
    return () => {
      isMounted = false
      sub?.subscription?.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-foreground/70">Checking authentication…</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Protected Area</h1>
        <p className="text-foreground/70">You must be logged in to view this page.</p>
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-foreground/5"
          >
            Go to Login
          </Link>
          <Link href="/" className="rounded-full border border-border px-4 py-2 text-sm hover:bg-foreground/5">
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Protected Area</h1>
        <p className="text-foreground/70">Welcome, {user.email ?? "user"}.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/favorites" className="rounded-lg border border-border p-6 hover:bg-foreground/5">
          <h3 className="text-lg font-medium text-foreground mb-1">Favorites</h3>
          <p className="text-sm text-foreground/70 leading-relaxed">Manage your saved circuits and problems.</p>
        </Link>
        <Link href="/practice" className="rounded-lg border border-border p-6 hover:bg-foreground/5">
          <h3 className="text-lg font-medium text-foreground mb-1">Practice</h3>
          <p className="text-sm text-foreground/70 leading-relaxed">Continue solving generated problems.</p>
        </Link>
      </section>
    </main>
  )
}
