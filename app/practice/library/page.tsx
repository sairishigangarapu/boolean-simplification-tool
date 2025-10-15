"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { practiceSets } from "@/components/practice/problems-data"
import { getFavorites, addFavorite, removeFavorite, subscribeFavorites } from "@/components/practice/use-favorites"

export default function PracticeLibraryPage() {
  // Track current favorite IDs for fast lookups
  const [favIds, setFavIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const refresh = () => setFavIds(new Set(getFavorites().map((f) => f.id)))
    refresh()
    const unsub = subscribeFavorites(refresh)
    return () => unsub()
  }, [])

  const toggleFav = (p: any, setMeta: any) => {
    const item = {
      id: p.id,
      title: p.title,
      course: setMeta?.courseCode,
      session: setMeta?.session,
      marks: p.marks,
      body: p.body,
      meta: { tags: p.tags || [] },
    }
    if (favIds.has(p.id)) {
      removeFavorite(p.id)
    } else {
      addFavorite(item)
    }
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-balance">ESA Practice Library</h1>
        <p className="mt-2 text-muted-foreground">
          Curated practice sets from recent ESA papers. Browse by session and course set.
        </p>
      </header>

      <div className="grid gap-10">
        {practiceSets.map((set) => (
          <section key={set.id} className="rounded-xl border bg-card text-card-foreground p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h2 className="text-2xl font-medium">{set.session}</h2>
                <p className="text-muted-foreground">{set.courseCode}</p>
              </div>
              {set.totalMarks ? (
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
                  Total Marks: {set.totalMarks}
                </span>
              ) : null}
            </div>

            <ol className="mt-6 space-y-4">
              {set.problems.map((p, idx) => {
                const problemId = `${set.id}::${p.id}` // unique per set+question
                const isFav = favIds.has(problemId)
                return (
                  <li key={problemId} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium">
                          {idx + 1}. {p.title}
                        </h3>
                        {p.marks ? <p className="text-xs text-muted-foreground mt-1">{p.marks}</p> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        {p.tags && p.tags.length ? (
                          <div className="flex flex-wrap gap-1">
                            {p.tags.map((t: string) => (
                              <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        <button
                          onClick={() => {
                            const item = {
                              id: problemId,
                              title: p.title,
                              course: set.courseCode,
                              session: set.session,
                              marks: p.marks,
                              body: p.body,
                              meta: { tags: p.tags || [], originalId: p.id },
                            }
                            if (isFav) {
                              removeFavorite(problemId)
                            } else {
                              addFavorite(item)
                            }
                          }}
                          className={`rounded-md border px-3 py-1 text-xs ${
                            isFav ? "bg-foreground text-background" : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                          aria-pressed={isFav}
                        >
                          {isFav ? "Remove from Favorites" : "Save to Favorites"}
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-pretty">{p.body}</p>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>

      <footer className="mt-10">
        <Link
          href="/practice"
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          Back to Practice
        </Link>
      </footer>
    </main>
  )
}
