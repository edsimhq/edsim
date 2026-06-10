# Rate Like a Rater — Project Spec

## Overview

**"Rate Like a Rater"** is a guided rater-training simulation that teaches students how Regents Civic Literacy Essays are scored. Students work through rubric dimensions one at a time, clicking sentences in real anchor essays to identify what the rubric is measuring, with the source documents accessible for cross-referencing.

**Sim type:** Standalone HTML (single file, vanilla JS/CSS)
**Deploy target:** `edsim.org/rate-like-a-rater/` via GitHub Pages
**Build standards:** `/Build_Standards_1_.md` is authoritative — read it before writing any code.
**Template reference:** `coldwar-vocab-4.html` for EdSim design language (dark theme, CSS variables, structure). Use as structural reference only, not compliance baseline.

---

## Architecture

### Three-Phase Student Experience

**Phase 1 — Dashboard (Main Screen)**
Student sees cards for each rubric dimension. Each card is a standalone task:

1. **Task Development** — Does the essay address all aspects (historical circumstances, efforts, impact)?
2. **Analytical vs. Descriptive** — Which sentences analyze vs. merely describe?
3. **Document Use** — Find where the essay incorporates the source documents (Docs 1–6 accessible in a side drawer)
4. **Outside Information** — Find knowledge that goes beyond the documents
5. **Supporting Details** — Are facts, examples, details present and accurate?
6. **Organization** — Intro, conclusion, logical plan — does the intro go beyond restating the theme?
7. **Inaccuracies** — Find what the writer got wrong (advanced task)
8. **🎯 Rate the Essay** — Culminating task: assign a holistic 0–5 score with written justification

### Phase 2 — Guided Dimension Training (Tasks 1–7)

When a student selects a dimension card:

1. **Essay selector** — Pick a score level (5, 4, 3, 2, 1). Each loads the corresponding anchor paper.
2. **Split-screen view:**
   - **Left panel:** The essay text, rendered sentence by sentence. Each sentence is a clickable element.
   - **Right panel / drawer:** Source documents (Docs 1–6) accessible via tabs. Students cross-reference claims in the essay against the actual documents.
3. **Active task bar (top):** Shows the current rubric dimension and what the student is looking for. Example: "Find sentences where this essay uses information from the source documents."
4. **Interaction:** Student clicks a sentence they believe matches the active dimension.
5. **Immediate feedback:** On click, the sentence highlights and a tooltip/panel shows:
   - ✅ Correct — brief explanation (e.g., "This sentence paraphrases information from Document 3 about the Five and Ten Law")
   - ❌ Not quite — explanation of what this sentence actually represents (e.g., "This is outside information, not document use — the WCTU's religious motivations aren't in any of the source documents")
6. **Progress tracker:** Shows how many correct identifications the student has found vs. how many exist in this essay for this dimension.

### Phase 3 — Rate the Essay (Task 8, Culminating)

1. **Essay selector** — Loads a PRACTICE paper (not an anchor — those were used in training). Practice papers A–E available.
2. **Full essay view** — No guided dimension prompts. Student reads the whole essay.
3. **Source documents** still accessible in the drawer.
4. **Score assignment:** Student selects 0–5.
5. **Justification:** Student writes a justification for their score. 
   - **Scaffold option (modification):** An "Auto-populate" button pre-fills a structured justification template the student can edit. This uses static templates, not AI.
6. **Reveal:** After submitting, student sees:
   - The official score
   - The official rater commentary (bullet by bullet)
   - How their score compares
   - If their justification aligned with the official reasoning

---

## Data Structure

### Essay Data (`essays.json`)

All essay text is pre-segmented into sentences. Each sentence has an ID and tags for every rubric dimension.

```json
{
  "anchor_papers": {
    "level_5": {
      "score": 5,
      "type": "anchor",
      "sentences": [
        {
          "id": "5-s01",
          "text": "Alcohol consumption has existed all over the world for thousands of years and in the United States since colonization.",
          "tags": {
            "task_development": { "match": true, "category": "historical_circumstances", "note": "Establishes broad historical context for alcohol in America" },
            "analytical_vs_descriptive": { "match": false, "category": "descriptive", "note": "This is a descriptive statement providing background" },
            "document_use": { "match": false, "note": "This is outside information, not from any document" },
            "outside_information": { "match": true, "note": "Knowledge about the long history of alcohol consumption — not found in any of the 6 source documents" },
            "supporting_details": { "match": true, "note": "Provides a relevant historical detail" },
            "organization": { "match": true, "category": "introduction", "note": "Opening sentence of the introduction" },
            "inaccuracy": { "match": false }
          }
        }
        // ... all sentences for this essay
      ],
      "rater_commentary": {
        "task_development": "Thoroughly develops all aspects of the task evenly and in depth for Prohibition",
        "analytical_vs_descriptive": "Is more analytical than descriptive...",
        "document_use": "Incorporates relevant information from all the documents",
        "outside_information": "Incorporates relevant outside information...",
        "supporting_details": "Richly supports the theme with many relevant facts, examples, and details...",
        "organization": "Demonstrates a logical and clear plan of organization; includes an introduction and a conclusion that are beyond a restatement of the theme",
        "overall_conclusion": "Overall, the response fits the criteria for Level 5..."
      }
    }
  },
  "practice_papers": {
    "paper_a": {
      "score": 3,
      "type": "practice",
      "sentences": [ /* same structure, but tags only used for the reveal */ ],
      "rater_commentary": { /* official commentary */ }
    }
  }
}
```

### Source Documents (`documents.json`)

```json
{
  "documents": [
    {
      "id": "doc1",
      "title": "Document 1",
      "source": "L. Ames Brown, 'Prohibition,' The North American Review, November 1915",
      "type": "text",
      "content": "... The prohibition movement was an outgrowth of the temperance crusades..."
    },
    {
      "id": "doc2",
      "title": "Document 2",
      "source": "Anti-Saloon League of America, 1919",
      "type": "image_and_text",
      "image_description": "National Prohibition Ratification Map showing order of state ratification. By Jan 31 1919, only 4 states had not ratified.",
      "content": "STATEMENT OF THE NATIONAL LEGISLATIVE COMMITTEE OF THE ANTI-SALOON LEAGUE OF AMERICA: The ratification of the Prohibition amendment to the constitution is the consummation of more than twenty-five years of effort..."
    }
    // ... docs 3-6
  ]
}
```

### Rubric (`rubric.json`)

```json
{
  "essay_type": "Civic Literacy Essay",
  "exam": "January 2026",
  "topic": "Prohibition",
  "task": {
    "historical_context": "Throughout United States history, many constitutional and civic issues have been debated...",
    "requirements": [
      "Describe the historical circumstances surrounding this constitutional or civic issue",
      "Explain efforts by individuals, groups, and/or governments to address this constitutional or civic issue",
      "Discuss the impact of the efforts on the United States and/or on American society"
    ]
  },
  "score_levels": {
    "5": {
      "bullets": [
        "Thoroughly develops all aspects of the task evenly and in depth",
        "Is more analytical than descriptive (analyzes, evaluates, and/or creates information)",
        "Incorporates relevant information from at least four documents",
        "Incorporates relevant outside information",
        "Richly supports the theme with many relevant facts, examples, and details",
        "Demonstrates a logical and clear plan of organization; includes an introduction and a conclusion that are beyond a restatement of the theme"
      ]
    }
    // ... levels 4, 3, 2, 1, 0
  }
}
```

---

## UI Layout

### Dashboard Screen
- Dark theme (EdSim standard CSS variables)
- Header: "Rate Like a Rater" + exam info (Jan 2026 — Prohibition)
- 8 cards in a responsive grid (2-3 columns desktop, 1 column tablet)
- Each card shows: dimension name, icon, brief description, progress indicator
- Bottom row: the culminating "Rate the Essay" card (visually distinct — gold accent)

### Training Screen (Dimension Tasks)
- **Top bar:** Active dimension name + instruction prompt + essay level selector (tabs: 5 | 4 | 3 | 2 | 1)
- **Left panel (60%):** Essay text, sentences as distinct clickable blocks. Sentences the student has tagged show their feedback state (green/red border + icon).
- **Right panel (40%):** Tabbed document drawer (Doc 1 | Doc 2 | ... | Doc 6). Each tab loads the document text. Doc 2 and Doc 6 include image descriptions since originals are visual.
- **Bottom bar:** Progress ("Found 4 of 7 document references in this essay") + Back to Dashboard button
- **Responsive:** On tablet, document drawer becomes a slide-out overlay triggered by a "View Documents" button.

### Rate the Essay Screen
- Essay text (full, not sentence-segmented for clicking — this is holistic reading)
- Document drawer still accessible
- Score selector: 0–5 radio buttons or large clickable cards
- Justification textarea with optional "Auto-populate scaffold" button
- Submit → Reveal panel with official score + commentary comparison

---

## Content Tagging Work

**This is the most labor-intensive part of the build.** Each anchor essay must be:

1. Split into individual sentences
2. Each sentence tagged across ALL 7 dimensions with match/no-match + explanation
3. Cross-referenced against the 6 source documents to verify document use claims
4. Checked for inaccuracies against historical record

**Recommended approach:** Do one essay fully (Level 5 anchor) as the reference implementation. Have Mike review the tags. Then proceed with remaining essays.

**Sentence count estimates:**
- Level 5 anchor: ~45-50 sentences across 3 pages
- Level 4 anchor: ~50-55 sentences across 3 pages
- Level 3 anchor: ~35-40 sentences across 3 pages
- Level 2 anchor: ~25-30 sentences across 2 pages
- Level 1 anchor: ~15-20 sentences across 1 page
- Total anchor tagging: ~170-195 sentences × 7 dimensions = ~1,200-1,400 individual tags

---

## Build Standards Compliance Checklist

Per `/Build_Standards_1_.md`:

- [ ] **§0 Student Data Protection** — No PII collected. First name + period for localStorage key only.
- [ ] **§1 Navigation** — Tab nav between dimensions + Next/Prev within a dimension's essay view
- [ ] **§2 Directions** — First screen explains what each section does, time estimates, learning goal
- [ ] **§3 Export** — Save as PDF (section select modal) + Copy Text for justification responses
- [ ] **§5 localStorage** — Auto-save progress (which dimensions completed, which essays viewed, justification drafts). Export-triggered reset.
- [ ] **§6 Accessibility** — Keyboard nav for sentence clicking, aria-labels, 4.5:1 contrast, 44px touch targets, 768px min-width
- [ ] **§10 CSS Variables** — All colors in `:root`, no hardcoded hex
- [ ] **§14 Manual-First** — All feedback is hand-built static content. No AI dependency.

---

## File Inventory for Claude Code

Place these in the project working directory before starting:

| File | Purpose |
|---|---|
| `PROJECT_SPEC.md` | This document |
| `rubric.json` | Full rubric data (all score levels, all bullets) |
| `documents.json` | All 6 source documents with full text |
| `essays.json` | All anchor + practice essays, sentence-segmented, tagged |
| `Build_Standards_1_.md` | Copy from project — authoritative build standards |
| `coldwar-vocab-4.html` | Copy from project — design language reference |

---

## Build Order

1. **Read Build Standards** — non-negotiable first step
2. **Build `rubric.json`** — structure the rubric data
3. **Build `documents.json`** — structure all 6 source documents
4. **Build Level 5 anchor essay tags** — sentence-by-sentence, all 7 dimensions. Get Mike's review.
5. **Build HTML shell** — dashboard + training screen + rate screen, no data yet
6. **Wire Level 5 data** — one essay, one dimension working end-to-end
7. **Mike reviews prototype**
8. **Tag remaining anchor essays** (4, 3, 2, 1)
9. **Tag practice essays** (A–E) for the culminating task
10. **Polish, test, deploy**

---

## Open Questions for Mike

1. **Sim title:** "Rate Like a Rater" rejected. Needs a student-facing name. Candidates discussed: TBD — Mike to decide.
2. **Repo location:** Not yet created. Path TBD.
3. ~~**Doc 2 and Doc 6 images**~~ — RESOLVED. Images provided, saved in `/images/` folder.
4. ~~**Practice Paper E scoring**~~ — RESOLVED. Confirmed Level 2. Paper C is the Level 1.
