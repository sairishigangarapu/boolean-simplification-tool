"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"

type Problem = {
  id: string
  prompt: string
  answer: string
}

function genProblem(): Problem {
  // Simple random 2-var SOP exercise
  // e.g., F(A,B) = A'B + AB'
  const patterns = [
    { prompt: "Simplify F(A,B) = A'B + AB'", answer: "A ⊕ B" },
    { prompt: "Simplify F(A,B) = AB + AB'", answer: "A" },
    { prompt: "Simplify F(A,B) = A'B' + A'B", answer: "A'" },
    { prompt: "Simplify F(A,B) = AB + A'B", answer: "B" },
    { prompt: "Simplify F(A,B) = AB' + A'B' + AB", answer: "A + B'" },
  ]
  const p = patterns[Math.floor(Math.random() * patterns.length)]
  return { id: crypto.randomUUID(), ...p }
}

export default function PracticePage() {
  const [problem, setProblem] = useState<Problem>(genProblem())
  const [input, setInput] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const checkAnswer = () => {
    const normalize = (s: string) => s.trim().replace(/\s+/g, "").toLowerCase()
    setResult(normalize(input) === normalize(problem.answer) ? "Correct!" : "Try again")
  }

  const saveLocal = () => {
    const key = "practice-favorites"
    const current = JSON.parse(localStorage.getItem(key) || "[]")
    current.push(problem)
    localStorage.setItem(key, JSON.stringify(current))
    setResult("Saved locally to Favorites.")
  }

  // Placeholder: in future, save to Supabase table if exists
  const trySaveCloud = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      setResult("Please log in to save to cloud.")
      return
    }
    setResult("Cloud saving requires DB setup; coming soon.")
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-foreground mb-6">{"Practice Problems"}</h1>
      <section className="border rounded-lg p-4 bg-background text-foreground">
        <p className="mb-4">{problem.prompt}</p>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Your simplified answer"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border rounded-md px-3 py-2 bg-background text-foreground flex-1"
          />
          <button onClick={checkAnswer} className="rounded-md px-4 py-2 bg-foreground text-background">
            {"Check"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setProblem(genProblem())
              setInput("")
              setResult(null)
            }}
            className="rounded-md px-4 py-2 border"
          >
            {"New problem"}
          </button>
          <button onClick={saveLocal} className="rounded-md px-4 py-2 border">
            {"Save to Favorites (local)"}
          </button>
          <button onClick={trySaveCloud} className="rounded-md px-4 py-2 border">
            {"Save to Cloud"}
          </button>
        </div>
        {result && <p className="mt-3 text-sm">{result}</p>}
      </section>
      {/* ESA Practice Library callout */}
      <section className="mt-8 rounded-lg border p-4 bg-card text-card-foreground">
        <h2 className="text-xl font-medium">ESA Practice Library</h2>
        <p className="text-muted-foreground mt-1">Browse curated ESA question sets and save your favorites.</p>
        <Link
          href="/practice/library"
          className="mt-3 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          Open Library
        </Link>
      </section>
    </main>
  )
}
