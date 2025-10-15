export default function Unit1TheoryPage() {
  const z = 0 // Declare the z variable
  const z̄ = 1 // Declare the z̄ variable

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-balance">
          Unit 1: Boolean Algebra, K-Maps, and Combinational Logic
        </h1>
        <p className="text-muted-foreground mt-2">
          UE24CS251A: Digital Design and Computer Organization — PES University
        </p>
      </header>

      <nav className="grid gap-2 mb-8">
        <a className="underline underline-offset-4 text-sm" href="#boolean-algebra">
          Basic Theorems and Properties of Boolean Algebra
        </a>
        <a className="underline underline-offset-4 text-sm" href="#kmap">
          Karnaugh Maps (K-Maps)
        </a>
        <a className="underline underline-offset-4 text-sm" href="#nand-nor">
          NAND/NOR Implementations
        </a>
        <a className="underline underline-offset-4 text-sm" href="#xor-parity">
          Exclusive-OR and Parity
        </a>
        <a className="underline underline-offset-4 text-sm" href="#combinational-logic">
          Combinational Logic: Analysis and Design
        </a>
        <a className="underline underline-offset-4 text-sm" href="#adder-family">
          Binary Adders, Subtractors, RCA, CLA, BCD Adder
        </a>
        <a className="underline underline-offset-4 text-sm" href="#multiplier">
          Binary Multiplier
        </a>
        <a className="underline underline-offset-4 text-sm" href="#comparators">
          Magnitude Comparators
        </a>
        <a className="underline underline-offset-4 text-sm" href="#decoders-encoders-mux">
          Decoders, Encoders, Priority Encoder, Multiplexer
        </a>
        <a className="underline underline-offset-4 text-sm" href="#three-state">
          Three-State Gates and Bus Multiplexing
        </a>
      </nav>

      <article className="prose prose-invert leading-relaxed text-pretty">
        <section id="boolean-algebra">
          <h2>Basic Theorems and Properties of Boolean Algebra</h2>
          <p>
            Boolean algebra underpins logic optimization. Designers exploit identities to reduce gate count and cost.
            The duality principle ensures any valid expression remains valid when AND↔OR and 0↔1 are interchanged.
            Operator precedence is: parentheses, NOT, AND, OR.
          </p>
          <p>
            Boolean functions map binary inputs to binary outputs and can be represented using algebra, truth tables, or
            logic schematics. Canonical forms include the sum of minterms and product of maxterms; standard forms
            include SOP and POS with potentially fewer literals.
          </p>
        </section>

        <section id="kmap">
          <h2>Karnaugh Maps (K-Maps)</h2>
          <p>
            K-Maps provide a visual method for minimizing functions up to 4 variables (practically) with Gray code
            adjacency. Groups of 1, 2, 4, 8, ... adjacent 1-cells yield implicants with decreasing literal count.
            Don’t-care conditions (X) can be included to produce simpler expressions. Prime implicants and essential
            prime implicants guide minimal covers.
          </p>
        </section>

        <section id="nand-nor">
          <h2>NAND and NOR Implementations</h2>
          <p>
            NAND and NOR are universal. Two-level NAND implements SOP; two-level NOR implements POS. Multi-level
            conversions follow bubble-pushing rules with AND-invert / invert-OR (for NAND) and OR-invert / invert-AND
            (for NOR) mixed notation.
          </p>
        </section>

        <section id="xor-parity">
          <h2>Exclusive-OR and Parity</h2>
          <p>
            XOR implements odd-parity detection; XNOR yields even parity. Multi-input XOR behaves as an odd function:
            output is 1 if an odd number of inputs are 1. Parity generation/checking uses XOR trees, widely used for
            error detection.
          </p>
        </section>

        <section id="combinational-logic">
          <h2>Combinational Logic: Analysis and Design</h2>
          <p>
            Combinational circuits map present inputs to outputs without memory. Analysis derives SOP/POS or truth
            tables; design proceeds via specification → truth table → minimization → schematic. Code conversion and
            multiple-output sharing illustrate practical synthesis trade-offs.
          </p>
        </section>

        <section id="adder-family">
          <h2>Binary Adders, Subtractors, RCA, CLA, BCD Adder</h2>
          <p>
            Half adders and full adders compose ripple-carry adders (RCA), with delays linear in bit-width. Carry
            look-ahead adders (CLA) introduce generate/propagate logic to compute carries in parallel, reducing delay.
            BCD addition detects invalid sums and adds 0110 for correction. Two’s-complement subtraction uses XOR on B
            inputs plus Cin=1; overflow detection differs for signed vs unsigned.
          </p>
        </section>

        <section id="multiplier">
          <h2>Binary Multiplier</h2>
          <p>
            Array multipliers form partial products via ANDs and sum them with adders; complexity is O(J×K) for J×K-bit
            operands.
          </p>
        </section>

        <section id="comparators">
          <h2>Magnitude Comparators</h2>
          <p>Equality uses chained XNORs; greater/less functions cascade from MSB to LSB using equality prefixes.</p>
        </section>

        <section id="decoders-encoders-mux">
          <h2>Decoders, Encoders, Priority Encoder, Multiplexer</h2>
          <p>
            Decoders generate minterms and can act as demultiplexers. Encoders map 2^n inputs to n outputs; priority
            encoders resolve multiple active inputs and expose a valid flag. Multiplexers implement Boolean functions by
            steering minterms; n−1 selectors with data inputs {(0, 1, z, z̄)} suffice.
          </p>
        </section>

        <section id="three-state">
          <h2>Three-State Gates and Bus Multiplexing</h2>
          <p>
            3-state buffers enable bus fabrics by placing inactive drivers in high-impedance state; decoders ensure
            mutual exclusivity on shared lines.
          </p>
        </section>
      </article>
    </main>
  )
}
