# UI/UX Design System Specification - Tuition Case Workspace

This document defines the visual theme, typography, roundings, Tailwind v4 variables, and primitive component integrations used across the Tuition Case Workspace frontend.

---

## 1. Design System Colors & Variables

The app is locked to a dark, modern obsidian theme. Colors are defined in `globals.css` as CSS properties:

- **Background**: `#0a0a0a` (pitch-black obsidian)
- **Cards & Inputs**: `#171717` (slate-neutral charcoal)
- **Borders & Separators**: `#262626` (neutral-800)
- **Accent Primary**: `#6366f1` (indigo-500)
- **Accent Gradient**: From `#6366f1` (indigo) to `#9333ea` (purple-600)
- **Text Primary**: `#f5f5f5` (slate white)
- **Text Muted**: `#a3a3a3` (neutral-400)

---

## 2. Typography & Scale

* **Heading Font**: Geist / Inter (clean, high-readability sans-serif)
* **Text Scale**:
  * Heading 1 (Welcome Hero): `text-3xl font-extrabold text-white`
  * Card Titles / Section Titles: `text-base font-bold text-white`
  * Form labels / Descriptions: `text-xs font-semibold text-neutral-400 uppercase tracking-wider`
  * Body inputs & general lists: `text-xs text-neutral-300`

---

## 3. Roundings & Spacing

* **Cards & Dialog panels**: `rounded-3xl` (large, smooth premium corners).
* **Buttons, Tabs, and Inputs**: `rounded-xl` (comfort-size modern roundings).
* **Spacing**: Cards use a standard padding size of `p-6` or `p-8` (on larger screens) to provide breathing room and prevent clutter.

---

## 4. Styled Primitive Components

### Card
- Backdrop translucent look using `bg-neutral-900/60`, `border border-neutral-800`, and `backdrop-blur-xl`.
- Content padding defaults to `--card-spacing: 1.5rem` (spacing(6)).

### Button
- **Primary Button**: `bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98]`.
- **Secondary/Outline Button**: `border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white`.

### Input & Textarea
- Boxed in `bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600`.
- Transition focus border triggers `focus:border-indigo-500/50`.

### Dialog
- Background overlay maps to `bg-neutral-950/70` with `backdrop-blur-sm`.
- Container cards use `bg-neutral-900 border border-neutral-800 p-8 shadow-2xl rounded-3xl`.

### Select Trigger & Content
- Triggers follow inputs: `bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs`.
- Viewport lists drop down in a clean `bg-neutral-950 border border-neutral-800 text-white rounded-xl shadow-2xl p-1` card.

### Tabs
- List selector bar: `bg-neutral-950/80 border border-neutral-800/50 p-1.5 rounded-xl gap-2`.
- Option triggers: `rounded-lg py-2 text-xs font-semibold data-active:bg-neutral-800 data-active:text-white`.

---

## 🔗 Cross-Repository References

- **Backend Repository**: [tuition-workspace-api](https://github.com/ferdianqbl/tuition-workspace-api)
- **Backend API Reference (Specs)**: [plans/API.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/API.md)
- **Backend System Architecture**: [plans/SYSTEM_ARCHITECTURE.md](https://github.com/ferdianqbl/tuition-workspace-api/blob/main/plans/SYSTEM_ARCHITECTURE.md)
- **Live Swagger API Docs**: [Live API Swagger Docs (Vercel)](https://tuition-workspace-api.vercel.app/api/docs)
