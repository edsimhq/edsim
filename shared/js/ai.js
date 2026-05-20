/**
 * EDSIM.ORG — AI Helper
 * Wraps calls to the Anthropic API for AI-powered sim sections.
 * Handles loading states and graceful error display.
 */

async function askClaude({ prompt, outputEl, loadingMsg = 'Thinking…', model = 'claude-sonnet-4-20250514' }) {
  if (!outputEl) return;
  outputEl.textContent = loadingMsg;
  outputEl.setAttribute('aria-busy', 'true');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text || '').join('') || 'No response.';
    outputEl.textContent = text;
  } catch (err) {
    outputEl.textContent = 'Unable to load AI feedback right now. You can continue with the rest of the activity.';
    console.error('EdSim AI error:', err);
  } finally {
    outputEl.removeAttribute('aria-busy');
  }
}
