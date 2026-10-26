// shadcn/ui design tokens (HSL, as published in the shadcn/ui themes),
// translated into Bootstrap 5.3 CSS custom properties.

// shadcn/ui's official base colors and accent themes (OKLCH), extracted from
// apps/v4/registry/themes.ts — see shadcn-themes.json for the source and license
const official = require("./shadcn-themes.json");

// earlier shadcn base colors (HSL), kept so saved configs keep working
const legacyBases = {
  Slate: {
    light: {
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      primary: "222.2 47.4% 11.2%",
      "primary-foreground": "210 40% 98%",
      secondary: "210 40% 96.1%",
      "secondary-foreground": "222.2 47.4% 11.2%",
      muted: "210 40% 96.1%",
      "muted-foreground": "215.4 16.3% 46.9%",
      border: "214.3 31.8% 91.4%",
      ring: "222.2 84% 4.9%",
    },
    dark: {
      background: "222.2 84% 4.9%",
      foreground: "210 40% 98%",
      primary: "210 40% 98%",
      "primary-foreground": "222.2 47.4% 11.2%",
      secondary: "217.2 32.6% 17.5%",
      "secondary-foreground": "210 40% 98%",
      muted: "217.2 32.6% 17.5%",
      "muted-foreground": "215 20.2% 65.1%",
      border: "217.2 32.6% 17.5%",
      ring: "212.7 26.8% 83.9%",
    },
  },
  Gray: {
    light: {
      background: "0 0% 100%",
      foreground: "224 71.4% 4.1%",
      primary: "220.9 39.3% 11%",
      "primary-foreground": "210 20% 98%",
      secondary: "220 14.3% 95.9%",
      "secondary-foreground": "220.9 39.3% 11%",
      muted: "220 14.3% 95.9%",
      "muted-foreground": "220 8.9% 46.1%",
      border: "220 13% 91%",
      ring: "224 71.4% 4.1%",
    },
    dark: {
      background: "224 71.4% 4.1%",
      foreground: "210 20% 98%",
      primary: "210 20% 98%",
      "primary-foreground": "220.9 39.3% 11%",
      secondary: "215 27.9% 16.9%",
      "secondary-foreground": "210 20% 98%",
      muted: "215 27.9% 16.9%",
      "muted-foreground": "217.9 10.6% 64.9%",
      border: "215 27.9% 16.9%",
      ring: "216 12.2% 83.9%",
    },
  },
};

// extra base colors (not part of shadcn/ui), same token set as the official ones
const extraBases = {
  // a dark blue-green neutral, after SpacetimeDB's site (spacetimedb.com)
  Spruce: {
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.16 0.012 200)",
      card: "oklch(1 0 0)",
      popover: "oklch(1 0 0)",
      primary: "oklch(0.23 0.02 200)",
      "primary-foreground": "oklch(0.985 0.004 200)",
      secondary: "oklch(0.962 0.006 200)",
      "secondary-foreground": "oklch(0.23 0.02 200)",
      muted: "oklch(0.962 0.006 200)",
      "muted-foreground": "oklch(0.55 0.025 200)",
      accent: "oklch(0.962 0.006 200)",
      "accent-foreground": "oklch(0.23 0.02 200)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.92 0.01 200)",
      input: "oklch(0.92 0.01 200)",
      ring: "oklch(0.72 0.02 200)",
      sidebar: "oklch(0.983 0.005 200)",
      "sidebar-border": "oklch(0.92 0.01 200)",
    },
    dark: {
      background: "oklch(0.173 0.012 200)",
      foreground: "oklch(0.97 0.004 200)",
      card: "oklch(0.205 0.016 200)",
      popover: "oklch(0.205 0.016 200)",
      primary: "oklch(0.93 0.008 200)",
      "primary-foreground": "oklch(0.205 0.016 200)",
      secondary: "oklch(0.265 0.02 200)",
      "secondary-foreground": "oklch(0.97 0.004 200)",
      muted: "oklch(0.265 0.02 200)",
      "muted-foreground": "oklch(0.72 0.02 200)",
      accent: "oklch(0.265 0.02 200)",
      "accent-foreground": "oklch(0.97 0.004 200)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.56 0.03 200)",
      sidebar: "oklch(0.19 0.014 200)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
    },
  },
  // a navy-blue neutral, built like Spruce
  Harbor: {
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.16 0.015 255)",
      card: "oklch(1 0 0)",
      popover: "oklch(1 0 0)",
      primary: "oklch(0.23 0.025 255)",
      "primary-foreground": "oklch(0.985 0.005 255)",
      secondary: "oklch(0.962 0.007 255)",
      "secondary-foreground": "oklch(0.23 0.025 255)",
      muted: "oklch(0.962 0.007 255)",
      "muted-foreground": "oklch(0.55 0.031 255)",
      accent: "oklch(0.962 0.007 255)",
      "accent-foreground": "oklch(0.23 0.025 255)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.92 0.013 255)",
      input: "oklch(0.92 0.013 255)",
      ring: "oklch(0.72 0.025 255)",
      sidebar: "oklch(0.983 0.006 255)",
      "sidebar-border": "oklch(0.92 0.013 255)",
    },
    dark: {
      background: "oklch(0.173 0.015 255)",
      foreground: "oklch(0.97 0.005 255)",
      card: "oklch(0.205 0.02 255)",
      popover: "oklch(0.205 0.02 255)",
      primary: "oklch(0.93 0.01 255)",
      "primary-foreground": "oklch(0.205 0.02 255)",
      secondary: "oklch(0.265 0.025 255)",
      "secondary-foreground": "oklch(0.97 0.005 255)",
      muted: "oklch(0.265 0.025 255)",
      "muted-foreground": "oklch(0.72 0.025 255)",
      accent: "oklch(0.265 0.025 255)",
      "accent-foreground": "oklch(0.97 0.005 255)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.56 0.037 255)",
      sidebar: "oklch(0.19 0.018 255)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
    },
  },
};

const bases = { ...official.bases, ...extraBases, ...legacyBases };

// accent presets: [primary, primary-foreground] per mode
// extra presets (not part of shadcn/ui): the same colour in both modes
const extraAccents = {
  // SpacetimeDB's green, with its near-black text
  Mint: { light: ["#4cf490", "#0b1114"], dark: ["#4cf490", "#0b1114"] },
};

const accents = Object.fromEntries(
  [
    ...Object.entries(official.accents).map(([name, m]) => [
      name,
      {
        light: [m.light.primary, m.light["primary-foreground"]],
        dark: [m.dark.primary, m.dark["primary-foreground"]],
      },
    ]),
    ...Object.entries(extraAccents),
  ].sort(([a], [b]) => a.localeCompare(b)),
);

// semantic colours (Tailwind 600 in light, 500 in dark)
const semantic = {
  light: {
    success: "#16a34a",
    info: "#0284c7",
    warning: "#d97706",
    danger: "#dc2626",
  },
  dark: {
    success: "#22c55e",
    info: "#0ea5e9",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
};

const hslToRgb = (hsl) => {
  const [h, s, l] = hsl.replace(/%/g, "").trim().split(/\s+/).map(Number);
  const sat = s / 100;
  const lig = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n) =>
    lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((x) => Math.round(x * 255));
};

// OKLCH → sRGB (CSS Color 4); alpha is composited over `under`
const oklchToRgb = (str, under) => {
  const m = str.match(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/,
  );
  if (!m) return null;
  let L = parseFloat(m[1]);
  if (m[1].endsWith("%")) L /= 100;
  const C = parseFloat(m[2]);
  const h = (parseFloat(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  let rgb = lin.map((x) => {
    const v =
      x <= 0.0031308
        ? 12.92 * x
        : 1.055 * Math.pow(Math.max(x, 0), 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, v)) * 255);
  });
  if (m[4] !== undefined) {
    let alpha = parseFloat(m[4]);
    if (m[4].endsWith("%")) alpha /= 100;
    if (under)
      rgb = rgb.map((x, i) => Math.round(x * alpha + under[i] * (1 - alpha)));
  }
  return rgb;
};

// any palette value (oklch(...) or legacy "H S% L%") → rgb triplet
const toRgb = (v, under) =>
  String(v).startsWith("oklch")
    ? oklchToRgb(v, under)
    : String(v).startsWith("#")
      ? hexToRgb(v)
      : hslToRgb(v);

const hexToRgb = (hex) => {
  let h = String(hex || "")
    .trim()
    .replace(/^#/, "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const toHex = (rgb) =>
  "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join("");

// mix a into b with weight w (0..1) of a
const mix = (a, b, w) => a.map((x, i) => Math.round(x * w + b[i] * (1 - w)));

const luminance = ([r, g, b]) => {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// link text in the primary colour, darkened/lightened towards the foreground
// just enough to stay readable (e.g. Mint, Yellow or a light custom colour)
const readableOn = (c, bg, fg, min = 4.5) => {
  for (let w = 1; w > 0; w -= 0.05) {
    const m = mix(c, fg, w);
    if (contrast(m, bg) >= min) return m;
  }
  return fg;
};

const contrastFg = (rgb) =>
  luminance(rgb) > 0.4 ? [10, 10, 10] : [250, 250, 250];

/**
 * Resolve the full token set (as rgb triplets) for one mode
 */
// a preset name or "Custom" (+ light/dark hex) → [color, foreground] for one mode
const pickColor = (choice, customLight, customDark, mode) => {
  if (choice === "Custom") {
    // customDark is only passed when "different color in dark mode" is on
    const c = hexToRgb(
      mode === "dark" && customDark ? customDark : customLight,
    );
    return c ? [c, contrastFg(c)] : null;
  }
  if (accents[choice]) {
    const [c, fg] = accents[choice][mode];
    return [toRgb(c), toRgb(fg)];
  }
  return null;
};

// "Dark mode shade": 100% keeps the base's own dark surfaces, lower values
// raise their lightness (OKLCH L) for a dimmer, less inky dark mode
const darkShades = { 100: 0, 75: 0.04, 50: 0.08, 25: 0.12 };
const darkLift = (config) => darkShades[config.dark_shade] || 0;
// border/input only change where they are opaque (legacy bases)
const darkSurfaces = [
  "background",
  "card",
  "popover",
  "secondary",
  "muted",
  "accent",
  "sidebar",
  "border",
  "input",
];

// raise one palette value's lightness by d; translucent values are left alone,
// they composite over the (raised) background
const lighten = (v, d) => {
  const ok = String(v).match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (ok) {
    const L = parseFloat(ok[1]) / (ok[2] ? 100 : 1);
    return `oklch(${Math.min(1, L + d).toFixed(4)} ${ok[3]} ${ok[4]})`;
  }
  const hsl = String(v).match(/^([\d.]+)\s+([\d.]+%)\s+([\d.]+)%$/);
  if (hsl) {
    // legacy HSL: scale saturation down so the colourfulness stays put
    // instead of a darker navy turning into a bright blue
    const L = +hsl[3];
    const L2 = Math.min(100, L + d * 100);
    const S = parseFloat(hsl[2]) * (L2 <= 50 ? L / L2 : 1);
    return `${hsl[1]} ${S.toFixed(1)}% ${L2.toFixed(1)}%`;
  }
  return v;
};

const baseValues = (config, mode) => {
  const base = bases[config.base_color] || bases.Zinc;
  const d = mode === "dark" ? darkLift(config) : 0;
  if (!d) return base[mode];
  const vals = { ...base[mode] };
  for (const k of darkSurfaces) if (vals[k]) vals[k] = lighten(vals[k], d);
  // keep secondary text readable on the lighter surfaces
  if (vals["muted-foreground"])
    vals["muted-foreground"] = lighten(vals["muted-foreground"], d / 2);
  return vals;
};

const resolveTokens = (config, mode) => {
  const vals = baseValues(config, mode);
  const t = {};
  const bg = toRgb(vals.background);
  for (const [k, v] of Object.entries(vals)) t[k] = toRgb(v, bg);
  // hover / selected surfaces always use the neutral base secondary, even when
  // the secondary colour itself is customised below
  t.accent = t.secondary;
  t["accent-foreground"] = t["secondary-foreground"];

  // "accent_color" is the stored name of the Primary color setting
  const accent = config.accent_color;
  const primary = pickColor(
    accent,
    config.custom_primary,
    config.custom_primary_dark_on && config.custom_primary_dark,
    mode,
  );
  if (primary) {
    [t.primary, t["primary-foreground"]] = primary;
    t.ring = t.primary;
  }
  const secondary = pickColor(
    config.secondary_color,
    config.custom_secondary,
    config.custom_secondary_dark_on && config.custom_secondary_dark,
    mode,
  );
  if (secondary) [t.secondary, t["secondary-foreground"]] = secondary;
  t.isColoredSecondary = !!secondary;
  for (const [k, v] of Object.entries(semantic[mode])) t[k] = hexToRgb(v);
  // official bases define sidebar/card/popover/input; derive them for legacy ones
  t.sidebar =
    t.sidebar ||
    (mode === "dark"
      ? mix(t.muted, t.background, 0.45)
      : mix(t.muted, t.background, 0.55));
  t.card = t.card || t.background;
  t.popover = t.popover || t.card;
  t.input =
    t.input || (mode === "dark" ? mix(t.border, t.foreground, 0.85) : t.border);
  t.isColoredPrimary = !!primary;
  return t;
};

const trip = (rgb) => rgb.join(", ");
const rgb = (c) => `rgb(${c.join(" ")})`;

/**
 * CSS custom properties for one mode: shadcn tokens (--sc-*) plus
 * the Bootstrap 5.3 variables that the rest of Saltcorn relies on.
 */
const modeVars = (config, mode) => {
  const t = resolveTokens(config, mode);
  const bg = t.background;
  const fg = t.foreground;
  const link = t.isColoredPrimary ? readableOn(t.primary, bg, fg) : fg;
  const vars = {
    "--sc-background": rgb(bg),
    "--sc-foreground": rgb(fg),
    "--sc-card": rgb(t.card),
    "--sc-popover": rgb(t.popover),
    "--sc-primary": rgb(t.primary),
    "--sc-primary-rgb": trip(t.primary),
    "--sc-primary-foreground": rgb(t["primary-foreground"]),
    "--sc-primary-hover": rgb(mix(t.primary, bg, 0.9)),
    "--sc-secondary": rgb(t.secondary),
    "--sc-secondary-foreground": rgb(t["secondary-foreground"]),
    "--sc-secondary-hover": rgb(
      t.isColoredSecondary
        ? mix(t.secondary, bg, 0.88)
        : mix(t.secondary, mode === "dark" ? fg : bg, 0.8),
    ),
    "--sc-muted": rgb(t.muted),
    "--sc-muted-rgb": trip(t.muted),
    "--sc-muted-foreground": rgb(t["muted-foreground"]),
    "--sc-accent": rgb(t.accent),
    "--sc-accent-foreground": rgb(t["accent-foreground"]),
    "--sc-accent-hover": rgb(mix(t.accent, mode === "dark" ? fg : bg, 0.8)),
    "--sc-border": rgb(t.border),
    "--sc-input": rgb(t.input),
    "--sc-input-rgb": trip(t.input),
    "--sc-ring": rgb(t.ring),
    "--sc-ring-rgb": trip(t.ring),
    "--sc-destructive": rgb(t.danger),
    "--sc-destructive-rgb": trip(t.danger),
    "--sc-sidebar": rgb(t.sidebar),
    "--sc-sidebar-rgb": trip(t.sidebar),
    "--sc-link": rgb(link),

    "--bs-body-bg": rgb(bg),
    "--bs-body-bg-rgb": trip(bg),
    "--bs-body-color": rgb(fg),
    "--bs-body-color-rgb": trip(fg),
    "--bs-emphasis-color": rgb(fg),
    "--bs-emphasis-color-rgb": trip(fg),
    "--bs-heading-color": rgb(fg),
    "--bs-secondary-color": rgb(t["muted-foreground"]),
    "--bs-secondary-color-rgb": trip(t["muted-foreground"]),
    "--bs-secondary-bg": rgb(t.muted),
    "--bs-secondary-bg-rgb": trip(t.muted),
    "--bs-tertiary-color": rgb(mix(t["muted-foreground"], bg, 0.75)),
    "--bs-tertiary-color-rgb": trip(mix(t["muted-foreground"], bg, 0.75)),
    "--bs-tertiary-bg": rgb(mix(t.muted, bg, 0.5)),
    "--bs-tertiary-bg-rgb": trip(mix(t.muted, bg, 0.5)),
    "--bs-border-color": rgb(t.border),
    "--bs-border-color-translucent": rgb(t.border),
    "--bs-link-color": rgb(link),
    "--bs-link-color-rgb": trip(link),
    "--bs-link-hover-color": rgb(t.isColoredPrimary ? mix(link, fg, 0.8) : fg),
    "--bs-link-hover-color-rgb": trip(
      t.isColoredPrimary ? mix(link, fg, 0.8) : fg,
    ),
    "--bs-code-color": rgb(fg),
    "--bs-highlight-bg": rgb(mix(t.warning, bg, 0.25)),
    "--bs-focus-ring-color": `rgba(${trip(t.ring)}, 0.5)`,
    "--bs-form-valid-color": rgb(t.success),
    "--bs-form-valid-border-color": rgb(t.success),
    "--bs-form-invalid-color": rgb(t.danger),
    "--bs-form-invalid-border-color": rgb(t.danger),
    "--bs-dark": rgb(mode === "dark" ? t.muted : fg),
    "--bs-dark-rgb": trip(mode === "dark" ? t.muted : fg),
    "--bs-light": rgb(mode === "dark" ? t.accent : t.muted),
    "--bs-light-rgb": trip(mode === "dark" ? t.accent : t.muted),
  };

  const theme = {
    primary: t.primary,
    secondary: t["muted-foreground"],
    success: t.success,
    info: t.info,
    warning: t.warning,
    danger: t.danger,
  };
  for (const [name, c] of Object.entries(theme)) {
    vars[`--bs-${name}`] = rgb(c);
    vars[`--bs-${name}-rgb`] = trip(c);
    vars[`--bs-${name}-text-emphasis`] = rgb(
      mode === "dark" ? mix(c, fg, 0.7) : mix(c, fg, 0.75),
    );
    vars[`--bs-${name}-bg-subtle`] = rgb(
      mix(c, bg, mode === "dark" ? 0.18 : 0.1),
    );
    vars[`--bs-${name}-border-subtle`] = rgb(
      mix(c, bg, mode === "dark" ? 0.4 : 0.3),
    );
  }
  return vars;
};

const radiusVars = (config) => {
  const r = Number.isFinite(+config.radius) ? +config.radius : 0.5;
  return {
    "--sc-radius": `${r}rem`,
    "--bs-border-radius": `max(0px, calc(${r}rem - 2px))`,
    "--bs-border-radius-sm": `max(0px, calc(${r}rem - 4px))`,
    "--bs-border-radius-lg": `${r}rem`,
    "--bs-border-radius-xl": `calc(${r}rem + 4px)`,
    "--bs-border-radius-xxl": `calc(${r}rem + 8px)`,
    "--bs-border-radius-2xl": `calc(${r}rem + 8px)`,
  };
};

const declBlock = (selector, vars) =>
  `${selector} {\n${Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")}\n}`;

const svgUrl = (svg) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, "%27")}")`;

// check marks / switch knobs drawn in primary-foreground, so they stay
// visible whatever the primary colour is (e.g. near-white primary in dark)
const formControlCss = (config, mode, selector) => {
  const fg = toHex(resolveTokens(config, mode)["primary-foreground"]);
  const check = svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='none' stroke='${fg}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 7 10 16l-4.5-4.5'/></svg>`,
  );
  const indeterminate = svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='none' stroke='${fg}' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10h8'/></svg>`,
  );
  const dot = svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='2' fill='${fg}'/></svg>`,
  );
  const knob = svgUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='${fg}'/></svg>`,
  );
  return [
    `${selector} :is(.form-check-input, input:not(.btn-check)):checked[type="checkbox"] { --bs-form-check-bg-image: ${check}; }`,
    `${selector} :is(.form-check-input, input:not(.btn-check))[type="checkbox"]:indeterminate { --bs-form-check-bg-image: ${indeterminate}; background-color: var(--sc-primary); border-color: var(--sc-primary); }`,
    `${selector} .form-check-input:checked[type="radio"] { --bs-form-check-bg-image: ${dot}; }`,
    `${selector} .form-switch .form-check-input:checked { --bs-form-switch-bg: ${knob}; }`,
  ].join("\n");
};

// fallback stack after every bundled family
const systemSans = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;
const systemMono = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
const geistMono = `"Geist Mono Variable", "Geist Mono", ${systemMono}`;

// all bundled in public/fonts (see fonts.css); a page only downloads the faces it uses
const sans = (family, opts = {}) => ({
  sans: `${family}, ${systemSans}`,
  mono: opts.mono || systemMono,
  features: opts.features || "normal",
  label: opts.label,
});
const fonts = {
  Inter: sans(`"InterVariable", "Inter"`, {
    label: "Inter",
    features: `"cv11", "ss01"`,
  }),
  Geist: sans(`"Geist Variable", "Geist"`, {
    label: "Geist (shadcn/ui's current default)",
    mono: geistMono,
  }),
  "IBM Plex Sans": sans(`"IBM Plex Sans Variable", "IBM Plex Sans"`, {
    label: "IBM Plex Sans",
  }),
  Poppins: sans(`"Poppins"`, { label: "Poppins" }),
  Roboto: sans(`"Roboto Variable", "Roboto"`, { label: "Roboto" }),
  "DM Sans": sans(`"DM Sans Variable", "DM Sans"`, { label: "DM Sans" }),
  "Plus Jakarta Sans": sans(
    `"Plus Jakarta Sans Variable", "Plus Jakarta Sans"`,
    {
      label: "Plus Jakarta Sans",
    },
  ),
  Manrope: sans(`"Manrope Variable", "Manrope"`, { label: "Manrope" }),
  Figtree: sans(`"Figtree Variable", "Figtree"`, { label: "Figtree" }),
  Outfit: sans(`"Outfit Variable", "Outfit"`, { label: "Outfit" }),
  "Space Grotesk": sans(`"Space Grotesk Variable", "Space Grotesk"`, {
    label: "Space Grotesk",
  }),
  "Nunito Sans": sans(`"Nunito Sans Variable", "Nunito Sans"`, {
    label: "Nunito Sans",
  }),
  "Public Sans": sans(`"Public Sans Variable", "Public Sans"`, {
    label: "Public Sans",
  }),
  "Work Sans": sans(`"Work Sans Variable", "Work Sans"`, {
    label: "Work Sans",
  }),
  Raleway: sans(`"Raleway Variable", "Raleway"`, { label: "Raleway" }),
  Sora: sans(`"Sora Variable", "Sora"`, { label: "Sora" }),
  Onest: sans(`"Onest Variable", "Onest"`, { label: "Onest" }),
  "JetBrains Mono": {
    label: "JetBrains Mono (monospace, pairs with Lyra)",
    sans: `"JetBrains Mono Variable", "JetBrains Mono", ${systemMono}`,
    mono: `"JetBrains Mono Variable", "JetBrains Mono", ${systemMono}`,
    features: "normal",
  },
  System: {
    label: "System UI",
    sans: `system-ui, ${systemSans}`,
    mono: systemMono,
    features: "normal",
  },
};
const fontFor = (config) => fonts[config.font] || fonts.Inter;

/*
 * shadcn/ui "styles" (shadcn create): each changes control sizes, spacing and
 * corner shapes. Values are read off apps/v4/registry/styles/style-<name>.css
 * (Tailwind classes such as h-9, px-2.5, rounded-xl, p-3), expressed relative
 * to the configured radius like shadcn does (--radius-md = radius × 0.8, …).
 * "Default" is this theme's original look.
 */
const R = (k) => `calc(var(--sc-radius) * ${k})`;
const R_FULL = "9999px";
const fill = (alpha) => `rgba(var(--sc-input-rgb), ${alpha})`;
const defaultStyle = {
  "--st-h": "2.25rem", //               control height (buttons, inputs)
  "--st-h-sm": "2rem",
  "--st-px": "1rem", //                 button padding
  "--st-px-sm": "0.75rem",
  "--st-input-px": "0.75rem",
  "--st-control-radius": "var(--bs-border-radius)",
  "--st-btn-fs": "0.875rem",
  "--st-btn-fw": "500",
  "--st-input-fs": "0.875rem",
  "--st-input-bg": "transparent",
  "--st-input-bg-dark": "rgba(var(--sc-muted-rgb), 0.35)",
  "--st-input-border": "var(--sc-input)",
  "--st-control-shadow": "var(--sc-shadow-xs)",
  "--st-check-radius": "4px",
  "--st-card-radius": "var(--bs-border-radius-lg)",
  "--st-card-pad": "1.5rem",
  "--st-card-pad-y": "1.25rem",
  "--st-card-shadow": "var(--bs-box-shadow-sm)",
  "--st-cell-py": "0.625rem",
  "--st-cell-px": "0.5rem",
  "--st-tabs-radius": "var(--bs-border-radius-lg)",
  "--st-tab-radius": "var(--bs-border-radius)",
  "--st-menu-radius": "var(--bs-border-radius)",
  "--st-item-radius": "var(--bs-border-radius-sm)",
  "--st-item-py": "0.375rem",
  "--st-item-px": "0.5rem",
  "--st-modal-radius": "var(--bs-border-radius-lg)",
  "--st-modal-pad": "1.5rem",
  "--st-badge-radius": "var(--bs-border-radius)",
};
// compact: [h, h-sm, px, px-sm, input-px], radii: [control, card, tabs, tab,
// menu, item, modal, badge, checkbox], pads: [card, card-y, cell, modal, item-py, item-px]
const style = (sizes, radii, pads, extra = {}) => ({
  "--st-h": sizes[0],
  "--st-h-sm": sizes[1],
  "--st-px": sizes[2],
  "--st-px-sm": sizes[3],
  "--st-input-px": sizes[4],
  "--st-control-radius": radii[0],
  "--st-card-radius": radii[1],
  "--st-tabs-radius": radii[2],
  "--st-tab-radius": radii[3],
  "--st-menu-radius": radii[4],
  "--st-item-radius": radii[5],
  "--st-modal-radius": radii[6],
  "--st-badge-radius": radii[7],
  "--st-check-radius": radii[8],
  "--st-card-pad": pads[0],
  "--st-card-pad-y": pads[1],
  "--st-cell-py": pads[2],
  "--st-cell-px": pads[2],
  "--st-modal-pad": pads[3],
  "--st-item-py": pads[4],
  "--st-item-px": pads[5],
  "--st-control-shadow": "none",
  "--st-card-shadow": "none",
  ...extra,
});
const styles = {
  Default: {},
  Vega: style(
    ["2.25rem", "2rem", "0.625rem", "0.625rem", "0.625rem"],
    [R(0.8), R(1.4), R(1), R(0.8), R(0.8), R(0.6), R(1.4), R(2.6), "4px"],
    ["1.5rem", "1.5rem", "0.5rem", "1.5rem", "0.375rem", "0.5rem"],
    {
      "--st-control-shadow": "var(--sc-shadow-xs)",
      "--st-card-shadow": "var(--sc-shadow-xs)",
    },
  ),
  Nova: style(
    ["2rem", "1.75rem", "0.625rem", "0.625rem", "0.625rem"],
    [R(1), R(1.4), R(1), R(0.8), R(1), R(0.8), R(1.4), R(2.6), "4px"],
    ["1rem", "1rem", "0.5rem", "1rem", "0.25rem", "0.375rem"],
  ),
  Maia: style(
    ["2.25rem", "2rem", "0.75rem", "0.75rem", "0.75rem"],
    [R(2.6), R(1.8), R(2.6), R(1.4), R(1.8), R(1.4), R(2.6), R(2.6), "6px"],
    ["1.5rem", "1.5rem", "0.75rem", "1.5rem", "0.5rem", "0.75rem"],
    { "--st-input-bg": fill(0.3), "--st-input-bg-dark": fill(0.3) },
  ),
  Lyra: style(
    ["2rem", "1.75rem", "0.625rem", "0.625rem", "0.625rem"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["1rem", "1rem", "0.5rem", "1rem", "0.5rem", "0.5rem"],
    { "--st-btn-fs": "0.75rem", "--st-input-fs": "0.75rem" },
  ),
  Mira: style(
    ["1.75rem", "1.5rem", "0.5rem", "0.5rem", "0.5rem"],
    [R(0.8), R(1), R(1), R(0.8), R(1), R(0.8), R(1.4), R_FULL, "4px"],
    ["1rem", "1rem", "0.5rem", "1rem", "0.25rem", "0.5rem"],
    {
      "--st-btn-fs": "0.75rem",
      "--st-input-bg": fill(0.2),
      "--st-input-bg-dark": fill(0.2),
    },
  ),
  Luma: style(
    ["2.25rem", "2rem", "0.75rem", "0.75rem", "0.75rem"],
    [R(2.6), R(2.6), R_FULL, R_FULL, R(2.2), R(1.8), R(2.6), R(2.2), "5px"],
    ["1.5rem", "1.5rem", "0.75rem", "1.5rem", "0.5rem", "0.75rem"],
    {
      "--st-input-bg": fill(0.5),
      "--st-input-bg-dark": fill(0.5),
      "--st-input-border": "transparent",
      "--st-card-shadow": "var(--sc-shadow-md)",
    },
  ),
  Sera: style(
    ["2.5rem", "2.25rem", "1.5rem", "1rem", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["2rem", "2rem", "0.75rem", "1.5rem", "0.5rem", "0.75rem"],
    {
      "--st-btn-fs": "0.75rem",
      "--st-btn-fw": "600",
      "--st-input-bg-dark": "transparent",
      "--st-card-shadow": "var(--bs-box-shadow-sm)",
    },
  ),
};
const styleFor = (config) => (styles[config.style] ? config.style : "Default");

const fontSizes = ["14px", "15px", "16px", "18px", "20px", "24px"];

// root font size giving body text (0.875rem) the configured size;
// 14px keeps the browser default root of 16px
const rootFontSize = (config) => {
  const px = parseFloat(config.font_size);
  const size = fontSizes.includes(config.font_size) ? px : 14;
  return `${+(size / 0.875).toFixed(4)}px`;
};

/**
 * Full generated stylesheet for the token layer
 */
/* ------------------------------------------------ sidebar / top bar colours */

const sidebarBackgrounds = [
  "Default",
  "Background",
  "Card",
  "Muted",
  "Primary",
  "Dark",
  "Custom",
];
const topbarBackgrounds = [
  "Default",
  "Transparent",
  "Background",
  "Card",
  "Sidebar",
  "Muted",
  "Primary",
  "Dark",
  "Custom",
];

// [background, foreground or null] for a bar in one mode; a foreground means
// the bar is coloured and gets its own readable token set
const barColor = (config, choice, prefix, mode, t) => {
  switch (choice) {
    case "Background":
      return [t.background, null];
    case "Card":
      return [t.card, null];
    case "Sidebar":
      return [t.sidebar, null];
    case "Muted":
      return [t.muted, t.foreground];
    case "Primary":
      return [t.primary, t["primary-foreground"]];
    case "Dark": {
      // the base's dark-mode sidebar, also in light mode
      const d = mode === "dark" ? t : resolveTokens(config, "dark");
      return [d.sidebar, d.foreground];
    }
    case "Custom": {
      const dark =
        config[`${prefix}_custom_dark_on`] && config[`${prefix}_custom_dark`];
      const c = hexToRgb(
        mode === "dark" && dark ? dark : config[`${prefix}_custom`],
      );
      return c ? [c, contrastFg(c)] : null;
    }
    default:
      return null;
  }
};

// tokens for content on a coloured bar: text, hover, borders and inputs are
// all derived from its foreground so they stay readable on any colour
const surfaceVars = (bg, fg, isPrimary) => {
  const v = {
    "--sc-foreground": rgb(fg),
    "--bs-body-color": rgb(fg),
    "--bs-emphasis-color": rgb(fg),
    "--sc-muted-foreground": rgb(mix(fg, bg, 0.7)),
    "--bs-secondary-color": rgb(mix(fg, bg, 0.7)),
    "--sc-muted": rgb(mix(fg, bg, 0.12)),
    "--sc-accent": rgb(mix(fg, bg, 0.1)),
    "--sc-accent-foreground": rgb(fg),
    "--sc-accent-hover": rgb(mix(fg, bg, 0.16)),
    "--sc-border": rgb(mix(fg, bg, 0.15)),
    "--bs-border-color": rgb(mix(fg, bg, 0.15)),
    "--sc-input": rgb(mix(fg, bg, 0.24)),
    "--sc-input-rgb": trip(mix(fg, bg, 0.24)),
    "--bs-body-bg": rgb(mix(fg, bg, 0.05)),
    "--sc-ring": rgb(mix(fg, bg, 0.55)),
    "--sc-ring-rgb": trip(mix(fg, bg, 0.55)),
    "--sc-link": rgb(fg),
    "color-scheme": luminance(bg) < 0.3 ? "dark" : "light",
  };
  // the brand mark and primary buttons would vanish on a primary bar
  if (isPrimary)
    Object.assign(v, {
      "--sc-primary": rgb(fg),
      "--sc-primary-rgb": trip(fg),
      "--sc-primary-foreground": rgb(bg),
      "--sc-primary-hover": rgb(mix(fg, bg, 0.88)),
    });
  return v;
};

// popups inside a coloured bar go back to the page's tokens
const pageVarNames = [
  "--sc-foreground",
  "--bs-body-color",
  "--bs-emphasis-color",
  "--sc-muted-foreground",
  "--bs-secondary-color",
  "--sc-muted",
  "--sc-accent",
  "--sc-accent-foreground",
  "--sc-accent-hover",
  "--sc-border",
  "--bs-border-color",
  "--sc-input",
  "--sc-input-rgb",
  "--bs-body-bg",
  "--sc-ring",
  "--sc-ring-rgb",
  "--sc-link",
  "--sc-primary",
  "--sc-primary-rgb",
  "--sc-primary-foreground",
  "--sc-primary-hover",
];

const barCss = (config, mode, scope) => {
  const t = resolveTokens(config, mode);
  const page = modeVars(config, mode);
  const reset = Object.fromEntries(pageVarNames.map((k) => [k, page[k]]));
  reset["color-scheme"] = mode;
  const out = [];
  const bars = [
    ["sidebar", config.sidebar_bg, ".sc-sidebar"],
    ["topbar", config.topbar_bg, ":is(.sc-topbar, .sc-header)"],
  ];
  for (const [prefix, choice, sel] of bars) {
    const c = barColor(config, choice, prefix, mode, t);
    if (!c) continue;
    const [bg, fg] = c;
    out.push(declBlock(scope, { [`--sc-${prefix}-bg`]: rgb(bg) }));
    if (fg) {
      out.push(
        declBlock(`${scope} ${sel}`, surfaceVars(bg, fg, choice === "Primary")),
      );
      out.push(
        declBlock(
          `${scope} ${sel} :is(.dropdown-menu, .modal, .popover, .offcanvas:not(.sc-sidebar))`,
          reset,
        ),
      );
    }
  }
  return out.join("\n");
};

const themeCss = (config = {}) => {
  const font = fontFor(config);
  const shared = {
    ...radiusVars(config),
    "--bs-font-sans-serif": font.sans,
    "--bs-font-monospace": font.mono,
    "--bs-body-font-family": "var(--bs-font-sans-serif)",
    "--sc-font-features": font.features,
    // body text is 0.875rem everywhere; the root size is scaled so that equals
    // the chosen base size, and every rem-sized control/spacing scales with it
    "font-size": rootFontSize(config),
    "--bs-body-font-size": "0.875rem",
    "--bs-body-line-height": "1.5",
    "--bs-box-shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "--bs-box-shadow":
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "--bs-box-shadow-lg":
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "--sc-shadow-xs": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "--sc-shadow-md":
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    // capped so large base sizes don't make the sidebar take over the screen
    "--sc-sidebar-width": "min(16rem, 320px)",
  };
  return [
    declBlock(":root", {
      ...shared,
      ...defaultStyle,
      ...styles[styleFor(config)],
    }),
    declBlock(':root, [data-bs-theme="light"]', modeVars(config, "light")),
    declBlock('[data-bs-theme="dark"]', {
      ...modeVars(config, "dark"),
      "color-scheme": "dark",
    }),
    formControlCss(config, "light", '[data-bs-theme="light"]'),
    formControlCss(config, "dark", '[data-bs-theme="dark"]'),
    barCss(config, "light", '[data-bs-theme="light"]'),
    barCss(config, "dark", '[data-bs-theme="dark"]'),
  ].join("\n");
};

module.exports = {
  styles,
  styleFor,
  fonts,
  fontSizes,
  geistMono,
  bases,
  accents,
  themeCss,
  sidebarBackgrounds,
  topbarBackgrounds,
  hexToRgb,
  hslToRgb,
  toHex,
  resolveTokens,
  darkShades,
};
