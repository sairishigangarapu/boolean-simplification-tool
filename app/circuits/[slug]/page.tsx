import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCircuitBySlug } from "@/components/circuits/circuit-data"
import { CircuitSimulator } from "@/components/circuits/circuit-simulator"

type Params = { params: { slug: string } }

export default function CircuitDetailPage({ params }: Params) {
  const circuit = getCircuitBySlug(params.slug)
  if (!circuit) return notFound()

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-pretty">{circuit.name}</h1>
        <Button variant="ghost" asChild>
          <Link href="/circuits" aria-label="Back to circuits list">
            Back
          </Link>
        </Button>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Schematic</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src="/circuit-schematic-detail.jpg"
              alt={`${circuit.name} schematic`}
              className="w-full h-80 object-contain rounded-md border bg-muted/10"
            />
            <p className="text-muted-foreground text-sm mt-3">{circuit.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Truth Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-md">
                <thead>
                  <tr className="bg-muted">
                    {circuit.inputs.map((i) => (
                      <th key={i} className="px-3 py-2 text-left">
                        {i}
                      </th>
                    ))}
                    {circuit.outputs.map((o) => (
                      <th key={o} className="px-3 py-2 text-left">
                        {o}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {circuit.truthTable.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      {circuit.inputs.map((i) => (
                        <td key={`${idx}-${i}`} className="px-3 py-2">
                          {row.inputs[i]}
                        </td>
                      ))}
                      {circuit.outputs.map((o) => (
                        <td key={`${idx}-${o}`} className="px-3 py-2 font-medium">
                          {row.outputs[o]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-xs">
              Outputs are computed deterministically from the inputs per row.
            </p>
          </CardFooter>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Try it: Interactive Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <CircuitSimulator circuit={circuit} />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
