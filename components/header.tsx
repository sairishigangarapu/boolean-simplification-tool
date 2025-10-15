import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import LogoutButton from "@/components/auth/logout-button"

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      <nav
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 text-card-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60 px-3 py-2"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="px-2 py-1 rounded-full font-semibold tracking-tight hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Boolean Simplification
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/kmap"
            className="px-2 py-1 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            K-Map
          </Link>
          <Link
            href="/circuits"
            className="px-2 py-1 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Circuits
          </Link>
          <Link
            href="/practice"
            className="px-2 py-1 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Practice
          </Link>
          <Link
            href="/favorites"
            className="px-2 py-1 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Favorites
          </Link>
          <Link
            href="/protected"
            className="px-2 py-1 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Protected
          </Link>
        </div>

        <div className="ml-2 flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground px-2 py-1 rounded-full">
                {user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
