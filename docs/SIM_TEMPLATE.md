# Sim Template Guide

When creating a new simulation, start from:

```
simulations/<subject>/<grade-band>/<sim-slug>/index.html
```

## Grade Bands
| Folder | Grades |
|--------|--------|
| `k2`   | K–2    |
| `35`   | 3–5    |
| `68`   | 6–8    |
| `912`  | 9–12   |

## Subjects
`math` · `science` · `ela` · `social-studies` · `other`

## Required HTML Imports
```html
<link rel="stylesheet" href="../../../../shared/css/tokens.css">
<link rel="stylesheet" href="../../../../shared/css/sim-base.css">
<script src="../../../../shared/js/sim-core.js" defer></script>
<script src="../../../../shared/js/storage.js" defer></script>
<script src="../../../../shared/js/print.js" defer></script>
<!-- Only if AI features: -->
<script src="../../../../shared/js/ai.js" defer></script>
```

## Required meta.json Fields
```json
{
  "title": "Human-readable sim title",
  "subject": "science",
  "gradeBand": "68",
  "gradeRange": "6-8",
  "standards": ["NGSS MS-LS1-1"],
  "timeMinutes": 45,
  "aiPowered": false,
  "author": "Teacher name or handle",
  "version": "1.0.0"
}
```
