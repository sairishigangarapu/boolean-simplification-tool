"use client"

export type FavoriteItem = {
  id: string
  title?: string
  course?: string
  session?: string
  marks?: string
  body?: string
  meta?: Record<string, any>
}

const STORAGE_KEY = "esa_favorites_v1"

function safeParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback
  try {
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return []
  return safeParse<FavoriteItem[]>(window.localStorage.getItem(STORAGE_KEY), [])
}

export function isFavorite(id: string): boolean {
  if (typeof window === "undefined") return false
  const favs = getFavorites()
  return favs.some((f) => f.id === id)
}

export function addFavorite(item: FavoriteItem) {
  if (typeof window === "undefined") return
  const favs = getFavorites()
  if (favs.find((f) => f.id === item.id)) return
  const next = [item, ...favs]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent("favorites:changed"))
}

export function removeFavorite(id: string) {
  if (typeof window === "undefined") return
  const favs = getFavorites()
  const next = favs.filter((f) => f.id !== id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent("favorites:changed"))
}

export function subscribeFavorites(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const handler = () => callback()
  window.addEventListener("favorites:changed", handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener("favorites:changed", handler)
    window.removeEventListener("storage", handler)
  }
}

// Simple stable id generator from strings
export function makeIdFrom(parts: Array<string | undefined | null>): string {
  const s = parts.filter(Boolean).join(" | ")
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return "p_" + Math.abs(h).toString(36)
}
