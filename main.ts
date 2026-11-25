// The Most Boring Object, Reviewed in One Line — make.fun entry
// Entry: a one-star review of a coaster. The joke comes from how the
// object really behaves: a coaster does nothing visible for years, and
// you only notice it the day it goes missing — when the table gets a
// ring it will wear forever.
//
// The review is built from named parts so the turn lands in order:
// the rating, the decade of quiet service, the disappearance, and the
// punchline — the table now wearing the very ring the coaster used to
// prevent.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry line, assembled from its parts.
const RATING = "One star.";
const SERVICE =
  "My coaster spent ten years quietly saving the table from rings,";
const DISCOVERY = "and I only noticed it existed the day it went missing";
const PUNCH = "— the table has worn a ring ever since.";

function buildEntry(): string {
  return [RATING, SERVICE, DISCOVERY, PUNCH].join(" ");
}

// Gate: 1-200 characters, single line, non-blank.
interface GateReport {
  ok: boolean;
  codePoints: number;
  lines: number;
}

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  const lines = text.split("\n").length;
  const ok =
    codePoints >= 1 && codePoints <= 200 && lines === 1 && text.trim().length > 0;
  return { ok, codePoints, lines };
}

function verifyWritten(path: string): string {
  const written = readFileSync(path, "utf8");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const entry = buildEntry();
  const gate = validateEntry(entry);
  if (!gate.ok) {
    throw new Error(
      `gate failed: ${gate.codePoints} code points, ${gate.lines} lines`,
    );
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entry, "utf8");
  const sha256 = verifyWritten(outPath);
  console.log(
    `gate passes: ${gate.codePoints} code points, ${gate.lines} line, sha256 ${sha256}`,
  );
  console.log(`wrote ${outPath}`);
  console.log(`verified: ${JSON.stringify(entry)}`);
}

main();
