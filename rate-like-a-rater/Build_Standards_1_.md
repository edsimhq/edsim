# EdSim — Simulation Build Standards

All simulations published to edsim.org must meet these standards before release.
This document is the authoritative source of truth. Memory entries are working copies — this file wins if they conflict.

---

## 0. Student Data Protection ⚠️

> **This is the highest-priority standard. No other consideration overrides it.**

EdSim serves minors in K–12 classrooms. Student data must be protected at every layer of every sim — in how it's collected, stored, transmitted, and displayed.

**What counts as student data:**
- Names, class periods, grade levels
- Written responses, answers, and scores
- Any identifier that could connect a real student to their work

**Non-negotiable rules:**

- **No student can see another student's data** — ever. Shared leaderboards, class-wide displays, or any aggregated view must be teacher-only, password-protected, and never accessible from the student-facing interface.
- **Write-only external endpoints** — if a sim sends data to Google Sheets or any external service, that connection must be write-only. Students must have no path to read data back from it.
- **No raw data in the UI** — never render API responses, storage keys, or data structures directly in the student interface. All displayed content must be intentionally formatted.
- **Minimize what you collect** — only collect what the sim actually needs. First name and period, not full name and student ID. If you don't need it, don't ask for it.
- **No third-party tracking** — no analytics scripts, ad networks, or external embeds that could collect student behavior data.
- **localStorage is per-device, not per-student** — on shared Chromebooks or classroom devices, localStorage persists across student logins. To protect against one student seeing another's saved work, every sim must clear localStorage automatically after any successful export (Save as PDF or Copy Text). See Sections 3 and 5 for implementation details.
- **Graceful failure over exposure** — if an API call fails, display a neutral message and let the student continue. Never surface error details, endpoint URLs, or response structure.
- **Test the student view before every release** — log in as a student and verify there is no path to teacher data, other students' work, or any backend structure.

> Any sim that cannot meet all of the above requirements must not be published until it does.

---

## 1. Navigation

Every multi-tab activity must include **both**:
- **Tab navigation** — clicking any tab jumps directly to that section
- **Next / Previous buttons** — visible at the bottom of every tab panel, allowing sequential progression through the activity

This supports teacher-paced whole-class use and self-paced individual work simultaneously.

---

## 2. Directions on Page One

The **first tab** of every activity must include student-facing directions **before** any interactive content:
- What each tab contains
- Approximate time per section
- What students are working toward by the end of the activity

Students should never click into an activity without knowing what they're doing and why.

---

## 3. Student Export Options

Every activity must include at least one of the following export mechanisms, and may include both:

**Option A — Save as PDF**
- Opens a **section-select modal** before printing
- Allows students to choose which sections to include
- On confirmed successful download, clears localStorage and resets the sim to a blank state

**Option B — Copy Text**
- Copies all student responses to the clipboard as plain text
- Students paste into their own Google Doc or school account — work follows the student, not the device
- On confirmed successful copy, clears localStorage and resets the sim to a blank state
- Recommended for Chromebook-first classrooms where Google Docs is the natural destination

**Multi-session workflow:** Students who cannot finish in one sitting should export what they have (PDF or Copy Text), then complete the remainder in a second session and submit two exports. This is the expected and supported workflow — no special partial-save handling is required.

**Reset behavior:** localStorage clear and sim reset must only fire on confirmed export success. If the PDF download is blocked or the clipboard write fails, the reset must not trigger.

---

## 4. Print / Paper Worksheets

When a print layout is included:
- All page containers and writing areas must use `overflow: visible` — no clipping in browser print or artifact preview
- Writing response boxes must **size to fit their content**, not clip it
- Line counts in handwriting areas should be generous enough for realistic student responses

---

## 5. Local Storage (Auto-Save)

All standalone activities must **auto-save to localStorage** as students work, covering:
- All textareas
- All selections and multiple-choice answers
- Scores and progress states
- Drag-and-drop placements
- Any other interactive state

Behavior requirements:
- Restores automatically on reopen — no student action required
- Per-device (not per-student account)
- Use a unique `LS_KEY` per activity to avoid collisions (e.g. `edsim_coldwar_v2`)

**Export-triggered reset (shared device protection):**
After any successful export (Save as PDF or Copy Text), the sim must:
1. Confirm the export succeeded (download initiated or clipboard write confirmed)
2. Clear the activity's localStorage key entirely (`localStorage.removeItem(LS_KEY)`)
3. Reset all in-memory state to its initial blank values
4. Return the sim to the start screen

This ensures the next student on a shared Chromebook begins with a completely clean slate. The reset must never fire if the export fails.

```javascript
// Export-triggered reset pattern
async function handleCopyText() {
  try {
    await navigator.clipboard.writeText(buildExportText());
    // Only reset after confirmed success
    localStorage.removeItem(LS_KEY);
    resetSimState();
    showMessage("Copied! Paste into your Google Doc. Starting fresh for the next student.");
  } catch (err) {
    showMessage("Copy failed — your work is still saved. Try again.");
  }
}
```

> ⚠️ **Critical:** Do NOT use localStorage inside Claude.ai artifacts. localStorage only works in standalone HTML files opened directly in a browser. Artifacts use in-memory state only.

---

## 6. Accessibility

- All interactive elements must be **keyboard accessible** (tab, enter, arrow keys where appropriate)
- Use `aria-label` on all icon-only buttons
- Minimum contrast ratio: **4.5:1** for all text against its background
- All sims must be usable on a **tablet (768px minimum width)**
- No horizontal scrolling at any supported viewport
- Touch targets must be a minimum of **44px** in height and width

---

## 7. AI-Powered Features

When a sim includes AI-powered sections:
- Show a **loading state** while the API call is in progress (spinner, animated text, or similar)
- Handle API errors **gracefully** — display a friendly user-facing message (e.g. "Unable to load feedback right now — you can continue with the rest of the activity")
- AI sections must **never block** the rest of the sim from being used if the API call fails
- Never expose raw error messages or API response structure to students

---

## 8. Editing and Rebuild Policy

> **Never rebuild a file without explicit permission.**

When a sim needs changes:
1. Propose specific patch targets (line ranges, function names, sections)
2. Get approval before making any edits
3. Make targeted edits only — do not rewrite surrounding code

Rebuilds are expensive in time and token cost and risk losing working code. Only rebuild if the user explicitly requests it.

---

## 9. IP Requirements (Creator Compliance)

All content submitted to EdSim must be created on:
- Personal devices
- Personal networks or cellular hotspots
- Personal AI subscriptions authenticated with personal email accounts
- Personal hosting infrastructure

Creators certify via contributor agreement that no school district has a legitimate ownership claim over submitted content.

---

## 10. CSS Architecture — Theming

All sims must use **CSS custom properties (variables)** for every color, background, and border value. No hardcoded hex values in component or layout rules.

Define all theme tokens in `:root` at the top of the stylesheet:

```css
:root {
  --bg-base: #0f1117;
  --bg-card: #1c1f2b;
  --bg-card-hover: #22263a;
  --text-primary: #f0f0f0;
  --text-muted: #888;
  --border: #2a2a2a;
  --accent: #e8ff47;
  --accent-secondary: #ff6b35;
}
```

**Why this matters:** Hardcoded hex values survive initial builds but break the moment a theme changes. Every major color revision in past sims (dark mode conversions, round-specific backgrounds, card styling overhauls) required hunting down individual hex values scattered through hundreds of lines of CSS. CSS variables reduce that to a single `:root` edit.

> ⚠️ **Never use `background-color: white` or `color: #475569` (or similar light-theme literals) in component rules.** These are the most common causes of invisible text and invisible cards after a theme change.

---

## 11. State Management — Deep Clone on Save

Any sim that saves nested state objects (student portfolios, stock picks, drag-and-drop placements, multi-field forms) must use **deep cloning** on every save operation. Shallow spreads silently drop nested data.

**Wrong:**
```javascript
setPortfolio({ ...portfolio, [field]: value }); // loses nested objects
```

**Correct:**
```javascript
setPortfolio(prev => ({
  ...prev,
  stocks: { ...prev.stocks, [ticker]: value }
}));
```

For complex state trees, use `structuredClone()` or a utility like lodash `cloneDeep`.

---

## 12. Navigation State — Always Reset on Load

Multi-view sims (landing → student → teacher, or tab-based flows) must **always initialize to the landing/home view**, regardless of any previously persisted state.

**Wrong:** Loading a cached `mode: "student"` from storage traps users inside a view with no exit.

**Correct:** On every load, reset mode to `"landing"` or equivalent before restoring any other saved state. Persisted state should restore *content* (answers, selections) but never *navigation position*.

Exit buttons must:
- Be visually prominent and always visible (sticky header or fixed position)
- Clear all view-specific state when returning home (not just change the `mode` variable)

---

## 13. HTML Validity — IDs and Selectors

Element `id` attributes must contain no spaces. An `id` with a space (e.g. `id="Evidence Bank"`) is invalid HTML and causes JavaScript selectors (`getElementById`, `querySelector`) to silently fail with no console error.

**Wrong:** `<div id="Evidence Bank">`  
**Correct:** `<div id="evidenceBank">` or `<div id="evidence-bank">`

Before deploying, verify that all `id` values:
- Contain no spaces or special characters
- Are unique within the document
- Match exactly what JavaScript references

---

## 14. Feature Layering — Manual First, AI Second

When planning a sim that includes AI-powered features (auto-parsing, feedback generation, adaptive content), build the **manual version first** and confirm it works before adding AI.

This pattern has proven reliable across multiple builds:
1. Build the complete manual workflow (forms, fields, save/load, display)
2. Test with real or simulated student input
3. Add AI as an enhancement layer on top of the confirmed-working manual base

Adding AI to a broken manual foundation multiplies debugging complexity. A confirmed-working base means AI failures are isolated and easier to diagnose.

---

## 15. External Data Connections (Google Sheets / API Endpoints)

When a sim writes student data to a Google Apps Script endpoint or external API:

- The endpoint must return **JSON**, not plain text — use `ContentService.MimeType.JSON`
- Wrap all endpoint logic in `try/catch` and return a structured error response on failure
- The sim must handle endpoint failures gracefully — display a user-facing message, do not crash or expose raw error output
- Student-facing sims must use **write-only endpoints** — students should never be able to read other students' data through the sim interface
- Document the endpoint URL in code comments and in the sim's admin/teacher panel

```javascript
// Google Apps Script pattern
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    // ... write to sheet
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('EdSim endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

---

## 16. AI Provider Abstraction — Multi-Engine Compatibility

EdSim sims must never hardcode a direct call to a specific AI provider. All AI features must route through a provider-agnostic configuration layer so districts can substitute their own AI contract without touching sim code.

**Required pattern — AI config object:**

Every sim with AI features must declare an `AI_CONFIG` object at the top of its script:

```javascript
const AI_CONFIG = {
  provider: "anthropic",          // "anthropic" | "openai" | "gemini" | "custom"
  endpoint: "https://proxy.edsim.org/v1/chat", // EdSim proxy — never a direct provider URL
  model: "claude-sonnet-4-20250514",
  apiKey: null                    // null = handled by proxy; string = district-supplied key
};
```

**All AI calls must go through a single helper function:**

```javascript
async function callAI(prompt) {
  try {
    const response = await fetch(AI_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(AI_CONFIG.apiKey ? { "x-api-key": AI_CONFIG.apiKey } : {})
      },
      body: JSON.stringify({
        provider: AI_CONFIG.provider,
        model: AI_CONFIG.model,
        prompt: prompt
      })
    });
    const data = await response.json();
    return data.text ?? null;
  } catch (err) {
    return null; // Caller handles graceful failure per Section 7
  }
}
```

**Rules:**
- Sims call `callAI()` only — no provider URLs anywhere else in sim code
- All provider-specific formatting lives inside the proxy, not the sim
- Districts override `AI_CONFIG.endpoint` and `AI_CONFIG.apiKey` via a config file or query parameter — no sim code changes required
- Document which AI features a sim uses and what prompt templates it sends in the sim's header comments

---

## 17. API Key Security

API keys must never appear in client-side HTML, CSS, or JavaScript that ships to students or is publicly accessible.

**Non-negotiable rules:**
- No API keys in standalone HTML files
- No API keys in GitHub repositories (public or private)
- All production AI calls route through the EdSim proxy server, which holds credentials server-side
- For district deployments, districts supply their own endpoint — EdSim never stores district credentials

**Development exception:**
During local development only, a key may be used directly for testing. It must be removed before any file is shared, uploaded to GitHub, or deployed.

**Why this matters for district adoption:**
District IT directors will inspect your source code. An exposed API key is an immediate disqualifier — both as a security red flag and as evidence the platform isn't production-ready. The proxy layer is what makes EdSim safe to deploy at scale.

> ⚠️ **The EdSim proxy server is core platform infrastructure, not optional.** It is the mechanism that makes multi-district, multi-provider deployment possible.

---

## 18. Voice-to-Text Input

Voice-to-text input is supported in EdSim sims using the browser-native **Web Speech API** — no external service, no API key, no data leaving the device.

**Compatibility:** Chrome and Chromium-based browsers (covers the majority of school Chromebooks). Not supported in Firefox or Safari — sims must degrade gracefully.

**Rules:**
- Voice input is always **optional** — keyboard input remains the primary path for all text fields
- Every voice-enabled field must have a visible mic button with `aria-label="Start voice input"`
- The mic button must show a clear active/recording state (color change, animated indicator)
- If the Web Speech API is unavailable, the mic button must hide itself — never show a broken control
- Transcribed text appends to existing field content (does not overwrite) unless the field is empty

**Reusable implementation pattern:**

```javascript
function addVoiceInput(textarea) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  const btn = document.createElement('button');
  btn.innerHTML = '🎤';
  btn.setAttribute('aria-label', 'Start voice input');
  btn.className = 'voice-btn';

  let recording = false;

  btn.addEventListener('click', () => {
    if (recording) {
      recognition.stop();
    } else {
      recognition.start();
      btn.classList.add('recording');
      recording = true;
    }
  });

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    textarea.value = textarea.value
      ? textarea.value + ' ' + transcript
      : transcript;
    textarea.dispatchEvent(new Event('input')); // triggers autosave
  };

  recognition.onend = () => {
    btn.classList.remove('recording');
    recording = false;
  };

  recognition.onerror = () => {
    btn.classList.remove('recording');
    recording = false;
  };

  textarea.parentNode.insertBefore(btn, textarea.nextSibling);
}
```

> Note: Voice input uses the device microphone only. No audio is transmitted to any server. This is consistent with EdSim's no-PII, no-external-data-transmission design standard.

---

## Platform Reference

| Item | Value |
|---|---|
| Brand name | EdSim |
| Domain | edsim.org |
| Contact | edsimhq@gmail.com |
| GitHub | edsimhq |
| Stack | Vanilla HTML / CSS / JS |
| AI layer | Provider-agnostic via EdSim proxy |
| Default model | claude-sonnet-4-20250514 |

---

*Last updated: May 2026*
