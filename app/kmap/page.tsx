import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import KMapTool from "@/components/kmap/kmap-tool"

export default function KMapPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Karnaugh Map Tool</h1>
        <p className="mt-2 text-muted-foreground">
          Select the number of variables, toggle cells between 0/1/X (don’t care), and view the canonical SOP.
        </p>
      </header>

      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Interactive K-Map</CardTitle>
        </CardHeader>
        <CardContent>
          <KMapTool />
        </CardContent>
      </Card>
    </main>
  )
}
