"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import type { CircuitComponent, Bit } from "./circuit-data"

function nextBit(b: Bit): Bit {
  return b === 0 ? 1 : 0
}

export function CircuitSimulator({ circuit }: { circuit: CircuitComponent }) {
  const initialInputs = useMemo(() => {
    const state: Record<string, Bit> = {}
    circuit.inputs.forEach((i) => (state[i] = 0))
    return state
  }, [circuit.inputs])

  const [inputs, setInputs] = useState<Record<string, Bit>>(initialInputs)

  const outputs = useMemo(() => {
    // Find matching row in the truth table
    const row = circuit.truthTable.find((r) => circuit.inputs.every((i) => r.inputs[i] === inputs[i]))
    return row?.outputs ?? Object.fromEntries(circuit.outputs.map((o) => [o, 0 as Bit]))
  }, [inputs, circuit.truthTable, circuit.inputs, circuit.outputs])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-medium">Inputs</h3>
          <div className="flex flex-wrap items-center gap-2">
            {circuit.inputs.map((i) => (
              <Button
                key={i}
                variant={inputs[i] === 1 ? "default" : "secondary"}
                onClick={() => setInputs((prev) => ({ ...prev, [i]: nextBit(prev[i]) }))}
                aria-pressed={inputs[i] === 1}
                aria-label={`Toggle ${i}`}
              >
                {i}: {inputs[i]}
              </Button>
            ))}
            <Button variant="outline" onClick={() => setInputs(initialInputs)} aria-label="Reset inputs">
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Outputs</h3>
          <div className="flex flex-wrap items-center gap-2">
            {circuit.outputs.map((o) => (
              <div key={o} className="px-3 py-2 rounded-md border bg-background" role="status" aria-live="polite">
                {o}: <span className="font-semibold">{outputs[o]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        Tip: Click an input to toggle between 0 and 1. Outputs update instantly based on the truth table.
      </p>
    </div>
  )
}
