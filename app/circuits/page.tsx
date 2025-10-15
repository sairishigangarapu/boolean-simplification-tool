import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { circuits } from "@/components/circuits/circuit-data"

export default function CircuitsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-pretty">Circuit Components</h1>
        <p className="text-muted-foreground mt-2 max-w-prose">
          Explore common digital logic components. Select a component to see its schematic, truth table, and try an
          interactive simulation.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {circuits.map((c) => (
          <Card key={c.slug} className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{c.name}</CardTitle>
                <Badge variant="secondary" aria-label={`Category: ${c.category}`}>
                  {c.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <img
                src="/circuit-schematic.jpg"
                alt={`${c.name} schematic`}
                className="w-full h-40 object-contain rounded-md border"
              />
              <p className="text-muted-foreground text-sm line-clamp-3">{c.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-end">
              <Link
                className="text-primary underline underline-offset-4 hover:opacity-90"
                href={`/circuits/${c.slug}`}
                aria-label={`View details for ${c.name}`}
              >
                View details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>

      {/* More circuit tools section */}
      <section className="mt-10 rounded-xl border bg-card text-card-foreground p-6">
        <h2 className="text-xl font-medium">More circuit tools</h2>
        <p className="text-muted-foreground mt-1">Extras not shown in the components list.</p>
        <ul className="mt-3 list-disc pl-5 text-sm">
          <li className="marker:text-muted-foreground">
            <Link href="/circuits/flipflop-conversion" className="underline underline-offset-4">
              Flip‑Flop Conversion
            </Link>{" "}
            — Convert SR, JK, D, and T using excitation tables.
          </li>
        </ul>
      </section>
    </main>
  )
}
