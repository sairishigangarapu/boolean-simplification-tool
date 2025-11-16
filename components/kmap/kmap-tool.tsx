"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CellValue = 0 | 1 | "X"
type KMapSize = 2 | 3 | 4

interface VariableMapping {
  horizontal: string[]
  vertical: string[]
}

interface PrimeImplicant {
  minterms: number[]
  term: string
  essential: boolean
}

interface SimplificationResult {
  expression: string
  primeImplicants: PrimeImplicant[]
}

class KMapSimplifier {
  private numVars: KMapSize
  private kmap: CellValue[][]
  private rows: number
  private cols: number
  private variableMapping: VariableMapping

  constructor(numVars: KMapSize = 4, variableMapping?: VariableMapping) {
    this.numVars = numVars
    this.rows = numVars <= 2 ? 2 : 4
    this.cols = 4

    this.variableMapping = variableMapping || {
      horizontal: numVars === 2 ? ["A", "B"] : numVars === 3 ? ["B", "C"] : ["C", "D"],
      vertical: numVars === 3 ? ["A"] : numVars === 4 ? ["A", "B"] : [],
    }

    this.kmap = Array(this.rows)
      .fill(0)
      .map(() => Array(this.cols).fill(0))
  }

  private getGrayCode(bits: number): number[] {
    if (bits === 1) return [0, 1]
    if (bits === 2) return [0, 1, 3, 2]
    return [0, 1, 3, 2]
  }

  public mintermToPosition(minterm: number): [number, number] {
    const rowBits = this.numVars <= 2 ? 1 : 2
    const colBits = this.numVars - rowBits

    const rowGray = this.getGrayCode(rowBits)
    const colGray = this.getGrayCode(colBits)

    const rowVal = (minterm >> colBits) & ((1 << rowBits) - 1)
    const colVal = minterm & ((1 << colBits) - 1)

    const row = rowGray.indexOf(rowVal)
    const col = colGray.indexOf(colVal)

    return [row, col]
  }

  private positionToMinterm(row: number, col: number): number {
    const rowBits = this.numVars <= 2 ? 1 : 2
    const colBits = this.numVars - rowBits

    const rowGray = this.getGrayCode(rowBits)
    const colGray = this.getGrayCode(colBits)

    const rowVal = rowGray[row]
    const colVal = colGray[col]

    return (rowVal << colBits) | colVal
  }

  public setFromMinterms(minterms: number[], dontCares: number[] = []): void {
    this.kmap = Array(this.rows)
      .fill(0)
      .map(() => Array(this.cols).fill(0))

    minterms.forEach((m) => {
      const [row, col] = this.mintermToPosition(m)
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        this.kmap[row][col] = 1
      }
    })

    dontCares.forEach((m) => {
      const [row, col] = this.mintermToPosition(m)
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        this.kmap[row][col] = "X"
      }
    })
  }

  public setKMap(kmap: CellValue[][]): void {
    this.kmap = kmap
  }

  public getMinterms(): number[] {
    const minterms: number[] = []
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.kmap[r][c] === 1) {
          minterms.push(this.positionToMinterm(r, c))
        }
      }
    }
    return minterms
  }

  private getDontCares(): number[] {
    const dontCares: number[] = []
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.kmap[r][c] === "X") {
          dontCares.push(this.positionToMinterm(r, c))
        }
      }
    }
    return dontCares
  }

  private checkRectangle(
    startRow: number,
    startCol: number,
    height: number,
    width: number,
    available: number[]
  ): number[] | null {
    const group: number[] = []

    for (let dr = 0; dr < height; dr++) {
      for (let dc = 0; dc < width; dc++) {
        const r = (startRow + dr) % this.rows
        const c = (startCol + dc) % this.cols
        const minterm = this.positionToMinterm(r, c)

        if (available.includes(minterm)) {
          group.push(minterm)
        } else {
          return null
        }
      }
    }

    return group.length === height * width ? group : null
  }

  private tryFormGroup(available: number[], startIdx: number, size: number): number[] | null {
    const start = available[startIdx]
    const [startRow, startCol] = this.mintermToPosition(start)

    const shapes: [number, number][] = []
    if (size === 1) shapes.push([1, 1])
    if (size === 2) shapes.push([1, 2], [2, 1])
    if (size === 4) shapes.push([2, 2], [1, 4], [4, 1])
    if (size === 8) shapes.push([2, 4], [4, 2])
    if (size === 16) shapes.push([4, 4])

    for (const [height, width] of shapes) {
      const group = this.checkRectangle(startRow, startCol, height, width, available)
      if (group && group.length === size) {
        return group
      }
    }

    return null
  }

  private findGroupsOfSize(available: number[], mustInclude: number[], size: number): number[][] {
    const groupings: number[][] = []

    for (let i = 0; i < available.length; i++) {
      const group = this.tryFormGroup(available, i, size)
      if (group && group.some((m) => mustInclude.includes(m))) {
        const sorted = [...group].sort((a, b) => a - b)
        const key = sorted.join(",")
        if (!groupings.some((g) => g.join(",") === key)) {
          groupings.push(sorted)
        }
      }
    }

    return groupings
  }

  private findAllGroupings(): number[][] {
    const minterms = this.getMinterms()
    const dontCares = this.getDontCares()
    const available = [...minterms, ...dontCares]

    const groupings: number[][] = []

    for (const size of [16, 8, 4, 2, 1]) {
      const groups = this.findGroupsOfSize(available, minterms, size)
      groupings.push(...groups)
    }

    return groupings
  }

  private groupToTerm(group: number[]): string {
    if (group.length === 0) return ""

    const first = group[0]
    let mask = (1 << this.numVars) - 1
    let value = first

    for (const minterm of group) {
      mask &= ~(first ^ minterm)
    }

    value &= mask

    const vars = this.getAllVariables()
    const terms: string[] = []

    for (let i = 0; i < this.numVars; i++) {
      const bit = this.numVars - 1 - i
      if (mask & (1 << bit)) {
        if (value & (1 << bit)) {
          terms.push(vars[i])
        } else {
          terms.push(vars[i] + "'")
        }
      }
    }

    return terms.join("")
  }

  private getAllVariables(): string[] {
    const vars: string[] = []
    this.variableMapping.vertical.forEach((v) => vars.push(v))
    this.variableMapping.horizontal.forEach((v) => vars.push(v))
    return vars
  }

  public simplify(): SimplificationResult {
    const minterms = this.getMinterms()
    if (minterms.length === 0) {
      return { expression: "0", primeImplicants: [] }
    }

    const groupings = this.findAllGroupings()
    const primeImplicants: PrimeImplicant[] = []

    for (const group of groupings) {
      const term = this.groupToTerm(group)
      const isMaximal = !groupings.some(
        (other) =>
          other.length > group.length && group.every((m) => other.includes(m))
      )

      if (isMaximal) {
        primeImplicants.push({
          minterms: group,
          term,
          essential: false,
        })
      }
    }

    const covered = new Set<number>()
    const essentialPIs: PrimeImplicant[] = []

    for (const minterm of minterms) {
      const covering = primeImplicants.filter((pi) => pi.minterms.includes(minterm))
      if (covering.length === 1) {
        covering[0].essential = true
        if (!essentialPIs.includes(covering[0])) {
          essentialPIs.push(covering[0])
          covering[0].minterms.forEach((m) => covered.add(m))
        }
      }
    }

    const remaining = minterms.filter((m) => !covered.has(m))
    const selectedPIs = [...essentialPIs]

    while (remaining.length > 0) {
      const best = primeImplicants
        .filter((pi) => !selectedPIs.includes(pi))
        .map((pi) => ({
          pi,
          newCoverage: pi.minterms.filter((m) => remaining.includes(m)).length,
        }))
        .filter((item) => item.newCoverage > 0)
        .sort((a, b) => b.newCoverage - a.newCoverage)[0]

      if (!best) break

      selectedPIs.push(best.pi)
      best.pi.minterms.forEach((m) => {
        const idx = remaining.indexOf(m)
        if (idx !== -1) remaining.splice(idx, 1)
      })
    }

    const expression = selectedPIs.map((pi) => pi.term).join(" + ") || "0"

    return { expression, primeImplicants: selectedPIs }
  }
}

export default function KMapTool() {
  const [numVars, setNumVars] = useState<KMapSize>(4)
  const [grid, setGrid] = useState<CellValue[][]>(() =>
    Array(4)
      .fill(0)
      .map(() => Array(4).fill(0))
  )
  const [inputMode, setInputMode] = useState<"manual" | "function">("manual")
  const [mintermsInput, setMintermsInput] = useState("")
  const [dontCaresInput, setDontCaresInput] = useState("")
  const [outputVar, setOutputVar] = useState("Y")

  const variableMapping: VariableMapping = {
    horizontal: numVars === 2 ? ["B"] : numVars === 3 ? ["B", "C"] : ["C", "D"],
    vertical: numVars === 2 ? ["A"] : numVars === 3 ? ["A"] : ["A", "B"],
  }

  const rows = numVars <= 2 ? 2 : 4
  const cols = numVars === 2 ? 4 : 4

  const simplifier = useMemo(() => {
    const sim = new KMapSimplifier(numVars, variableMapping)
    const newGrid = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0))
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newGrid[r][c] = (grid[r]?.[c] as CellValue) ?? 0
      }
    }
    sim.setKMap(newGrid)
    return sim
  }, [grid, numVars, rows, cols, variableMapping])

  const result = useMemo(() => {
    return simplifier.simplify()
  }, [simplifier])

  const cycleCell = (r: number, c: number) => {
    setGrid((g) => {
      const next = g.map((row) => row.slice())
      const v = next[r][c]
      next[r][c] = v === 0 ? 1 : v === 1 ? "X" : 0
      return next
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.expression)
    } catch {
      // no-op
    }
  }

  const handleFunctionInput = () => {
    const minterms = mintermsInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n))
    const dontCares = dontCaresInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n))

    // Create a temporary simplifier to get minterm-to-position mapping
    const tempSimplifier = new KMapSimplifier(numVars, variableMapping)

    // Rebuild grid from minterms and don't cares
    const newGrid = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0 as CellValue))

    minterms.forEach((m) => {
      const [row, col] = tempSimplifier.mintermToPosition(m)
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        newGrid[row][col] = 1
      }
    })

    dontCares.forEach((m) => {
      const [row, col] = tempSimplifier.mintermToPosition(m)
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        newGrid[row][col] = "X"
      }
    })

    setGrid(newGrid)
  }

  const resetGrid = () => {
    setGrid(
      Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(0))
    )
  }

  const getGrayCode = (bits: number): string[] => {
    if (bits === 1) return ["0", "1"]
    if (bits === 2) return ["00", "01", "11", "10"]
    return ["0", "1"]
  }

  const rowBits = numVars <= 2 ? 1 : 2
  const colBits = numVars - rowBits
  const rowLabels = getGrayCode(rowBits)
  const colLabels = getGrayCode(colBits)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            K-Map ({numVars}-Variable)
          </div>
          <select
            value={numVars}
            onChange={(e) => setNumVars(parseInt(e.target.value) as KMapSize)}
            className="px-3 py-1 text-sm border rounded bg-background text-foreground"
          >
            <option value={2}>2 Variables</option>
            <option value={3}>3 Variables</option>
            <option value={4}>4 Variables</option>
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
            <span className="inline-block h-4 w-4 rounded-sm border border-border bg-muted" /> X (Don't Care)
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 border rounded p-1 bg-background">
            <button
              onClick={() => setInputMode("manual")}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                inputMode === "manual"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              Manual
            </button>
            <button
              onClick={() => setInputMode("function")}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                inputMode === "function"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              Function
            </button>
          </div>
          <Button variant="outline" onClick={resetGrid} size="sm">
            Reset
          </Button>
          <Button onClick={handleCopy} size="sm">
            Copy Expression
          </Button>
        </div>
      </div>

      {inputMode === "function" && (
        <Card className="bg-card p-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Minterms (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., 1,2,3,4"
                value={mintermsInput}
                onChange={(e) => setMintermsInput(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Don't Cares (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., 5,12"
                value={dontCaresInput}
                onChange={(e) => setDontCaresInput(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded bg-background text-foreground"
              />
            </div>
            <Button onClick={handleFunctionInput} className="w-full">
              Load into K-Map
            </Button>
          </div>
        </Card>
      )}

      {/* K-Map grid with labels */}
      <Card className="overflow-x-auto bg-card p-6">
        <div className="inline-block">
          {/* Column headers */}
          <div className="flex gap-0">
            <div className="w-16" />
            <div className="flex gap-0">
              {colLabels.map((label, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-sm border border-border bg-muted px-2 py-1 font-mono text-xs font-bold w-16 h-12"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="flex gap-0 flex-col">
            {rowLabels.map((rowLabel, r) => (
              <div key={r} className="flex gap-0">
                <div className="flex items-center justify-center rounded-sm border border-border bg-muted px-2 py-1 font-mono text-xs font-bold w-16 h-12">
                  {rowLabel}
                </div>
                <div className="flex gap-0">
                  {Array.from({ length: cols }).map((_, c) => {
                    const v = grid[r]?.[c] ?? 0
                    const isOne = v === 1
                    const isX = v === "X"
                    return (
                      <button
                        key={`${r}-${c}`}
                        role="gridcell"
                        aria-label={`Cell row ${r} column ${c} is ${v}`}
                        onClick={() => cycleCell(r, c)}
                        className={cn(
                          "flex items-center justify-center rounded-sm border text-sm font-medium transition-colors w-16 h-12",
                          isOne
                            ? "border-primary bg-primary text-primary-foreground"
                            : isX
                              ? "border-border bg-muted text-foreground"
                              : "border-border bg-background text-foreground hover:bg-muted"
                        )}
                      >
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Expression output */}
      <section aria-labelledby="output-heading" className="space-y-2">
        <h2 id="output-heading" className="text-lg font-semibold">
          Minimized SOP Expression
        </h2>
        <p className="rounded-md border border-border bg-popover p-3 font-mono text-sm break-words">
          {outputVar} = {result.expression}
        </p>
        <p className="text-sm text-muted-foreground">
          K-Map simplification with support for don't cares (X). Finds prime implicants and minimal SOP.
        </p>
      </section>

      {/* Prime implicants info */}
      {result.primeImplicants.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Selected Prime Implicants</h3>
          <div className="space-y-1 text-sm">
            {result.primeImplicants.map((prime, idx) => (
              <p key={idx} className="font-mono text-muted-foreground">
                • {prime.term} (covers {prime.minterms.join(", ")})
                {prime.essential && <span className="text-xs text-primary"> [Essential]</span>}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
