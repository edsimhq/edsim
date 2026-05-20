# EdSim Build Standards

All simulations published to edsim.org must meet these standards.

---

## 1. Navigation
- Every multi-tab activity must have **clickable tab navigation** (jump to any tab).
- **Prev / Next buttons** must be visible at the bottom of every tab panel.

## 2. Directions on Page One
- Tab 1 must include **student-facing directions**: what each tab contains, approximate time per section, and what students are working toward by the end.

## 3. Save as PDF
- A **"Save as PDF" button** must open a section-select modal so students can choose which sections to include before printing.
- Supports partial saves across multiple sessions.

## 4. Print / Paper Worksheets
- All page containers and writing areas must use `overflow: visible`.
- Writing response boxes must **size to fit content** — never clip it.

## 5. Local Storage (Auto-save)
- All activities must **auto-save to localStorage** as students work (textareas, selections, scores, drag placements, interactive states).
- Must restore automatically on reopen.
- Per-device, not per-student.
- ⚠️ **Do NOT use localStorage inside Claude.ai artifacts** — only in standalone HTML files opened directly in a browser.

## 6. Accessibility
- All interactive elements must be **keyboard accessible**.
- Use `aria-label` on icon-only buttons.
- Minimum contrast ratio: **4.5:1** for all text.
- All sims must be usable on a **tablet (768px minimum width)**. No horizontal scrolling.
- Touch targets minimum **44px**.

## 7. AI Features
- AI-powered sections must show a **loading state**.
- Handle API errors **gracefully** with a user-facing message.
- AI sections must **never block** the rest of the sim from being used.
