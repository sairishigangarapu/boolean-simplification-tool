"use client"

import { useState } from "react"

type FF = "SR" | "JK" | "D" | "T"

const excitationTables: Record<FF, { title: string; headers: string[]; rows: (string | number)[][] }> = {
  SR: {
    title: "SR Excitation Table (Q → Q+1)",
    headers: ["Q", "Q+1", "S", "R"],
    rows: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [1, 1, 0, 0],
    ],
  },
  JK: {
    title: "JK Excitation Table (Q → Q+1)",
    headers: ["Q", "Q+1", "J", "K"],
    rows: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [1, 1, 0, 0], // or 1,1 (toggle); simplified
    ],
  },
  D: {
    title: "D Excitation Table (Q → Q+1)",
    headers: ["Q", "Q+1", "D"],
    rows: [
      [0, 0, 0],
      [0, 1, 1],
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  T: {
    title: "T Excitation Table (Q → Q+1)",
    headers: ["Q", "Q+1", "T"],
    rows: [
      [0, 0, 0],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
  },
}

export default function FlipFlopConversionPage() {
  const [fromFF, setFromFF] = useState<FF>("JK")
  const [toFF, setToFF] = useState<FF>("D")

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-pretty">Flip-Flop Conversion Helper</h1>
        <p className="text-muted-foreground max-w-prose">
          Use excitation tables to derive the input equations required to convert one flip-flop type into another.
          Select the source and target types to view reference tables.
        </p>
      </header>

      <section className="flex flex-wrap items-center gap-3">
        <label className="text-sm">
          From:
          <select
            className="ml-2 border rounded-md px-2 py-1 bg-background text-foreground"
            value={fromFF}
            onChange={(e) => setFromFF(e.target.value as FF)}
          >
            <option value="SR">SR</option>
            <option value="JK">JK</option>
            <option value="D">D</option>
            <option value="T">T</option>
          </select>
        </label>
        <label className="text-sm">
          To:
          <select
            className="ml-2 border rounded-md px-2 py-1 bg-background text-foreground"
            value={toFF}
            onChange={(e) => setToFF(e.target.value as FF)}
          >
            <option value="SR">SR</option>
            <option value="JK">JK</option>
            <option value="D">D</option>
            <option value="T">T</option>
          </select>
        </label>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {[fromFF, toFF].map((ff) => {
          const t = excitationTables[ff]
          return (
            <div key={ff} className="border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/40">
                <h2 className="font-medium">{t.title}</h2>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      {t.headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row, i) => (
                      <tr key={i} className="border-t">
                        {row.map((cell, j) => (
                          <td key={`${i}-${j}`} className="px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-muted-foreground text-xs mt-3">
                  Note: Real conversions derive input equations (e.g., D = JQ' + K'Q) using K-maps over the excitation
                  table and desired state transitions.
                </p>
              </div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
