# Color Palette & Design Tokens

The brand palette and semantic color tokens for this project.

**Source:** pulled from the [We Are Adventurers](https://weareadventurers.co.uk/outdoor-learning/)
theme CSS via the `copy-from-web` skill, then validated against a screenshot of
the live page to confirm which colors are *visually* dominant (not just frequent
in the stylesheet). Framework leftovers from Milligram (`#9b4dca`, `#606c76`,
`#f4f5f6`, …) were excluded — they aren't part of the brand.

**Defined in:** [`app/styles/_tokens.scss`](app/styles/_tokens.scss), emitted once
into `:root` via `globals.scss`. Available everywhere as CSS custom properties.

---

## How the tokens are structured

Two tiers — always consume the **semantic** layer in components, never raw hex:

1. **Primitives** (`--color-*`) — the raw palette. The single source of truth.
2. **Semantic** (`--surface-*`, `--text-*`, `--border-*`, `--btn-*`) — intent-based
   aliases that point at primitives. If the brand changes, you re-point a handful
   of semantic tokens (or edit a primitive) and the whole UI follows.

```
component  ──uses──▶  semantic token  ──references──▶  primitive  ──is──▶  #hex
                      --btn-primary-bg                 --color-orange      #e25920
```

---

## Primitives

| Token | Hex | Notes |
|---|---|---|
| `--color-orange` | `#e25920` | 🟧 Signature brand accent — the most visible color on the site |
| `--color-orange-dark` | `#c04817` | Button hover / pressed |
| `--color-orange-light` | `#e9774c` | Lighter orange tint |
| `--color-ink` | `#231f20` | ⬛ Near-black — dark surfaces & body text |
| `--color-black` | `#000000` | True black |
| `--color-white` | `#ffffff` | ⬜ White |
| `--color-sage` | `#7c8878` | 🟩 Muted green — calm/decorative surfaces |
| `--color-sage-light` | `#8a9686` | Lighter sage |
| `--color-mist` | `#edf1ec` | Pale green off-white — the main page background |
| `--color-brown` | `#584036` | 🟫 Earthy ink — splatter textures |
| `--color-cream` | `#fff6d6` | Warm pale highlight |
| `--color-ink-20` | `rgba(35,31,32,.2)` | Ink @ 20% — hairline borders |
| `--color-ink-80` | `rgba(35,31,32,.8)` | Ink @ 80% — overlays |

---

## Semantic tokens

### Surfaces
| Token | → | Use for |
|---|---|---|
| `--surface-primary` | mist | Main page background |
| `--surface-secondary` | white | Cards, raised panels |
| `--surface-inverse` | ink | Dark sections, header, footer |
| `--surface-accent` | orange | Feature bands, emphasis blocks |
| `--surface-muted` | sage | Calm / decorative blocks |

### Text
| Token | → | Use for |
|---|---|---|
| `--text-primary` | ink | Body copy on light surfaces |
| `--text-secondary` | sage | Muted / supporting copy |
| `--text-inverse` | white | Copy on dark / accent surfaces |
| `--text-accent` | orange | Links, emphasized words |
| `--text-on-accent` | white | Copy sitting directly on orange |

### Borders
| Token | → | Use for |
|---|---|---|
| `--border-subtle` | ink @ 20% | Hairline dividers |
| `--border-strong` | ink | Emphasized outlines |

### Buttons
**Primary** — filled orange (the site's BOOK NOW CTA):
| Token | → |
|---|---|
| `--btn-primary-bg` | orange |
| `--btn-primary-bg-hover` | orange-dark |
| `--btn-primary-text` | white |

**Secondary** — outline that fills on hover:
| Token | → |
|---|---|
| `--btn-secondary-bg` | transparent |
| `--btn-secondary-text` | ink |
| `--btn-secondary-border` | ink |
| `--btn-secondary-bg-hover` | ink |
| `--btn-secondary-text-hover` | white |

### Misc
| Token | → | Use for |
|---|---|---|
| `--focus-ring` | orange | `:focus-visible` outlines |

---

## Visual hierarchy (from the page screenshot)

- **Orange is the accent** — logo, hero title highlight, the full-width feature
  band, and every call-to-action button. Highest-visibility color; use sparingly
  for emphasis and actions.
- **Mist** is the dominant light background.
- **Ink** is the dark surface (header/footer/sections) and the body text color.
- **Sage / brown** are supporting, decorative tones that harmonize with the
  outdoor photography and the splatter textures — not primary UI colors.

> Note: a raw CSS frequency count ranks white/ink highest (they're everywhere
> structurally), but the screenshot makes clear that **orange** is the
> perceptually dominant brand color. The semantic tokens reflect intent, not
> frequency.

---

## Usage

Reference semantic tokens directly in any stylesheet — no `@use`/import needed
(they're global custom properties):

```scss
.card {
  background: var(--surface-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}

.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);

  &:hover {
    background: var(--btn-primary-bg-hover);
  }
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
  border: 2px solid var(--btn-secondary-border);

  &:hover {
    background: var(--btn-secondary-bg-hover);
    color: var(--btn-secondary-text-hover);
  }
}
```

**Live example:** the [`CtaPopout`](app/components/cta-popout/cta-popout.tsx)
component consumes `--surface-inverse`, `--surface-muted`, `--text-accent`,
`--btn-primary-*`, etc.

### Adding or changing a color
1. Add/adjust the **primitive** in `_tokens.scss`.
2. Point the relevant **semantic** token(s) at it.
3. Components pick it up automatically — don't hard-code hex in components.
