"use client"

import { useEffect, useState } from "react"
import { getFavorites, removeFavorite } from "@/components/practice/use-favorites"

type PracticeFav = { id: string; prompt: string; answer: string }

export default function FavoritesPage() {
  const [esaFavs, setEsaFavs] = useState(getFavorites())
  const [practiceFavs, setPracticeFavs] = useState<PracticeFav[]>([])

  useEffect(() => {
    // Load legacy practice favorites
    const key = "practice-favorites"
    const data = JSON.parse(localStorage.getItem(key) || "[]")
    setPracticeFavs(data)
  }, [])

  const removePracticeFav = (id: string) => {
    const key = "practice-favorites"
    const next = practiceFavs.filter((f) => f.id !== id)
    setPracticeFavs(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  const removeEsaFav = (id: string) => {
    removeFavorite(id)
    setEsaFavs(getFavorites())
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-foreground mb-6">Favorites</h1>

      {/* ESA Library Favorites */}
      <section className="mb-10">
        <h2 className="text-xl font-medium mb-3">ESA Library Favorites</h2>
        {esaFavs.length === 0 ? (
          <p className="opacity-80">No ESA favorites yet.</p>
        ) : (
          <ul className="space-y-3">
            {esaFavs.map((f) => (
              <li key={f.id} className="border rounded-md p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{f.title || "Untitled Question"}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {f.session ? `${f.session}` : ""} {f.course ? `• ${f.course}` : ""}{" "}
                      {f.marks ? `• ${f.marks}` : ""}
                    </p>
                  </div>
                  <button onClick={() => removeEsaFav(f.id)} className="text-sm underline">
                    Remove
                  </button>
                </div>
                {f.body ? <p className="mt-2 text-sm leading-relaxed text-pretty">{f.body}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Practice Generator Favorites */}
      <section>
        <h2 className="text-xl font-medium mb-3">Practice Generator Favorites</h2>
        {practiceFavs.length === 0 ? (
          <p className="opacity-80">No practice generator favorites yet.</p>
        ) : (
          <ul className="space-y-3">
            {practiceFavs.map((f) => (
              <li key={f.id} className="border rounded-md p-3">
                <p className="mb-1">{f.prompt}</p>
                <p className="text-sm opacity-80">Answer: {f.answer}</p>
                <div className="mt-2">
                  <button onClick={() => removePracticeFav(f.id)} className="text-sm underline">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
