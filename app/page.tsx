import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-28 pb-12">
      <section className="text-center mb-12">
        <h1 className="text-balance text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          Learn, Design, and Simplify Digital Logic
        </h1>
        <p className="mt-3 text-lg text-foreground/70 leading-relaxed">
          Explore Karnaugh maps, circuit components, and practice problems — then save your favorites.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/kmap">Get Started with K‑Map</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/circuits">Explore Circuits</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/protected">Protected Area</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl">K‑Map Tool</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">Build and simplify Boolean expressions visually with Karnaugh maps.</p>
            <Button asChild>
              <Link href="/kmap">Open</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Circuit Components</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">
              MUX, DEMUX, adders, subtractors, counters, flip‑flops, RCA, CLA, BCD, and more.
            </p>
            <Button asChild variant="secondary">
              <Link href="/circuits">Browse</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Practice Problems</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">
              Auto‑generated Boolean simplification, K‑Map, and circuit tasks with feedback.
            </p>
            <Button asChild variant="secondary">
              <Link href="/practice">Practice</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Favorites</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">Save K‑Map setups, problems, or circuits to revisit later.</p>
            <Button asChild variant="secondary">
              <Link href="/favorites">Open</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Flip‑Flop Conversion</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">Use excitation tables to convert SR, JK, D, and T flip‑flops.</p>
            <Button asChild variant="outline">
              <Link href="/circuits/flipflop-conversion">Convert</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Protected Area</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">A sample auth‑gated page to verify your login state.</p>
            <Button asChild variant="outline">
              <Link href="/protected">Enter</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Unit 1 Theory card linking to /theory/unit-1 */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl">Unit 1 Theory</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">Revision notes and explanations for Unit 1.</p>
            <Button asChild variant="secondary">
              <Link href="/theory/unit-1">Read</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
