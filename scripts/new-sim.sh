#!/usr/bin/env bash
# Usage: ./scripts/new-sim.sh <subject> <grade-band> <sim-slug>
# Example: ./scripts/new-sim.sh science 68 cell-division

set -e

SUBJECT=$1
GRADE=$2
SLUG=$3

if [ -z "$SUBJECT" ] || [ -z "$GRADE" ] || [ -z "$SLUG" ]; then
  echo "Usage: $0 <subject> <grade-band> <sim-slug>"
  echo "  subject:    math | science | ela | social-studies | other"
  echo "  grade-band: k2 | 35 | 68 | 912"
  echo "  sim-slug:   kebab-case name (e.g. cell-division)"
  exit 1
fi

DIR="simulations/$SUBJECT/$GRADE/$SLUG"

if [ -d "$DIR" ]; then
  echo "Error: $DIR already exists."
  exit 1
fi

mkdir -p "$DIR"

# meta.json
cat > "$DIR/meta.json" << JSON
{
  "title": "",
  "subject": "$SUBJECT",
  "gradeBand": "$GRADE",
  "gradeRange": "",
  "standards": [],
  "timeMinutes": 45,
  "aiPowered": false,
  "author": "",
  "version": "1.0.0"
}
JSON

# index.html scaffold
cat > "$DIR/index.html" << HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EdSim — Simulation Title</title>
  <link rel="stylesheet" href="../../../../shared/css/tokens.css" />
  <link rel="stylesheet" href="../../../../shared/css/sim-base.css" />
  <script src="../../../../shared/js/sim-core.js" defer></script>
  <script src="../../../../shared/js/storage.js" defer></script>
  <script src="../../../../shared/js/print.js" defer></script>
</head>
<body>
<div class="sim-container" id="sim">

  <header class="sim-header">
    <h1>Simulation Title</h1>
    <div class="sim-meta">Subject · Grade Band · ~45 min</div>
  </header>

  <nav class="tab-nav" role="tablist">
    <button class="tab-btn" role="tab">📋 Directions</button>
    <button class="tab-btn" role="tab">Tab 2</button>
    <button class="tab-btn" role="tab">Tab 3</button>
    <button class="tab-btn" role="tab">✅ Reflection</button>
  </nav>

  <!-- TAB 1: Directions -->
  <section class="tab-panel" id="tab-directions">
    <h2>Welcome!</h2>
    <p>Here's what you'll do in this activity:</p>
    <ul>
      <li><strong>Tab 2</strong> — Description (~10 min)</li>
      <li><strong>Tab 3</strong> — Description (~20 min)</li>
      <li><strong>Reflection</strong> — Wrap-up (~10 min)</li>
    </ul>
    <p>By the end, you will be able to: [learning objective].</p>
  </section>

  <!-- TAB 2 -->
  <section class="tab-panel" id="tab-2">
    <h2>Tab 2</h2>
    <textarea class="response-box" data-save="tab2-response" placeholder="Your response here…"></textarea>
  </section>

  <!-- TAB 3 -->
  <section class="tab-panel" id="tab-3">
    <h2>Tab 3</h2>
    <textarea class="response-box" data-save="tab3-response" placeholder="Your response here…"></textarea>
  </section>

  <!-- TAB 4: Reflection -->
  <section class="tab-panel" id="tab-reflection">
    <h2>Reflection</h2>
    <label>What was the most important thing you learned?</label>
    <textarea class="response-box" data-save="reflection" placeholder="Write your reflection…"></textarea>
  </section>

  <!-- Prev / Next + PDF -->
  <div class="tab-nav-buttons">
    <button class="btn btn-secondary" id="btn-prev">← Previous</button>
    <button class="btn btn-accent no-print" id="btn-save-pdf">💾 Save as PDF</button>
    <button class="btn btn-primary" id="btn-next">Next →</button>
  </div>

</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    initTabs('sim');
    initStorage('$SLUG');
    initPrint([
      { id: 'tab-directions', label: 'Directions' },
      { id: 'tab-2',          label: 'Tab 2' },
      { id: 'tab-3',          label: 'Tab 3' },
      { id: 'tab-reflection', label: 'Reflection' }
    ]);
  });
</script>
</body>
</html>
HTML

echo ""
echo "✅ Created: $DIR/"
echo "   Next steps:"
echo "   1. Edit $DIR/meta.json — fill in title, gradeRange, standards, author"
echo "   2. Open $DIR/index.html and build your sim"
