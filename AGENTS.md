# Global preferences

## Token efficiency (general practice)

Think thoroughly; act economically. Spend reasoning freely, but minimize expensive
actions. Apply across all projects:

- **Prefer text over images.** Verify with text tools (DOM/page snapshots, console &
  network logs, command output) first. Capture a screenshot/image only when the visual
  itself is the evidence (layout, color, contrast, spacing) -- not as a routine step.
- **Read narrow, search smart.** Locate code with grep/glob or an Explore subagent
  (their file dumps stay in the subagent; only the conclusion returns), then read just
  the needed line ranges -- not whole files. Don't re-read a file just edited.
- **Edit only when required.** No speculative refactors or "while I'm here" cleanups
  beyond the task. Fix what's asked + clearly necessary; skip the rest.
- **Persist, don't re-hold.** Write long-lived output (findings, plans, logs) to a file
  as you go, so context compaction never forces re-reading.
- **Reuse work.** Keep a dev/preview server running and reuse builds when inputs are
  unchanged, instead of rebuilding/restarting per step.
- **Be concise.** Lead with the answer; keep narration proportional to the task.

These optimize cost, not quality -- never skip genuinely needed verification or thinking.
