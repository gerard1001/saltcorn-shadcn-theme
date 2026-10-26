# shadcn-theme

A [shadcn/ui](https://ui.shadcn.com)-style layout for Saltcorn.

Saltcorn renders all view content (lists, forms, cards, tabs, modals…) as
Bootstrap 5 markup, so this theme does not replace Bootstrap. It keeps
Bootstrap 5.3 underneath and restyles it with shadcn's design tokens and
component look. Every core view and Bootstrap-based plugin keeps working
without changes to Saltcorn core.

## Features

- **Layouts:** Sidebar (with *Sidebar*, *Floating* and *Inset* variants), Topbar (menu
  items that don't fit move into a "More" dropdown; nested menus open as flyout sub-menus
  beside their parent, flipping sides when there's no room), or "No menu" (navigation hidden for
  non-admins).
- **Sidebar and top bar colors:** each can use the page background, card background, muted, primary, dark or
  a custom color (optionally different in dark mode); text, hover states, borders and inputs
  adapt so they stay readable, while menus opened from the bar keep the page's colors. The
  top bar can also be transparent (frosted once the page scrolls under it), and fixed or
  scrolling with the page, with an opacity setting for the frosted state. Applies to the
  Topbar layout's bar and the Sidebar layout's header.
- **Page heroes** (Topbar layout): a container with a background image or gradient at the very top of a
  page sits flush under the top bar. Under a transparent bar it runs up behind it, so the
  bar's items sit on the image until the page scrolls. An option switches the transparent
  bar to light text while it sits on the image, for dark photos. Admins' edit bar becomes a
  small pill in the hero's corner.
- **No bounce:** the page doesn't rubber-band when scrolled past its ends.
- **Header** on desktop only appears when it has something to show (sidebar toggle, title,
  mode toggle or secondary menu items); on mobile it always holds the menu button.
- **Keyboard shortcuts** (setting, on by default): ⌘B or Ctrl+B toggles the sidebar (or the
  mobile drawer; on a Mac, Ctrl+B in a text field keeps its cursor-back meaning), D toggles light/dark when the header toggle is on, / focuses search
  (the page's own search box first, then the menu search), ? lists all shortcuts,
  including menu item shortcuts, which also show as hints in the sidebar. They never
  override core: menu item shortcuts always win, nothing uses Alt (the entities page's
  Alt+letter keys), single-key shortcuts are ignored while typing, and ⌘/Ctrl+B is left
  to rich-text and code editors (bold).
- **Collapsible sidebar** on desktop. It uses core's `data-sidebar-toggler`, so the
  state is remembered. On mobile the sidebar becomes an off-canvas drawer.
- **Sidebar menu groups** start collapsed (default) or expanded. Expanded opens only the
  top-level groups; nested ones stay closed. The group holding the current page is always
  open.
- **Style** (shadcn create): Default (this theme's original look), Vega, Nova, Maia,
  Lyra, Mira, Luma, Sera. A style sets control heights, padding, corner shapes, card
  and table spacing, and input fill. The values are read off shadcn's
  `registry/styles/style-*.css` and applied as CSS variables, because shadcn's own style
  files are Tailwind `@apply` rules for its React components and can't be loaded as is.
  Sera also gets uppercase labels and underline inputs.
- **Base colors:** shadcn's official Neutral, Stone, Zinc, Mauve, Olive, Mist, Taupe
  (exact OKLCH values from `apps/v4/registry/themes.ts`, stored in `shadcn-themes.json`),
  plus Spruce (a dark blue-green neutral after spacetimedb.com) and Harbor (a navy-blue
  neutral built the same way), neither part of shadcn, and the
  older Slate and Gray.
- **Dark mode shade:** 100% (the base color's own dark), 75%, 50% or 25% (dim). Lower
  values lift the dark surfaces' lightness evenly, so cards, sidebar and borders keep
  their contrast with the page and secondary text stays readable.
- **Primary color:** the base color (default), one of shadcn's 17 accent themes (Amber,
  Blue, Cyan, Emerald, Fuchsia, Green, Indigo, Lime, Orange, Pink, Purple, Red, Rose, Sky,
  Teal, Violet, Yellow), Mint (`#4cf490`, SpacetimeDB's green, not part of shadcn) or a
  custom color, optionally different in dark mode. Used for buttons, links, focus rings and
  checkboxes. As link/text colour it is darkened (or lightened in dark mode) just enough to
  stay readable, so light colours like Mint or Yellow work on white.
- **Secondary color:** neutral gray (default), a preset or a custom color, for
  secondary buttons and badges. Hover/selected surfaces stay neutral.
- **Radius:** 0 to 1rem.
- **Font** (all bundled, SIL OFL; pages only download the faces they use):
  Inter (default), Geist + Geist Mono (shadcn/ui's current default), IBM Plex Sans,
  Poppins, Roboto, DM Sans, Plus Jakarta Sans, Manrope, Figtree, Outfit, Space Grotesk,
  Nunito Sans, Public Sans, Work Sans, Raleway, Sora, Onest, JetBrains Mono, or the system font, at a base size of 14, 16, 18, 20 or 24px (the whole interface scales with it). All of them are also offered in the
  page builder's font picker.
- **Light / dark / follow system** modes:
  - Per-user override via *User settings → Layout*.
  - A `toggle_shadcn_dark_mode` action you can add as a menu item.
  - An optional header toggle that stores the visitor's choice in their browser.
- Menu support:
  - Items, headers, separators, search, nested sub-menus and button-styled items.
  - *Secondary Menu* items go in the header; *Mobile Bottom* items are skipped.
  - User menu with avatar (optionally from a File field on `users`, read fresh on each page
    load, so a newly added field or upload shows without logging in again).
  - Unread-notification dot (core's `update_theme_notification_count` hook).
- **Entities page:** each type (table, view, page, trigger, module, user, role) gets its own
  hue from one matched OKLCH set, shown as a small tinted icon tile beside a plain label; the
  type filter buttons use the same hues, and Details badges are quiet outline badges.
- **Toasts:** position (top/bottom × left/center/right) and style (Classic, Sonner, Rich colors,
  Accent) settings, picked from live previews; every style keeps the success/info/warning/error colours.
- **Workflow runs:** step traces shown as a shadcn Trace (status icon, step name, duration; click a
  line for its details), plus a final line for a failed or finished run.
- **Workflow editor and page builder** follow the theme: primary-coloured start node, actions and
  "add" edges, themed nodes/canvas/controls (loop edges keep the warning colour); the builder's bare
  inputs (font size + unit, background settings…) get the input look.
- **Alert dialog:** core's `confirm()` / `alert()` prompts open a shadcn AlertDialog (Cancel /
  Continue; red Continue for delete buttons). Continue replays the original click or submit;
  a `confirm()` not caused by a click or submit keeps the native prompt.
- **Accordion** in shadcn's bordered style (dividers, chevron at the end), **search inputs** as one
  control with the icon inside, **checkboxes** like shadcn's (also the bare ones core renders),
  **calendars** (flatpickr) like shadcn's Calendar, and **Monaco editors** (code
  fields, builder formula inputs) follow light/dark, on the page background in dark mode.
- Restyled auth pages (login, signup, forgot password).
- RTL support (`bootstrap.rtl.min.css`).

## How it is built

| File | Role |
| --- | --- |
| `index.js` | Layout plugin: `wrap`, `authWrap`, `renderBody`, `hints`, configuration workflow, user config form, dark-mode action |
| `shadcn-themes.json` | shadcn/ui's base colors and accent themes (OKLCH), extracted from its MIT-licensed registry |
| `palettes.js` | Style table, OKLCH → RGB conversion, shadcn tokens per base color / accent, turned into `--sc-*` variables plus the Bootstrap `--bs-*` variables (including the `-rgb` triplets Bootstrap utilities need) |
| `public/shadcn.css` | Component layer: cards, buttons (incl. `btn-ghost`), forms, tables, segmented tabs, dropdowns, modals, toasts, badges, sidebar/header shell |
| `public/shadcn.js` | Tooltip/popover init, keyboard shortcuts and help panel, follow-system tracking, notification dot (the light/dark toggle itself is inline in the page head) |
| `public/` vendor | Bootstrap 5.3 CSS/RTL CSS/bundle JS, Font Awesome 5.15 Free, the fonts in `public/fonts` (licenses alongside) |

The token stylesheet is generated once per configuration and inlined into each page.
The theme's own CSS/JS URLs carry the file's modification time (`?v=…`), so browsers
pick up changes immediately despite Saltcorn's 100-day cache on plugin files.

All settings are on a single configuration page. Core's "Reload page to see changes"
restarts the workflow at its first step, so a multi-step form looked as if it lost the
later steps' changes.

## Install (development)

```
saltcorn install-plugin -d ~/plugins/shadcn-theme
```

Then select it as the layout under *Settings → Modules*, and configure it there.

## Not supported

- The Saltcorn mobile app (Capacitor) build: `ready_for_mobile` is not declared.
