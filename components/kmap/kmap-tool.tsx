"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CellState = "0" | "1" | "X"

const VAR_LETTERS = ["A", "B", "C", "D", "E", "F"] as const

function grayCode(bits: number): string[] {
  if (bits <= 0) return [""] // length 1 sequence of empty string
  let seq = ["0", "1"]
  for (let b = 2; b <= bits; b++) {
    const rev = [...seq].reverse()
    seq = seq.map((s) => "0" + s).concat(rev.map((s) => "1" + s))
  }
  return seq
}

function grayToBinary(gray: string): string {
  if (gray.length === 0) return ""
  let binary = gray[0]
  for (let i = 1; i < gray.length; i++) {
    const prev = binary[i - 1]
    const g = gray[i]
    // XOR previous binary with current gray bit
    binary += prev === g ? "0" : "1"
  }
  return binary
}

function indexFromBits(bits: string): number {
  return Number.parseInt(bits || "0", 2)
}

function canonicalProduct(bits: string, n: number): string {
  // bits length should be n
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    const letter = VAR_LETTERS[i]
    out.push(bits[i] === "1" ? letter : `${letter}'`)
  }
  return out.join("")
}

function makeGrid(rows: number, cols: number): CellState[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => "0"))
}

export default function KMapTool() {
  const [nVars, setNVars] = useState<number>(4)
  const colVars = Math.ceil(nVars / 2)
  const rowVars = Math.floor(nVars / 2)

  const rowGray = useMemo(() => grayCode(rowVars), [rowVars])
  const colGray = useMemo(() => grayCode(colVars), [colVars])

  const rows = Math.max(1, 1 << rowVars)
  const cols = Math.max(1, 1 << colVars)

  const [grid, setGrid] = useState<CellState[][]>(() => makeGrid(rows, cols))

  // Reset grid when variable count changes
  // This keeps implementation simple for now
  const resetGridToVars = () => setGrid(makeGrid(rows, cols))

  // Update grid when nVars changes
  useMemo(() => {
    resetGridToVars()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols])

  const cycleCell = (r: number, c: number) => {
    setGrid((g) => {
      const next = g.map((row) => row.slice())
      const v = next[r][c]
      next[r][c] = v === "0" ? "1" : v === "1" ? "X" : "0"
      return next
    })
  }

  const onesMinterms = useMemo(() => {
    const rCodes = rowGray
    const cCodes = colGray
    const minterms: number[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r]?.[c] === "1") {
          const rBin = grayToBinary(rCodes[r] || "")
          const cBin = grayToBinary(cCodes[c] || "")
          const bits = (rBin + cBin).padStart(nVars, "0")
          minterms.push(indexFromBits(bits))
        }
      }
    }
    return minterms.sort((a, b) => a - b)
  }, [grid, rowGray, colGray, rows, cols, nVars])

  const expressionSOP = useMemo(() => {
    const total = 1 << nVars
    if (onesMinterms.length === 0) return "0"
    if (onesMinterms.length === total) return "1"

    // Canonical SOP (sum of minterms). Does not perform minimization/grouping yet.
    const terms = onesMinterms.map((m) => {
      const bits = m.toString(2).padStart(nVars, "0")
      return canonicalProduct(bits, nVars)
    })
    return terms.join(" + ")
  }, [onesMinterms, nVars])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(expressionSOP)
    } catch {
      // no-op
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col">
          <label htmlFor="var-count" className="text-sm font-medium">
            Number of variables
          </label>
          <select
            id="var-count"
            className="mt-1 rounded-md border border-border bg-card px-3 py-2 text-sm"
            value={nVars}
            onChange={(e) => setNVars(Number.parseInt(e.target.value))}
            aria-label="Number of variables"
          >
            {[2, 3, 4, 5, 6].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-4 w-4 rounded-sm border border-border bg-background" /> 0
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-4 w-4 rounded-sm border border-primary bg-primary" /> 1
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-4 w-4 rounded-sm border border-border bg-muted" /> X
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={resetGridToVars}>
            Reset
          </Button>
          <Button onClick={handleCopy}>Copy Expression</Button>
        </div>
      </div>

      {/* K-Map grid */}
      <Card className="overflow-x-auto bg-card p-4">
        <div
          role="grid"
          aria-label={`Karnaugh map with ${rows} rows and ${cols} columns`}
          className="inline-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(40px, 64px))`,
            gridTemplateRows: `repeat(${rows}, minmax(40px, 64px))`,
            gap: "2px",
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const v = grid[r]?.[c] ?? "0"
              const isOne = v === "1"
              const isX = v === "X"
              return (
                <button
                  key={`${r}-${c}`}
                  role="gridcell"
                  aria-label={`Cell ${r}, ${c} is ${v}`}
                  onClick={() => cycleCell(r, c)}
                  className={cn(
                    "flex items-center justify-center rounded-md border text-sm font-medium transition-colors",
                    isOne
                      ? "border-primary bg-primary text-primary-foreground"
                      : isX
                        ? "border-border bg-muted text-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {v}
                </button>
              )
            }),
          )}
        </div>
      </Card>

      {/* Expression output */}
      <section aria-labelledby="output-heading" className="space-y-2">
        <h2 id="output-heading" className="text-lg font-semibold">
          Canonical SOP (Sum of Minterms)
        </h2>
        <p className="rounded-md border border-border bg-popover p-3 font-mono text-sm">{expressionSOP}</p>
        <p className="text-sm text-muted-foreground">
          Note: This is the canonical form. Minimization/grouping is not yet applied.
        </p>
      </section>
    </div>
  )
}
