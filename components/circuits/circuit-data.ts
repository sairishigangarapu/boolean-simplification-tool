export type Bit = 0 | 1

export interface CircuitRow {
  inputs: Record<string, Bit>
  outputs: Record<string, Bit>
}

export interface CircuitComponent {
  slug: string
  name: string
  category:
    | "Gate"
    | "Flip-Flop"
    | "Multiplexer"
    | "Demultiplexer"
    | "Decoder"
    | "Encoder"
    | "Adder"
    | "Subtractor"
    | "Counter"
    | "RCA"
    | "BCD"
    | "Lookahead"
  description: string
  inputs: string[]
  outputs: string[]
  truthTable: CircuitRow[]
}

export const circuits: CircuitComponent[] = [
  {
    slug: "and-gate",
    name: "AND Gate",
    category: "Gate",
    description: "Binary AND: output is 1 only if all inputs are 1.",
    inputs: ["A", "B"],
    outputs: ["Y"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { Y: 0 } },
      { inputs: { A: 0, B: 1 }, outputs: { Y: 0 } },
      { inputs: { A: 1, B: 0 }, outputs: { Y: 0 } },
      { inputs: { A: 1, B: 1 }, outputs: { Y: 1 } },
    ],
  },
  {
    slug: "or-gate",
    name: "OR Gate",
    category: "Gate",
    description: "Binary OR: output is 1 if any input is 1.",
    inputs: ["A", "B"],
    outputs: ["Y"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { Y: 0 } },
      { inputs: { A: 0, B: 1 }, outputs: { Y: 1 } },
      { inputs: { A: 1, B: 0 }, outputs: { Y: 1 } },
      { inputs: { A: 1, B: 1 }, outputs: { Y: 1 } },
    ],
  },
  {
    slug: "not-gate",
    name: "NOT Gate",
    category: "Gate",
    description: "Inverter: output is the logical complement of the input.",
    inputs: ["A"],
    outputs: ["Y"],
    truthTable: [
      { inputs: { A: 0 }, outputs: { Y: 1 } },
      { inputs: { A: 1 }, outputs: { Y: 0 } },
    ],
  },
  {
    slug: "nand-gate",
    name: "NAND Gate",
    category: "Gate",
    description: "NOT AND: output is 0 only if all inputs are 1.",
    inputs: ["A", "B"],
    outputs: ["Y"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { Y: 1 } },
      { inputs: { A: 0, B: 1 }, outputs: { Y: 1 } },
      { inputs: { A: 1, B: 0 }, outputs: { Y: 1 } },
      { inputs: { A: 1, B: 1 }, outputs: { Y: 0 } },
    ],
  },
  {
    slug: "nor-gate",
    name: "NOR Gate",
    category: "Gate",
    description: "NOT OR: output is 1 only if all inputs are 0.",
    inputs: ["A", "B"],
    outputs: ["Y"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { Y: 1 } },
      { inputs: { A: 0, B: 1 }, outputs: { Y: 0 } },
      { inputs: { A: 1, B: 0 }, outputs: { Y: 0 } },
      { inputs: { A: 1, B: 1 }, outputs: { Y: 0 } },
    ],
  },
  {
    slug: "xor-gate",
    name: "XOR Gate",
    category: "Gate",
    description: "Exclusive OR: output is 1 if inputs differ.",
    inputs: ["A", "B"],
    outputs: ["Y"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { Y: 0 } },
      { inputs: { A: 0, B: 1 }, outputs: { Y: 1 } },
      { inputs: { A: 1, B: 0 }, outputs: { Y: 1 } },
      { inputs: { A: 1, B: 1 }, outputs: { Y: 0 } },
    ],
  },
  {
    slug: "xnor-gate",
    name: "XNOR Gate",
    category: "Gate",
    description: "Exclusive NOR: output is 1 if inputs are equal.",
    inputs: ["A", "B"],
    outputs: ["Y"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { Y: 1 } },
      { inputs: { A: 0, B: 1 }, outputs: { Y: 0 } },
      { inputs: { A: 1, B: 0 }, outputs: { Y: 0 } },
      { inputs: { A: 1, B: 1 }, outputs: { Y: 1 } },
    ],
  },
  {
    slug: "half-adder",
    name: "Half Adder",
    category: "Adder",
    description: "Adds two single bits, producing SUM and CARRY.",
    inputs: ["A", "B"],
    outputs: ["SUM", "CARRY"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { SUM: 0, CARRY: 0 } },
      { inputs: { A: 0, B: 1 }, outputs: { SUM: 1, CARRY: 0 } },
      { inputs: { A: 1, B: 0 }, outputs: { SUM: 1, CARRY: 0 } },
      { inputs: { A: 1, B: 1 }, outputs: { SUM: 0, CARRY: 1 } },
    ],
  },
  {
    slug: "mux-2to1",
    name: "2:1 Multiplexer",
    category: "Multiplexer",
    description: "Selects between inputs I0 and I1 based on select line S: Y = S ? I1 : I0.",
    inputs: ["S", "I0", "I1"],
    outputs: ["Y"],
    truthTable: [
      { inputs: { S: 0, I0: 0, I1: 0 }, outputs: { Y: 0 } },
      { inputs: { S: 0, I0: 0, I1: 1 }, outputs: { Y: 0 } },
      { inputs: { S: 0, I0: 1, I1: 0 }, outputs: { Y: 1 } },
      { inputs: { S: 0, I0: 1, I1: 1 }, outputs: { Y: 1 } },
      { inputs: { S: 1, I0: 0, I1: 0 }, outputs: { Y: 0 } },
      { inputs: { S: 1, I0: 0, I1: 1 }, outputs: { Y: 1 } },
      { inputs: { S: 1, I0: 1, I1: 0 }, outputs: { Y: 0 } },
      { inputs: { S: 1, I0: 1, I1: 1 }, outputs: { Y: 1 } },
    ],
  },
  {
    slug: "d-flip-flop",
    name: "D Flip-Flop (Idealized)",
    category: "Flip-Flop",
    description:
      "Edge-triggered D flip-flop characteristic: Q(next) = D at clock edge. Simplified table assumes ideal behavior.",
    inputs: ["D"],
    outputs: ["Q_next"],
    truthTable: [
      { inputs: { D: 0 }, outputs: { Q_next: 0 } },
      { inputs: { D: 1 }, outputs: { Q_next: 1 } },
    ],
  },
  {
    slug: "demux-1to2",
    name: "1:2 Demultiplexer",
    category: "Demultiplexer",
    description: "Routes single input D into Y0 or Y1 based on select S.",
    inputs: ["D", "S"],
    outputs: ["Y0", "Y1"],
    truthTable: [
      { inputs: { D: 0, S: 0 }, outputs: { Y0: 0, Y1: 0 } },
      { inputs: { D: 1, S: 0 }, outputs: { Y0: 1, Y1: 0 } },
      { inputs: { D: 0, S: 1 }, outputs: { Y0: 0, Y1: 0 } },
      { inputs: { D: 1, S: 1 }, outputs: { Y0: 0, Y1: 1 } },
    ],
  },
  {
    slug: "full-adder",
    name: "Full Adder",
    category: "Adder",
    description: "Adds A and B with carry-in Cin to produce Sum and Cout.",
    inputs: ["A", "B", "Cin"],
    outputs: ["Sum", "Cout"],
    truthTable: [
      { inputs: { A: 0, B: 0, Cin: 0 }, outputs: { Sum: 0, Cout: 0 } },
      { inputs: { A: 0, B: 0, Cin: 1 }, outputs: { Sum: 1, Cout: 0 } },
      { inputs: { A: 0, B: 1, Cin: 0 }, outputs: { Sum: 1, Cout: 0 } },
      { inputs: { A: 0, B: 1, Cin: 1 }, outputs: { Sum: 0, Cout: 1 } },
      { inputs: { A: 1, B: 0, Cin: 0 }, outputs: { Sum: 1, Cout: 0 } },
      { inputs: { A: 1, B: 0, Cin: 1 }, outputs: { Sum: 0, Cout: 1 } },
      { inputs: { A: 1, B: 1, Cin: 0 }, outputs: { Sum: 0, Cout: 1 } },
      { inputs: { A: 1, B: 1, Cin: 1 }, outputs: { Sum: 1, Cout: 1 } },
    ],
  },
  {
    slug: "half-subtractor",
    name: "Half Subtractor",
    category: "Subtractor",
    description: "Computes D = A − B with Borrow-out.",
    inputs: ["A", "B"],
    outputs: ["Diff", "Borrow"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { Diff: 0, Borrow: 0 } },
      { inputs: { A: 0, B: 1 }, outputs: { Diff: 1, Borrow: 1 } },
      { inputs: { A: 1, B: 0 }, outputs: { Diff: 1, Borrow: 0 } },
      { inputs: { A: 1, B: 1 }, outputs: { Diff: 0, Borrow: 0 } },
    ],
  },
  {
    slug: "full-subtractor",
    name: "Full Subtractor",
    category: "Subtractor",
    description: "Computes D = A − B − Bin with Borrow-out.",
    inputs: ["A", "B", "Bin"],
    outputs: ["Diff", "Bout"],
    truthTable: [
      { inputs: { A: 0, B: 0, Bin: 0 }, outputs: { Diff: 0, Bout: 0 } },
      { inputs: { A: 0, B: 0, Bin: 1 }, outputs: { Diff: 1, Bout: 1 } },
      { inputs: { A: 0, B: 1, Bin: 0 }, outputs: { Diff: 1, Bout: 1 } },
      { inputs: { A: 0, B: 1, Bin: 1 }, outputs: { Diff: 0, Bout: 1 } },
      { inputs: { A: 1, B: 0, Bin: 0 }, outputs: { Diff: 1, Bout: 0 } },
      { inputs: { A: 1, B: 0, Bin: 1 }, outputs: { Diff: 0, Bout: 0 } },
      { inputs: { A: 1, B: 1, Bin: 0 }, outputs: { Diff: 0, Bout: 0 } },
      { inputs: { A: 1, B: 1, Bin: 1 }, outputs: { Diff: 1, Bout: 1 } },
    ],
  },
  {
    slug: "decoder-2to4",
    name: "2-to-4 Decoder",
    category: "Decoder",
    description: "Decodes inputs A,B into one-hot outputs Y0..Y3.",
    inputs: ["A", "B"],
    outputs: ["Y0", "Y1", "Y2", "Y3"],
    truthTable: [
      { inputs: { A: 0, B: 0 }, outputs: { Y0: 1, Y1: 0, Y2: 0, Y3: 0 } },
      { inputs: { A: 0, B: 1 }, outputs: { Y0: 0, Y1: 1, Y2: 0, Y3: 0 } },
      { inputs: { A: 1, B: 0 }, outputs: { Y0: 0, Y1: 0, Y2: 1, Y3: 0 } },
      { inputs: { A: 1, B: 1 }, outputs: { Y0: 0, Y1: 0, Y2: 0, Y3: 1 } },
    ],
  },
  {
    slug: "encoder-4to2",
    name: "4-to-2 Encoder",
    category: "Encoder",
    description: "Encodes one-hot inputs D0..D3 into A,B.",
    inputs: ["D0", "D1", "D2", "D3"],
    outputs: ["A", "B"],
    truthTable: [
      { inputs: { D0: 1, D1: 0, D2: 0, D3: 0 }, outputs: { A: 0, B: 0 } },
      { inputs: { D0: 0, D1: 1, D2: 0, D3: 0 }, outputs: { A: 0, B: 1 } },
      { inputs: { D0: 0, D1: 0, D2: 1, D3: 0 }, outputs: { A: 1, B: 0 } },
      { inputs: { D0: 0, D1: 0, D2: 0, D3: 1 }, outputs: { A: 1, B: 1 } },
    ],
  },
  {
    slug: "sr-flip-flop",
    name: "SR Flip-Flop",
    category: "Flip-Flop",
    description: "Characteristic: Q(next) = 1 if S=1, 0 if R=1 (S=R=1 invalid).",
    inputs: ["S", "R"],
    outputs: ["Q_next"],
    truthTable: [
      { inputs: { S: 0, R: 0 }, outputs: { Q_next: 0 } }, // note: simplified assuming Q=0 prior
      { inputs: { S: 0, R: 1 }, outputs: { Q_next: 0 } },
      { inputs: { S: 1, R: 0 }, outputs: { Q_next: 1 } },
      { inputs: { S: 1, R: 1 }, outputs: { Q_next: 0 } }, // invalid in practice
    ],
  },
  {
    slug: "jk-flip-flop",
    name: "JK Flip-Flop",
    category: "Flip-Flop",
    description: "Characteristic: J=K=1 toggles; simplified table shows representative transitions.",
    inputs: ["J", "K"],
    outputs: ["Q_next"],
    truthTable: [
      { inputs: { J: 0, K: 0 }, outputs: { Q_next: 0 } }, // hold from 0
      { inputs: { J: 0, K: 1 }, outputs: { Q_next: 0 } }, // reset
      { inputs: { J: 1, K: 0 }, outputs: { Q_next: 1 } }, // set
      { inputs: { J: 1, K: 1 }, outputs: { Q_next: 1 } }, // toggle (from 0 -> 1 shown)
    ],
  },
  {
    slug: "t-flip-flop",
    name: "T Flip-Flop",
    category: "Flip-Flop",
    description: "Characteristic: T=0 hold, T=1 toggle; simplified representation.",
    inputs: ["T"],
    outputs: ["Q_next"],
    truthTable: [
      { inputs: { T: 0 }, outputs: { Q_next: 0 } }, // hold from 0
      { inputs: { T: 1 }, outputs: { Q_next: 1 } }, // toggle from 0 -> 1
    ],
  },
  {
    slug: "rca-2bit",
    name: "Ripple-Carry Adder (2-bit)",
    category: "RCA",
    description:
      "2-bit RCA sample rows. Demonstrates ripple carry between bit-0 and bit-1. Full table omitted for brevity.",
    inputs: ["A1", "A0", "B1", "B0", "Cin"],
    outputs: ["S1", "S0", "Cout"],
    truthTable: [
      { inputs: { A1: 0, A0: 0, B1: 0, B0: 0, Cin: 0 }, outputs: { S1: 0, S0: 0, Cout: 0 } },
      { inputs: { A1: 0, A0: 1, B1: 0, B0: 1, Cin: 0 }, outputs: { S1: 1, S0: 0, Cout: 0 } }, // 1+1=2
      { inputs: { A1: 1, A0: 1, B1: 0, B0: 1, Cin: 0 }, outputs: { S1: 0, S0: 0, Cout: 1 } }, // 3+1=4
      { inputs: { A1: 1, A0: 0, B1: 1, B0: 1, Cin: 1 }, outputs: { S1: 1, S0: 0, Cout: 1 } },
    ],
  },
  {
    slug: "bcd-adder-sample",
    name: "BCD Adder (Sample)",
    category: "BCD",
    description:
      "Adds two BCD digits; includes correction when sum > 9. Limited sample rows to illustrate correction behavior.",
    inputs: ["A3", "A2", "A1", "A0", "B3", "B2", "B1", "B0", "Cin"],
    outputs: ["S3", "S2", "S1", "S0", "Cout"],
    truthTable: [
      // 4 + 5 = 9
      {
        inputs: { A3: 0, A2: 1, A1: 0, A0: 0, B3: 0, B2: 1, B1: 0, B0: 1, Cin: 0 },
        outputs: { S3: 1, S2: 0, S1: 0, S0: 1, Cout: 0 },
      },
      // 7 + 8 = 15 -> BCD 1 5 with carry
      {
        inputs: { A3: 0, A2: 1, A1: 1, A0: 1, B3: 1, B2: 0, B1: 0, B0: 0, Cin: 0 },
        outputs: { S3: 0, S2: 1, S1: 0, S0: 1, Cout: 1 },
      },
    ],
  },
  {
    slug: "cla-sample",
    name: "Carry Look-Ahead Adder (Sample)",
    category: "Lookahead",
    description:
      "CLA uses generate/propagate to compute carries in parallel. Sample rows illustrate outputs; full table omitted.",
    inputs: ["A1", "A0", "B1", "B0", "Cin"],
    outputs: ["S1", "S0", "Cout"],
    truthTable: [
      { inputs: { A1: 0, A0: 1, B1: 0, B0: 1, Cin: 0 }, outputs: { S1: 1, S0: 0, Cout: 0 } }, // 1+1=2
      { inputs: { A1: 1, A0: 0, B1: 1, B0: 1, Cin: 0 }, outputs: { S1: 0, S0: 1, Cout: 1 } },
    ],
  },
  {
    slug: "counter-2bit-up",
    name: "2-bit Synchronous Up Counter (Transition Table)",
    category: "Counter",
    description:
      "Shows next state for a 2-bit up counter. Inputs are current state; outputs are next state after a clock.",
    inputs: ["Q1", "Q0"],
    outputs: ["Q1_next", "Q0_next"],
    truthTable: [
      { inputs: { Q1: 0, Q0: 0 }, outputs: { Q1_next: 0, Q0_next: 1 } },
      { inputs: { Q1: 0, Q0: 1 }, outputs: { Q1_next: 1, Q0_next: 0 } },
      { inputs: { Q1: 1, Q0: 0 }, outputs: { Q1_next: 1, Q0_next: 1 } },
      { inputs: { Q1: 1, Q0: 1 }, outputs: { Q1_next: 0, Q0_next: 0 } },
    ],
  },
  {
    slug: "counter-2bit-down",
    name: "2-bit Asynchronous Down Counter (Transition Table)",
    category: "Counter",
    description:
      "Shows next state for a 2-bit down counter. Inputs are current state; outputs are next state after a clock.",
    inputs: ["Q1", "Q0"],
    outputs: ["Q1_next", "Q0_next"],
    truthTable: [
      { inputs: { Q1: 0, Q0: 0 }, outputs: { Q1_next: 1, Q0_next: 1 } },
      { inputs: { Q1: 0, Q0: 1 }, outputs: { Q1_next: 0, Q0_next: 0 } },
      { inputs: { Q1: 1, Q0: 0 }, outputs: { Q1_next: 0, Q0_next: 1 } },
      { inputs: { Q1: 1, Q0: 1 }, outputs: { Q1_next: 1, Q0_next: 0 } },
    ],
  },
]

export function getCircuitBySlug(slug: string) {
  return circuits.find((c) => c.slug === slug)
}
