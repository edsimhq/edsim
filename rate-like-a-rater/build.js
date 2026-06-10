/* Build script for "Rate Like a Rater" — Level 3.
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

const level3 = essays.anchor_papers.level_3;
if (!Array.isArray(level3.sentences)) {
  throw new Error("level_3.sentences is not tagged yet — expected an array.");
}

// Paragraph structure of the Level 3 anchor (sentence counts per paragraph):
// intro(4) / historical circumstances(11) / efforts(9) / impact(6) / conclusion(3)
const paragraphs = [4, 11, 9, 6, 3];
const sum = paragraphs.reduce((a, b) => a + b, 0);
if (sum !== level3.sentences.length) {
  throw new Error(`Paragraph breaks (${sum}) do not match sentence count (${level3.sentences.length}).`);
}

const paperA = essays.practice_papers.paper_a;

const data = {
  meta: {
    title: "Rate Like a Rater",
    exam: rubric.exam,
    topic: rubric.topic
  },
  dimensions: rubric.dimensions,
  essay: {
    label: level3.label,
    score: level3.score,
    paragraphs: paragraphs,
    sentences: level3.sentences.map(s => ({ id: s.id, text: s.text, tags: s.tags }))
  },
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
  practice: {
    label: paperA.label,
    score: paperA.score,
    raw_text: paperA.raw_text,
    rater_commentary_summary: paperA.rater_commentary_summary
  },
  scoreLevels: rubric.score_levels
};

const template = fs.readFileSync(path.join(dir, "rate-like-a-rater.template.html"), "utf8");
// JSON.stringify is safe to inline inside a <script> as long as we guard "</script>".
const json = JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>").replace(/<!--/g, "<\\!--");
const out = template.replace("__SIM_DATA__", json);

fs.writeFileSync(path.join(dir, "rate-like-a-rater.html"), out, "utf8");
console.log("Built rate-like-a-rater.html (" + out.length + " bytes)");
console.log("Sentences:", data.essay.sentences.length, "| Documents:", data.documents.length,
            "| Practice paper:", data.practice.label, "score", data.practice.score);
