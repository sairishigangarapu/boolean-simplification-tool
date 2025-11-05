"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export type FavoriteItem = {
  id: string
  title?: string
  course?: string
  session?: string
  marks?: string
  body?: string
  meta?: Record<string, any>
}

const LOCAL_STORAGE_KEY = "esa_favorites_v1"

export function useFavoritesWithUser() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUser(user ? { id: user.id } : null)

        if (user) {
          // Load from Supabase
          const { data, error } = await supabase.from("user_favorites").select("*").eq("user_id", user.id)

          if (error) {
            console.error("[v0] Error loading favorites:", error)
            // Fall back to localStorage if Supabase fails
            const local = safeParse<FavoriteItem[]>(
              typeof window !== "undefined" ? window.localStorage.getItem(LOCAL_STORAGE_KEY) : null,
              [],
            )
            setFavorites(local)
          } else {
            const items: FavoriteItem[] =
              data?.map((row: any) => ({
                id: row.problem_id,
                ...row.item_data,
              })) || []
            setFavorites(items)
          }
        } else {
          // Not logged in - use localStorage
          const local = safeParse<FavoriteItem[]>(
            typeof window !== "undefined" ? window.localStorage.getItem(LOCAL_STORAGE_KEY) : null,
            [],
          )
          setFavorites(local)
        }
      } catch (error) {
        console.error("[v0] Failed to load favorites:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  return { favorites, user, isLoading }
}

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
  return safeParse<FavoriteItem[]>(window.localStorage.getItem(LOCAL_STORAGE_KEY), [])
}

export function isFavorite(id: string): boolean {
  if (typeof window === "undefined") return false
  const favs = getFavorites()
  return favs.some((f) => f.id === id)
}

export async function addFavorite(item: FavoriteItem) {
  if (typeof window === "undefined") return

  const supabase = getSupabaseBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Add to Supabase
    const { error } = await supabase.from("user_favorites").insert({
      user_id: user.id,
      problem_id: item.id,
      item_data: item,
    })

    if (error) {
      console.error("[v0] Error adding favorite:", error)
      // Fall back to localStorage
      const favs = getFavorites()
      if (!favs.find((f) => f.id === item.id)) {
        const next = [item, ...favs]
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next))
      }
    }
  } else {
    // Add to localStorage
    const favs = getFavorites()
    if (!favs.find((f) => f.id === item.id)) {
      const next = [item, ...favs]
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next))
    }
  }

  window.dispatchEvent(new CustomEvent("favorites:changed"))
}

export async function removeFavorite(id: string) {
  if (typeof window === "undefined") return

  const supabase = getSupabaseBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Remove from Supabase
    const { error } = await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("problem_id", id)

    if (error) {
      console.error("[v0] Error removing favorite:", error)
      // Fall back to localStorage
      const favs = getFavorites()
      const next = favs.filter((f) => f.id !== id)
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next))
    }
  } else {
    // Remove from localStorage
    const favs = getFavorites()
    const next = favs.filter((f) => f.id !== id)
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next))
  }

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
