/* Build script for "Rate Like a Rater".
 * Reads the canonical JSON data files and inlines the data they need into the
 * HTML template, producing a single standalone file (rate-like-a-rater.html)
 * that runs with no server and no fetch (Chromebook / file:// friendly).
 *
 * Run:  node build.js
 */
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const rubric = JSON.parse(fs.readFileSync(path.join(dir, "rubric.json"), "utf8"));
const docs = JSON.parse(fs.readFileSync(path.join(dir, "documents.json"), "utf8"));
const essays = JSON.parse(fs.readFileSync(path.join(dir, "essays.json"), "utf8"));

// Training essays (5 anchors + 2 practice papers) are shown with NEUTRAL LETTERS
// in a deliberately scrambled order so the label never reveals the score — students
// infer quality instead of being told it (and aren't discouraged by a "perfect 5").
// `paragraphs` = sentence counts per paragraph (used to render paragraph breaks).
//
// ┌─────────── TEACHER KEY (letter → actual level) — NOT shown in the student UI ───────────┐
// │  A = Level 2 (anchor)            E = Level 3 (anchor)   ← a "target" paper               │
// │  B = Level 3 (practice paper)    ← a "target" paper     F = Level 1 (practice paper)  ← "low"
// │  C = Level 5 (anchor)            G = Level 4 (anchor)                                     │
// │  D = Level 1 (anchor)   ← a "low" paper     H = Level 2 (practice paper, no documents cited)
// │                                                                                          │
// │  For comparing a 1 / 2 / 3:   1s = D, F      2s = A, H      3s = B, E                     │
// │  H is the fluent-but-uncited essay: great for the "you must cite documents" lesson.      │
// └─────────────────────────────────────────────────────────────────────────────────────────┘
const trainingDefs = [
  { letter: "A", pool: "anchor",   key: "level_2", paragraphs: [17, 7, 4] },
  { letter: "B", pool: "practice", key: "paper_a", paragraphs: [6, 8, 4, 1, 5, 3] },
  { letter: "C", pool: "anchor",   key: "level_5", paragraphs: [4, 12, 16, 8] },
  { letter: "D", pool: "anchor",   key: "level_1", paragraphs: [2, 3, 3, 2, 1] },
  { letter: "E", pool: "anchor",   key: "level_3", paragraphs: [4, 11, 9, 6, 3] },
  { letter: "F", pool: "practice", key: "paper_c", paragraphs: [12] },
  { letter: "G", pool: "anchor",   key: "level_4", paragraphs: [5, 10, 12, 6] },
  { letter: "H", pool: "practice", key: "paper_e", paragraphs: [11] }
];

const anchors = trainingDefs.map(def => {
  const src = def.pool === "anchor" ? essays.anchor_papers : essays.practice_papers;
  const e = src[def.key];
  if (!e || !Array.isArray(e.sentences)) {
    throw new Error(`${def.key}.sentences is not tagged yet — expected an array.`);
  }
  const sum = def.paragraphs.reduce((a, b) => a + b, 0);
  if (sum !== e.sentences.length) {
    throw new Error(`${def.key} paragraph breaks (${sum}) do not match sentence count (${e.sentences.length}).`);
  }
  return {
    id: def.key,
    letter: def.letter,
    score: e.score,            // kept in data for export/teacher use; never shown in the training UI
    paragraphs: def.paragraphs,
    sentences: e.sentences.map(s => ({ id: s.id, text: s.text, tags: s.tags }))
  };
});

// The "Rate the Essay" task uses FRESH papers the students did NOT train on
// (paper_a / paper_c / paper_e are now in the training pool above, so they're excluded).
// Shown with neutral "Paper A/B" labels; the real level is hidden until the student
// submits a score. NOTE: only the L4 and L5 papers remain fresh — if in-range rating
// practice is wanted, add an L1–L3 paper here (it will overlap with the training pool).
const practiceOrder = ["paper_b", "paper_d"];
const practices = practiceOrder.map(key => {
  const p = essays.practice_papers[key];
  if (!p) throw new Error(`practice paper ${key} not found.`);
  return {
    id: key,
    label: p.label,
    score: p.score,
    raw_text: p.raw_text,
    rater_commentary_summary: p.rater_commentary_summary
  };
});

const data = {
  meta: {
    title: "Rate Like a Rater",
    exam: rubric.exam,
    topic: rubric.topic
  },
  dimensions: rubric.dimensions,
  anchors: anchors,
  defaultEssayId: "level_3",
  practices: practices,
  defaultPracticeId: "paper_b",
  documents: docs.documents.map(d => ({
    id: d.id,
    title: d.title,
    source: d.source,
    type: d.type,
    content: d.content,
    image_description: d.image_description || null,
    preamble: d.preamble || null,
    image_file: d.image_file || null
  })),
  scoreLevels: rubric.score_levels
};

const template = fs.readFileSync(path.join(dir, "rate-like-a-rater.template.html"), "utf8");
// JSON.stringify is safe to inline inside a <script> as long as we guard "</script>".
const json = JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>").replace(/<!--/g, "<\\!--");
const out = template.replace("__SIM_DATA__", json);

fs.writeFileSync(path.join(dir, "rate-like-a-rater.html"), out, "utf8");
console.log("Built rate-like-a-rater.html (" + out.length + " bytes)");
data.anchors.forEach(a => console.log("  Essay " + a.letter + " (L" + a.score + ", " + a.id + ") — " + a.sentences.length + " sentences"));
console.log("Rate-task papers:", data.practices.map((p, i) => "Paper " + String.fromCharCode(65 + i) + "=L" + p.score).join(", "));
