## Context

Motion is implemented inline across 10 components with no shared module (confirmed: nothing motion-related in `src/lib/`). Measured spread today:

- Durations: `0.8` ×10, `0.5` ×3, `0.2` ×2, plus `0.3`, `1.5`, `2`, `4` (7 distinct).
- Delays: 12 distinct values (`0.1`–`1.1`) including blanks.
- Easing: only 2 of 338 usages specify `ease`; the rest inherit Framer defaults.
- Patterns: "fade up `y:20`" reveal duplicated in hero, landing, events-card, layout — each with different timing and sometimes flipped key order. Scroll reveals (`whileInView` + `viewport={{ once: true }}`) live in `events.jsx` (14) and `location.jsx` (13). Ambient loops: FloatingHearts (`duration:4`, infinite), countdown pulse, CTA arrow nudge (`duration:1.5`, infinite).
- `prefers-reduced-motion`: zero handling anywhere.

The three observable problems (magic numbers, drifting reveals, mismatched page-open) share one root cause: no single source of truth.

## Goals / Non-Goals

**Goals:**

- One module owns motion timing, easing, and recurring variants; components import, never hardcode.
- Equivalent animations become pixel-/timing-identical by construction.
- The landing → main page-open becomes a designed, symmetric pair.
- `prefers-reduced-motion` respected app-wide.

**Non-Goals:**

- No new dependencies (Framer Motion already present).
- No API/data/routing/business-logic changes.
- No visual restyling beyond motion behavior.
- Decorative ambient loops keep their character (tokenized, not removed) — but are suppressed under reduced motion.

## Decisions

**1. Three named duration tiers derived from existing data, not invented.**
`DURATION = { fast: 0.2, base: 0.5, slow: 0.8 }` — these are already the three most-used values; naming them codifies de-facto practice rather than imposing new feel. Outliers (`1.5`, `2`, `4`) are decorative-loop speeds and stay as named loop constants.

- *Why:* Minimizes perceived change while removing the long tail of one-off numbers.
- *Alternative considered:* A single uniform duration — rejected; collapses the legitimate distinction between quick UI feedback (tap/hover) and slower content reveals.

**2. Variants exported as plain objects + a reduced-motion-aware factory.**
Provide static presets (`fade`, `fadeUp`, `scaleIn`, `pageEnter`, `pageExit`) and a small hook/helper that, via Framer's `useReducedMotion`, swaps positional/scale variants for opacity-only or instant equivalents.

- *Why:* Keeps the common case dead simple (import an object), while reduced-motion is handled in one place instead of 338.
- *Alternative considered:* A custom `<Motion>` wrapper component — rejected as heavier and more invasive than the codebase's current direct `motion.div` style.

**3. Stagger via a helper, not hand-tuned per-child delays.**
Replace hero's `delay: 0.2/0.4/0.6/0.8...` ladder with a `stagger(index)` / container-variant approach.

- *Why:* The cascade is the clearest "drift" offender; a helper guarantees even spacing and a single place to retune.

**4. Scroll reveals keep `whileInView` + `once:true`, but use the shared `fadeUp` variant.**
Behavior (reveal on scroll, once) is good; only the inline timing is replaced.

## Page-open transition — DECISION REQUIRED

This is the headline transition and the one genuine taste call. Three candidates, all symmetric and reduced-motion-safe:

```
 (A) CROSSFADE+LIFT   landing fades+drops out  ↓   main fades+rises in  ↑
     shared base duration, mode="wait"             low risk, "settles into place"

 (B) ENVELOPE/CURTAIN landing slides/scales away      main revealed beneath
     more thematic ("opening" an invitation)          higher effort, easier to feel janky

 (C) PURE CROSSFADE   both opacity-only, shared timing, slight overlap
     calmest, most minimal                            least "wow", safest
```

| | Feel | Effort | Risk | Reduced-motion |
|---|------|--------|------|----------------|
| **A** Crossfade+lift | Polished, intentional | Low | Low | → pure opacity |
| **B** Envelope/curtain | Thematic, memorable | Med–High | Med (jank, layout) | → pure opacity |
| **C** Pure crossfade | Minimal, calm | Lowest | Lowest | already compliant |

**Recommendation: A (crossfade + lift)** as the default — biggest polish gain for lowest risk, and it generalizes into the `pageEnter`/`pageExit` variants reused elsewhere. B is the "delight" option if you want the open to feel ceremonial; it's worth a follow-up if A lands well. **This is recorded as an open question below — implementation should confirm A vs B vs C before building the page transition.**

## Risks / Trade-offs

- **[Retiming changes the current feel slightly]** → Tiers are drawn from existing dominant values, so most elements keep their timing; only outliers shift. Visual review on the live invitation flow before merge.
- **[`mode="wait"` serializes exit→enter, which can feel slow]** → Keep total transition within ~base duration; if it drags, allow slight overlap (option C-style) without abandoning symmetry.
- **[Decorative loops under reduced motion]** → FloatingHearts / pulses must be suppressed (not just shortened) when reduced motion is on, or they defeat the purpose.
- **[No automated animation tests]** → Risk is contained to visuals; mitigate with manual review + an optional unit test asserting the motion module's exported token/variant shape.

## Migration Plan

1. Add `src/lib/motion.js` (tokens, variants, reduced-motion helper).
2. Adopt in components bottom-up: leaf reveals → layout → page-open last.
3. Resolve the page-open decision (A/B/C) before touching `app.jsx`.
4. Manual visual pass across landing → main → all sections, plus a reduced-motion pass (OS setting on).
5. `bun run lint` and `bun run build`.
6. **Rollback:** module + presentational edits only; revert per-file. No data/schema involved.

## Open Questions

- **Page-open style: A (crossfade+lift), B (envelope/curtain), or C (pure crossfade)?** Recommendation A; needs confirmation before the `app.jsx` work.
- Should ambient decorative motion (FloatingHearts) be tokenized only, or also be tunable/disable-able via config? Default assumption: tokenized + reduced-motion-suppressed, no new config.
