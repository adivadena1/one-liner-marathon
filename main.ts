import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const JOKE: string =
  "I bought a standing desk to fix my posture, so now I slouch vertically — same back pain, but at a higher tax bracket.";

const MAX_CHARS: number = 280;
const OUTPUT_PATH: string = "/output/entry.txt";

function fail(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate: exactly one line, one sentence, no trailing newline inside the joke.
  if (JOKE.includes("\n") || JOKE.includes("\r")) {
    fail("Joke must be a single line with no line breaks.");
  }
  if (JOKE.trim().length === 0) {
    fail("Joke must not be empty or whitespace-only.");
  }
  if (JOKE.length < 1 || JOKE.length > MAX_CHARS) {
    fail(
      `Joke must be 1-${MAX_CHARS} characters, got ${JOKE.length} characters.`,
    );
  }

  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, JOKE, { encoding: "utf8" });

  // Round-trip check: what landed on disk must be byte-identical to the
  // validated joke, with no added newline or encoding surprise.
  const written: string = readFileSync(OUTPUT_PATH, { encoding: "utf8" });
  if (written !== JOKE) {
    fail(
      `Round-trip check failed: file holds ${written.length} characters, expected ${JOKE.length}.`,
    );
  }
  if (written.endsWith("\n") || written.endsWith("\r")) {
    fail("Round-trip check failed: file must not end with a newline.");
  }

  console.log(`Wrote ${JOKE.length} characters to ${OUTPUT_PATH}`);
}

main();
