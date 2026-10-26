// shadcn/ui-inspired layout for Saltcorn, built on Bootstrap 5.3.
// The shell (sidebar, header, auth pages) is rendered here; all view content
// keeps using Bootstrap markup, restyled by public/shadcn.css and the
// generated token layer from palettes.js.

const {
  ul,
  li,
  a,
  span,
  div,
  text,
  text_attr,
  i,
  h1,
  p,
  header,
  footer,
  section,
  button,
  nav,
  img,
  aside,
  form,
  input,
  main,
  script,
} = require("@saltcorn/markup/tags");
const renderLayout = require("@saltcorn/markup/layout");
const { renderForm, link } = require("@saltcorn/markup");
const layoutUtils = require("@saltcorn/markup/layout_utils");
const {
  headersInHead,
  headersInBody,
  alert,
  toast,
  show_icon,
  activeChecker,
} = layoutUtils;
const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");
const Table = require("@saltcorn/data/models/table");
const Plugin = require("@saltcorn/data/models/plugin");
const User = require("@saltcorn/data/models/user");
const db = require("@saltcorn/data/db");
const { getState } = require("@saltcorn/data/db/state");
const {
  themeCss,
  bases,
  accents,
  fonts,
  fontSizes,
  geistMono,
  styles,
  styleFor,
  sidebarBackgrounds,
  topbarBackgrounds,
} = require("./palettes");

const PLUGIN_NAME = "shadcn-theme";
const verstring = "@" + require("./package.json").version;
const publicPath = `/plugins/public/${PLUGIN_NAME}${verstring}`;

// Cache-busting: Saltcorn serves plugin files with a 100-day cache, keyed on
// the URL. Adding each file's modification time makes the URL change as soon
// as the file changes, even without a version bump or a server restart.
const fs = require("fs");
const path = require("path");
const assetStamps = {};
const assetUrl = (file) => {
  const now = Date.now();
  const s = assetStamps[file];
  if (!s || now - s.at > 2000) {
    let v = "";
    try {
      v = Math.round(fs.statSync(path.join(__dirname, "public", file)).mtimeMs).toString(36);
    } catch (e) {}
    assetStamps[file] = { at: now, v };
  }
  const v = assetStamps[file].v;
  return `${publicPath}/${file}${v ? `?v=${v}` : ""}`;
};


// when the function from base is not yet available
const _activeChecker = activeChecker
  ? activeChecker
  : (link, currentUrl) => new RegExp(`^${link}(\\/|\\?|#|$)`).test(currentUrl);

const isActive = (currentUrl, item) =>
  !!currentUrl &&
  ((item.link && _activeChecker(item.link, currentUrl)) ||
    (item.altlinks &&
      item.altlinks.some((l) => _activeChecker(l, currentUrl))) ||
    (item.subitems && item.subitems.some((si) => isActive(currentUrl, si))));

const hasIcon = (icon) => icon && icon !== "empty" && icon !== "undefined";

const showIcon = (icon, cls) =>
  !hasIcon(icon)
    ? ""
    : show_icon
    ? show_icon(icon, cls)
    : i({ class: ["fa-fw", cls, icon] });

const tooltipAttrs = (item, placement) =>
  item.tooltip
    ? {
        "data-bs-toggle": "tooltip",
        "data-bs-placement": placement,
        title: item.tooltip,
      }
    : {};

const linkAttrs = (item) => ({
  href: text(item.link),
  target: item.target_blank ? "_blank" : undefined,
  onclick: item.onclick || undefined,
});

const isButtonStyle = (item) => (item.style || "").includes("btn");

const htmlId = (s) => String(s).replace(/[^A-Za-z0-9_-]/g, "");

/**
 * split the menu into the main navigation, the secondary (header) menu and
 * the user menu
 */
const splitMenu = (menu) => {
  const primary = [];
  const secondary = [];
  const user = [];
  for (const section of menu || []) {
    for (const item of section.items || []) {
      if (item.location === "Mobile Bottom") continue;
      if (section.isUser || item.isUser) user.push(item);
      else if (item.location === "Secondary Menu") secondary.push(item);
      else primary.push(item);
    }
  }
  return { primary, secondary, user };
};

/* ---------------------------------------------------------------- sidebar */

const sidebarSearch = (item) =>
  form(
    {
      action: "/search",
      method: "get",
      class: "sc-sidebar-search",
      role: "search",
    },
    i({ class: "fas fa-search" }),
    input({
      type: "search",
      class: "form-control form-control-sm",
      placeholder: item.label || "Search…",
      name: "q",
      "aria-label": "Search",
    })
  );

const sidebarItem = (ctx, path) => (item, ix) => {
  const id = `${path}-${ix}`;
  const active = isActive(ctx.currentUrl, item);
  if (item.type === "Separator")
    return li({ class: "sc-nav-separator", role: "separator" });
  if (item.type === "Search") return li(sidebarSearch(item));
  if (isButtonStyle(item) && item.link)
    return li(
      { class: "sc-nav-button" },
      a(
        {
          class: [item.style, "btn-sm w-100"],
          ...linkAttrs(item),
          ...tooltipAttrs(item, ctx.tooltipPlacement),
        },
        showIcon(item.icon, "me-1"),
        text(item.label)
      )
    );
  if (item.subitems) {
    const subId = `scnav${htmlId(id)}`;
    // "Expanded" opens top-level groups only; nested ones open when active
    const open =
      active || (ctx.config.sidebar_groups === "expanded" && !path.includes("-"));
    return li(
      { class: ["sc-nav-item", active && "active"] },
      a(
        {
          class: ["sc-nav-link sc-nav-toggle", !open && "collapsed"],
          href: `#${subId}`,
          role: "button",
          "data-bs-toggle": "collapse",
          "aria-expanded": open ? "true" : "false",
          "aria-controls": subId,
          ...(item.tooltip ? { title: item.tooltip } : {}),
        },
        showIcon(item.icon, "sc-nav-icon"),
        span({ class: "sc-nav-text" }, text(item.label)),
        i({ class: "fas fa-chevron-right sc-nav-chevron" })
      ),
      ul(
        { class: ["sc-nav-sub collapse", open && "show"], id: subId },
        item.subitems.map(sidebarItem(ctx, id))
      )
    );
  }
  if (item.link)
    return li(
      { class: "sc-nav-item" },
      a(
        {
          class: ["sc-nav-link", active && "active"],
          ...linkAttrs(item),
          ...(active ? { "aria-current": "page" } : {}),
          ...tooltipAttrs(item, ctx.tooltipPlacement),
        },
        showIcon(item.icon, "sc-nav-icon"),
        span({ class: "sc-nav-text" }, text(item.label)),
        item.shortcut &&
          span({ class: "sc-nav-kbd", "aria-hidden": "true" }, text(item.shortcut))
      )
    );
  // a menu "Header" item: label for the following group of links
  return li({ class: "sc-nav-label" }, text(item.label));
};

const sidebarNav = (ctx, items, path) =>
  ul({ class: "sc-nav" }, items.map(sidebarItem(ctx, path)));

// The session user is a snapshot taken at login, so a File field added or
// changed since then isn't in it. The image therefore comes from AVATAR_URL,
// which reads the field fresh; the initial underneath shows until it loads,
// and stays when there is no image.
const AVATAR_URL = "/shadcn-theme/avatar";

const avatar = (config, user, size = "md") => {
  if (!user) return span({ class: ["sc-avatar", `sc-avatar-${size}`] }, i({ class: "fas fa-user" }));
  return span(
    { class: ["sc-avatar", `sc-avatar-${size}`], "aria-hidden": "true" },
    text((user.email || "?")[0].toUpperCase()),
    config.avatar_file &&
      img({
        class: "sc-avatar-img",
        src: AVATAR_URL,
        alt: "",
        onerror: "this.remove()",
      })
  );
};

const avatarRoute = (config) => ({
  url: AVATAR_URL,
  method: "get",
  callback: async (req, res) => {
    const field = config.avatar_file;
    const u = field && req.user?.id && (await User.findOne({ id: req.user.id }));
    const file = u && u[field];
    if (!file) return res.set("Cache-Control", "no-store").status(404).end();
    // short private cache: a new upload shows within a minute
    res.set("Cache-Control", "private, max-age=60");
    res.redirect(`/files/resize/64/64/${encodeURIComponent(file)}`);
  },
});

// an item with sub items becomes a flyout sub-menu (opened by shadcn.js)
const dropdownItems = (ctx, items) =>
  items.map((si) =>
    si.type === "Separator"
      ? li(hr_())
      : si.subitems
      ? li(
          { class: "sc-submenu" },
          button(
            {
              type: "button",
              class: [
                "dropdown-item sc-submenu-toggle",
                isActive(ctx.currentUrl, si) && "active",
              ],
              "aria-haspopup": "menu",
              "aria-expanded": "false",
            },
            showIcon(si.icon, "me-2 text-body-secondary"),
            text(si.label)
          ),
          ul({ class: "dropdown-menu sc-submenu-menu" }, dropdownItems(ctx, si.subitems))
        )
      : si.link
      ? li(
          a(
            {
              class: ["dropdown-item", isActive(ctx.currentUrl, si) && "active"],
              ...linkAttrs(si),
            },
            showIcon(si.icon, "me-2 text-body-secondary"),
            text(si.label)
          )
        )
      : li(span({ class: "dropdown-header" }, text(si.label)))
  );

const hr_ = () => '<hr class="dropdown-divider">';

/**
 * user block: a dropdown with the user's sub items, or plain links
 * (e.g. Login / Sign up) when the user menu has no sub items
 */
const userMenu = (ctx, items, { placement }) =>
  items
    .map((item, ix) => {
      if (item.subitems)
        return div(
          { class: ["dropdown sc-user-menu", placement === "up" && "dropup"] },
          button(
            {
              class: "sc-user-trigger",
              type: "button",
              "data-bs-toggle": "dropdown",
              "aria-expanded": "false",
              ...(item.tooltip ? { title: item.tooltip } : {}),
            },
            span(
              { class: "sc-avatar-wrap" },
              avatar(ctx.config, ctx.user),
              span({ class: "sc-notify-dot d-none", id: "sc-notify-dot" })
            ),
            ctx.user
              ? span(
                  { class: "sc-user-text" },
                  span({ class: "sc-user-name" }, text(item.label || "User")),
                  span({ class: "sc-user-email" }, text(ctx.user.email || ""))
                )
              : span({ class: "sc-user-text" }, text(item.label)),
            i({ class: "fas fa-sort sc-user-caret" })
          ),
          ul(
            {
              class: [
                "dropdown-menu",
                placement === "up" ? "sc-dropdown-up" : "dropdown-menu-end",
              ],
            },
            ctx.user &&
              li(
                span(
                  { class: "dropdown-header sc-dropdown-user" },
                  avatar(ctx.config, ctx.user, "sm"),
                  span(text(ctx.user.email || ""))
                )
              ),
            ctx.user && li(hr_()),
            dropdownItems(ctx, item.subitems)
          )
        );
      if (item.link)
        return a(
          {
            class: [
              isButtonStyle(item)
                ? `${item.style} btn-sm`
                : ctx.inHeader
                ? "btn btn-ghost btn-sm"
                : "sc-nav-link",
            ],
            ...linkAttrs(item),
          },
          showIcon(item.icon, ctx.inHeader ? "me-1" : "sc-nav-icon"),
          span({ class: "sc-nav-text" }, text(item.label))
        );
      return "";
    })
    .join("");

const brandLink = (brand, config, cls) =>
  brand
    ? a(
        { href: "/", class: ["sc-brand", cls] },
        brand.logo
          ? img({ src: brand.logo, alt: "Logo", class: "sc-brand-logo" })
          : span(
              { class: "sc-brand-mark", "aria-hidden": "true" },
              text((brand.name || "S")[0].toUpperCase())
            ),
        !config.hide_site_name &&
          span({ class: "sc-brand-name" }, text(brand.name || ""))
      )
    : "";

const sidebar = (ctx, { primary, secondary, user }) =>
  aside(
    {
      class: "sc-sidebar offcanvas-lg offcanvas-start d-print-none",
      id: "sc-sidebar",
      tabindex: "-1",
      "aria-label": "Main navigation",
    },
    div(
      { class: "sc-sidebar-header" },
      brandLink(ctx.brand, ctx.config),
      button({
        type: "button",
        class: "btn-close d-lg-none ms-auto",
        "data-bs-dismiss": "offcanvas",
        "data-bs-target": "#sc-sidebar",
        "aria-label": "Close",
      })
    ),
    nav(
      { class: "sc-sidebar-content" },
      sidebarNav(ctx, primary, "p"),
      // secondary items live in the header on desktop
      secondary.length > 0 &&
        div(
          { class: "d-lg-none" },
          li({ class: "sc-nav-separator list-unstyled" }),
          sidebarNav(ctx, secondary, "s")
        )
    ),
    user.length > 0 &&
      div(
        { class: "sc-sidebar-footer" },
        userMenu(ctx, user, { placement: "up" })
      )
  );

/* ----------------------------------------------------------------- header */

const modeToggle = (config) =>
  config.show_mode_toggle
    ? button(
        {
          type: "button",
          class: "btn btn-ghost btn-icon btn-sm",
          onclick: "scToggleMode()",
          title: "Toggle light / dark mode",
          "aria-label": "Toggle light / dark mode",
        },
        i({ class: "fas fa-moon sc-when-light" }),
        i({ class: "fas fa-sun sc-when-dark" })
      )
    : "";

// secondary (header) menu items
const headerItems = (ctx, items) =>
  items
    .map((item, ix) => {
      if (item.type === "Separator")
        return span({ class: "sc-header-sep", role: "separator" });
      if (item.type === "Search")
        return form(
          {
            action: "/search",
            method: "get",
            class: "sc-header-search d-none d-md-flex",
            role: "search",
          },
          i({ class: "fas fa-search" }),
          input({
            type: "search",
            class: "form-control form-control-sm",
            placeholder: item.label || "Search…",
            name: "q",
            "aria-label": "Search",
          })
        );
      if (item.subitems)
        return div(
          { class: "dropdown" },
          button(
            {
              class: "btn btn-ghost btn-sm dropdown-toggle",
              type: "button",
              "data-bs-toggle": "dropdown",
              "aria-expanded": "false",
            },
            showIcon(item.icon, "me-1"),
            text(item.label)
          ),
          ul(
            { class: "dropdown-menu dropdown-menu-end" },
            dropdownItems(ctx, item.subitems)
          )
        );
      if (item.link)
        return a(
          {
            class: [
              isButtonStyle(item) ? `${item.style} btn-sm` : "btn btn-ghost btn-sm",
              isActive(ctx.currentUrl, item) && "active",
            ],
            ...linkAttrs(item),
            ...tooltipAttrs(item, "bottom"),
          },
          showIcon(item.icon, item.label && item.label.trim() ? "me-1" : ""),
          text(item.label)
        );
      return span({ class: "text-body-secondary small" }, text(item.label));
    })
    .join("");

// on desktop the header only appears when it has something to show; on
// small screens it is always there, as it holds the menu button
const headerHasDesktopContent = (config, secondary) =>
  config.collapsible_sidebar !== false ||
  !!config.show_title ||
  !!config.show_mode_toggle ||
  secondary.length > 0;

const sidebarHeader = (ctx, { secondary }) =>
  header(
    {
      class: [
        "sc-header d-print-none",
        !headerHasDesktopContent(ctx.config, secondary) && "d-lg-none",
      ],
    },
    button(
      {
        type: "button",
        class: "btn btn-ghost btn-icon btn-sm d-lg-none",
        "data-bs-toggle": "offcanvas",
        "data-bs-target": "#sc-sidebar",
        "aria-controls": "sc-sidebar",
        "aria-label": "Open menu",
      },
      i({ class: "fas fa-bars" })
    ),
    ctx.config.collapsible_sidebar !== false &&
      button(
        {
          type: "button",
          class: "btn btn-ghost btn-icon btn-sm d-none d-lg-inline-flex",
          "data-sidebar-toggler": "true",
          // self-contained: core may dispatch this click before shadcn.js loads
          onclick:
            "document.getElementById('sc-shell').classList.toggle('sc-sidebar-collapsed')",
          "aria-label": "Toggle sidebar",
          title:
            ctx.config.keyboard_shortcuts === false
              ? "Toggle sidebar"
              : "Toggle sidebar (⌘B / Ctrl+B)",
          "aria-keyshortcuts": ctx.config.keyboard_shortcuts === false ? undefined : "Control+B Meta+B",
        },
        i({ class: "fas fa-columns" })
      ),
    ctx.config.show_title
      ? span({ class: "sc-header-sep" }) +
          h1({ class: "sc-header-title" }, text(ctx.title || ""))
      : "",
    div(
      { class: "sc-header-actions" },
      div({ class: "d-none d-lg-flex align-items-center gap-1" }, headerItems(ctx, secondary)),
      modeToggle(ctx.config)
    )
  );

/* ------------------------------------------------------------ top navbar */

const topNavItem = (ctx) => (item, ix) => {
  if (item.location === "Mobile Bottom") return "";
  if (item.type === "Separator")
    return span({ class: "sc-header-sep", role: "separator" });
  if (item.type === "Search") return headerItems(ctx, [item]);
  if (item.subitems)
    return div(
      { class: "dropdown" },
      button(
        {
          class: [
            "sc-topnav-link dropdown-toggle",
            isActive(ctx.currentUrl, item) && "active",
          ],
          type: "button",
          "data-bs-toggle": "dropdown",
          "aria-expanded": "false",
        },
        showIcon(item.icon, "me-1"),
        text(item.label)
      ),
      ul({ class: "dropdown-menu" }, dropdownItems(ctx, item.subitems))
    );
  if (item.link)
    return a(
      {
        class: [
          isButtonStyle(item) ? `${item.style} btn-sm` : "sc-topnav-link",
          isActive(ctx.currentUrl, item) && "active",
        ],
        ...linkAttrs(item),
        ...tooltipAttrs(item, "bottom"),
      },
      showIcon(item.icon, "me-1"),
      text(item.label)
    );
  return span({ class: "sc-topnav-label" }, text(item.label));
};

const topbar = (ctx, parts) =>
  header(
    { class: "sc-topbar d-print-none" },
    div(
      { class: ctx.fluid ? "container-fluid" : "container-xl" },
      button(
        {
          type: "button",
          class: "btn btn-ghost btn-icon btn-sm d-lg-none",
          "data-bs-toggle": "offcanvas",
          "data-bs-target": "#sc-sidebar",
          "aria-controls": "sc-sidebar",
          "aria-label": "Open menu",
        },
        i({ class: "fas fa-bars" })
      ),
      brandLink(ctx.brand, ctx.config),
      nav(
        { class: "sc-topnav d-none d-lg-flex", "aria-label": "Main navigation" },
        parts.primary.map(topNavItem(ctx)).join(""),
        // items that don't fit are moved in here by shadcn.js
        div(
          { class: "dropdown sc-topnav-more", hidden: true },
          button(
            {
              class: "sc-topnav-link dropdown-toggle",
              type: "button",
              "data-bs-toggle": "dropdown",
              "aria-expanded": "false",
            },
            "More"
          ),
          ul({ class: "dropdown-menu dropdown-menu-end" })
        )
      ),
      div(
        { class: "sc-header-actions" },
        div(
          { class: "d-none d-lg-flex align-items-center gap-1" },
          headerItems(ctx, parts.secondary)
        ),
        modeToggle(ctx.config),
        parts.user.length > 0 &&
          div(
            { class: "d-none d-lg-block" },
            userMenu({ ...ctx, inHeader: true }, parts.user, {
              placement: "down",
            })
          )
      )
    )
  ) +
  // mobile: the same navigation as an offcanvas sidebar
  div({ class: "d-lg-none" }, sidebar(ctx, parts));

/* ------------------------------------------------------------ body blocks */

const blockDispatch = (config) => ({
  pageHeader: ({ title, blurb }) =>
    div(
      { class: "sc-page-header" },
      h1({ class: "sc-page-title" }, title),
      blurb && p({ class: "sc-page-description" }, blurb)
    ),
  footer: ({ contents }) =>
    footer({ id: "footer", class: "sc-footer" }, div(contents)),
  hero: ({ caption, blurb, cta, backgroundImage }) =>
    section(
      {
        class: "sc-hero",
        style: backgroundImage
          ? `background-image: url('${String(backgroundImage).replace(/['"\\<>\n\r]/g, "")}')`
          : undefined,
      },
      div(
        { class: "sc-hero-inner" },
        h1({ class: "sc-hero-title" }, caption),
        blurb && p({ class: "sc-hero-blurb" }, blurb),
        cta || ""
      )
    ),
});

const hints = {
  cardTitleClass: "sc-card-title",
};

const renderBody = (title, body, alerts, config, role, req) =>
  renderLayout({
    blockDispatch: blockDispatch(config),
    role,
    req,
    alerts,
    hints,
    layout:
      typeof body === "string" && config.in_card
        ? { type: "card", title, contents: body }
        : body,
  });

/* -------------------------------------------------------------- document */

const validMode = (m) => ["light", "dark", "auto"].includes(m);

// the site-wide Mode setting, also when a user's personal layout config is merged in
const siteMode = () => {
  const cfgs = getState()?.plugin_cfgs || {};
  for (const [name, cfg] of Object.entries(cfgs))
    if (name === PLUGIN_NAME || name.endsWith(`/${PLUGIN_NAME}`)) return cfg?.mode;
};

// "default" is the personal "Site default" choice
const resolvedMode = (config) => {
  const m = config?.mode === "default" ? siteMode() : config?.mode;
  return validMode(m) ? m : "light";
};

// applies "auto" and the user's local override before first paint
const modeScript = (mode, allowToggle) => `<script>
(function () {
  // A visitor's header-toggle choice is stored as "<choice>|<configured mode>"
  // and only applies while the configured mode is unchanged, so changing the
  // Mode setting always takes effect. This lives inline (not in the cached
  // .js file) so the stored format and the check can never get out of step.
  var KEY = "sc-shadcn-mode";
  var configured = ${JSON.stringify(mode)};
  var mode = configured;
  var override = null;
  window._sc_shadcn_auto = configured === "auto";
  ${
    allowToggle
      ? `try {
    var s = (localStorage.getItem(KEY) || "").split("|");
    if ((s[0] === "light" || s[0] === "dark") && s[1] === configured) mode = override = s[0];
    else localStorage.removeItem(KEY);
  } catch (e) {}
  // used by the settings form (shadcn.js): saving it resets the toggle
  window.scModeOverride = function () {
    return override;
  };
  window.scClearModeOverride = function () {
    override = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
  };
  window.scToggleMode = function () {
    var next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);
    window._sc_lightmode = next;
    override = next;
    try { localStorage.setItem(KEY, next + "|" + configured); } catch (e) {}
  };`
      : ""
  }
  var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  if (mode === "auto") mode = mq && mq.matches ? "dark" : "light";
  document.documentElement.setAttribute("data-bs-theme", mode);
  // "Follow system": switch live when the OS appearance changes, unless the
  // visitor picked a mode with the header toggle
  if (configured === "auto" && mq && mq.addEventListener)
    mq.addEventListener("change", function (e) {
      if (override) return;
      var next = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", next);
      window._sc_lightmode = next;
    });
})();
</script>`;

/* --------------------------------------------------------- toasts */

const toastPositions = [
  { name: "top-right", label: "Top right" },
  { name: "top-center", label: "Top center" },
  { name: "top-left", label: "Top left" },
  { name: "bottom-right", label: "Bottom right" },
  { name: "bottom-center", label: "Bottom center" },
  { name: "bottom-left", label: "Bottom left" },
];
const toastStyles = [
  { name: "classic", label: "Classic", hint: "Saltcorn's coloured header" },
  { name: "sonner", label: "Sonner", hint: "shadcn/ui's toast" },
  { name: "rich", label: "Rich colors", hint: "tinted in the type's colour" },
  { name: "accent", label: "Accent", hint: "card with a coloured edge" },
];
const oneOf = (list, v, dflt) => (list.some((o) => o.name === v) ? v : dflt);
// top bar position and background, on <html> so they reach both the Topbar
// layout's bar and the Sidebar layout's header
const barClasses = (config) => {
  const bg = topbarBackgrounds.includes(config.topbar_bg) ? config.topbar_bg : "Default";
  return [
    config.topbar_position === "static" && "sc-topbar-static",
    bg === "Transparent" && "sc-topbar-transparent",
    bg === "Transparent" && config.topbar_light_text && "sc-topbar-light-text",
    bg !== "Default" && bg !== "Transparent" && "sc-topbar-solid",
  ]
    .filter(Boolean)
    .join(" ");
};

const toastClasses = (config) =>
  `sc-toast-${oneOf(toastPositions, config.toast_position, "top-right")} sc-toasts-${oneOf(
    toastStyles,
    config.toast_style,
    "classic"
  )}`;

// clickable previews for the config form; they set the toast_style select,
// whose change event makes the form autosave
const toastStylePicker = () =>
  div(
    { class: "sc-toast-picker", role: "group", "aria-label": "Toast style" },
    toastStyles.map((st) =>
      // a div, not a <button>: the previews contain toasts with close buttons
      div(
        {
          class: `sc-toast-preview sc-toasts-${st.name}`,
          role: "button",
          tabindex: "0",
          "data-toast-style": st.name,
          "aria-pressed": "false",
        },
        span({ class: "sc-toast-preview-name" }, `${st.label} · ${st.hint}`),
        toast("success", "Changes saved"),
        toast("danger", "Could not delete row")
      )
    )
  ) +
  // deferred: the toast_style select comes after the previews in the form
  script(`document.addEventListener('DOMContentLoaded', function(){
  var s = document.querySelector('form [name=toast_style]');
  if (!s) return;
  var previews = document.querySelectorAll('.sc-toast-preview');
  var sync = function(){ previews.forEach(function(b){
    b.setAttribute('aria-pressed', b.dataset.toastStyle === (s.value || 'classic') ? 'true' : 'false'); }); };
  var pick = function(b){ if (s.value === b.dataset.toastStyle) return;
    s.value = b.dataset.toastStyle; s.dispatchEvent(new Event('change', { bubbles: true })); };
  previews.forEach(function(b){
    b.addEventListener('click', function(){ pick(b); });
    b.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(b); } });
  });
  s.addEventListener('change', sync); sync();
});`);

const wrapIt = (config, cssCache, bodyAttr, headers, title, body, req) => {
  const mode = resolvedMode(config);
  const isRTL = !!req?.isRTL;
  return `<!doctype html>
<html lang="${text_attr(req?.getLocale?.() || "en")}" class="sc-style-${styleFor(
    config
  ).toLowerCase()} ${toastClasses(config)} ${barClasses(config)}" data-bs-theme="${
    mode === "dark" ? "dark" : "light"
  }"${isRTL ? ' dir="rtl"' : ""}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${modeScript(mode, config.show_mode_toggle)}
    <link rel="stylesheet" href="${publicPath}/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="${assetUrl("fonts/fonts.css")}">
    <link rel="stylesheet" href="${publicPath}/bootstrap${
    isRTL ? ".rtl" : ""
  }.min.css">
    <link rel="stylesheet" href="${assetUrl("shadcn.css")}">
    <style id="sc-shadcn-tokens">${cssCache}</style>
    ${headersInHead(headers, mode === "dark")}
    <title>${text(title)}</title>
  </head>
  <body ${bodyAttr}>
    ${body}
    <script src="/static_assets/${
      db.connectObj.version_tag
    }/jquery-3.6.0.min.js"></script>
    <script src="${publicPath}/bootstrap.bundle.min.js"></script>
    <script src="${assetUrl("shadcn.js")}"></script>
    ${headersInBody(headers)}
  </body>
</html>`;
};

const wrap =
  (config, cssCache) =>
  ({
    title,
    menu,
    brand,
    alerts,
    currentUrl,
    originalUrl,
    body,
    headers,
    role,
    req,
    bodyClass,
    requestFluidLayout,
  }) => {
    const fluid = !!(config.fluid || requestFluidLayout);
    const ctx = {
      config,
      brand,
      title,
      currentUrl: currentUrl || originalUrl,
      user: req?.user,
      fluid,
      tooltipPlacement: req?.isRTL ? "left" : "right",
    };
    const parts = splitMenu(menu);
    const hasMenu =
      parts.primary.length + parts.secondary.length + parts.user.length > 0;
    const hideMenu =
      !hasMenu || (config.layout_style === "No menu" && (role || 100) > 1);
    const content = main(
      {
        id: "page-inner-content",
        class: ["sc-content", fluid ? "container-fluid" : "container-xl"],
      },
      renderBody(title, body, alerts, config, role, req)
    );
    const layoutStyle = hideMenu ? "none" : config.layout_style || "Sidebar";
    let shell;
    if (layoutStyle === "none")
      shell = div({ id: "sc-shell", class: "sc-shell sc-shell-plain" }, content);
    else if (layoutStyle === "Topbar")
      shell = div(
        { id: "sc-shell", class: "sc-shell sc-shell-topbar" },
        topbar(ctx, parts),
        content
      );
    else
      shell = div(
        {
          id: "sc-shell",
          class: [
            "sc-shell sc-shell-sidebar",
            config.sidebar_variant === "Floating" && "sc-sidebar-floating",
            config.sidebar_variant === "Inset" && "sc-sidebar-inset",
          ],
        },
        sidebar(ctx, parts),
        div({ class: "sc-main" }, sidebarHeader(ctx, parts), content)
      );
    return wrapIt(
      config,
      cssCache,
      `class="${text_attr(bodyClass || "")}"`,
      headers,
      title,
      shell + shortcutConfig(config, layoutStyle, parts),
      req
    );
  };

// tells shadcn.js which keyboard shortcuts apply on this page; menu item
// shortcuts (handled by core) are listed so the theme never overrides them
// and can show them in the "?" help panel
const shortcutConfig = (config, layoutStyle, parts) => {
  if (config.keyboard_shortcuts === false) return "";
  const menu = [];
  const walk = (items) =>
    (items || []).forEach((it) => {
      if (it.shortcut && it.link) menu.push({ label: it.label, shortcut: it.shortcut });
      walk(it.subitems);
    });
  walk([...parts.primary, ...parts.secondary, ...parts.user]);
  const cfg = {
    sidebar:
      layoutStyle === "Sidebar" || layoutStyle === "Topbar" || layoutStyle === "No menu",
    collapse: layoutStyle !== "Topbar" && config.collapsible_sidebar !== false,
    mode: !!config.show_mode_toggle,
    menu,
  };
  return `<script type="application/json" id="sc-shortcuts">${JSON.stringify(
    cfg
  ).replace(/</g, "\\u003c")}</script>`;
};

/* ------------------------------------------------------------------- auth */

const renderAuthLinks = (authLinks, req) => {
  const __ = req?.__ || ((s) => s);
  const methods = (authLinks.methods || [])
    .map(({ url, icon, label }) =>
      a(
        { href: url, class: "btn btn-outline-secondary w-100" },
        icon || "",
        `&nbsp;${__("Login with %s", label)}`
      )
    )
    .join("");
  const links = [];
  if (authLinks.login)
    links.push(link(authLinks.login, __("Already have an account? Login!")));
  if (authLinks.forgot)
    links.push(link(authLinks.forgot, __("Forgot password?")));
  if (authLinks.signup)
    links.push(link(authLinks.signup, __("Create an account!")));
  if (authLinks.publicUser)
    links.push(link(authLinks.publicUser, __("Continue as public user")));
  return (
    (methods
      ? div({ class: "sc-auth-divider" }, span(__("or"))) +
        div({ class: "d-grid gap-2" }, methods)
      : "") +
    (links.length
      ? div(
          { class: "sc-auth-links" },
          links.map((l) => div(l)).join("")
        )
      : "")
  );
};

const formModify = (form) => {
  form.formStyle = "vert";
  form.submitButtonClass = "btn-primary w-100";
  return form;
};

const toastsArea = (alerts) =>
  div(
    {
      id: "toasts-area",
      class: "toast-container position-fixed top-0 end-0 p-3",
      style: "z-index: 9999;",
      "aria-live": "polite",
      "aria-atomic": "true",
    },
    (alerts || [])
      .map((al) => (toast ? toast(al.type, al.msg) : alert(al.type, al.msg)))
      .join("")
  );

const authWrap =
  (config, cssCache) =>
  ({
    title,
    alerts,
    form,
    afterForm,
    brand,
    headers,
    csrfToken,
    authLinks,
    bodyClass,
    req,
  }) =>
    wrapIt(
      config,
      cssCache,
      `class="sc-auth-body ${text_attr(bodyClass || "")}"`,
      headers,
      title,
      div(
        { class: "sc-auth" },
        div(
          { class: "sc-auth-inner" },
          brand && brandLink(brand, { ...config, hide_site_name: false }, "sc-auth-brand"),
          div(
            { class: "card sc-auth-card" },
            div(
              { class: "card-header" },
              h1({ class: "sc-card-title sc-auth-title" }, text(title))
            ),
            div(
              { class: "card-body" },
              renderForm(formModify(form), csrfToken),
              renderAuthLinks(authLinks || {}, req)
            )
          ),
          afterForm || ""
        ),
        toastsArea(alerts)
      ),
      req
    );

/* --------------------------------------------------------- configuration */

const colorOptions = ["Default", ...Object.keys(accents), "Custom"];

const barBgLabels = {
  Default: "Default",
  Transparent: "Transparent",
  Background: "Page background",
  Card: "Card background",
  Sidebar: "Same as sidebar",
  Muted: "Muted",
  Primary: "Primary color",
  Dark: "Dark",
  Custom: "Custom",
};
const barBgOptions = (names) => names.map((name) => ({ name, label: barBgLabels[name] }));

const barCustomFields = (prefix, label) => [
  {
    name: `${prefix}_custom`,
    label: `Custom ${label} color`,
    type: "Color",
    default: "#18181b",
    showIf: { [`${prefix}_bg`]: "Custom" },
  },
  {
    name: `${prefix}_custom_dark_on`,
    label: `Different ${label} color in dark mode`,
    type: "Bool",
    showIf: { [`${prefix}_bg`]: "Custom" },
  },
  {
    name: `${prefix}_custom_dark`,
    label: `Custom ${label} color (dark mode)`,
    type: "Color",
    default: "#18181b",
    showIf: { [`${prefix}_bg`]: "Custom", [`${prefix}_custom_dark_on`]: true },
  },
];

const formSection = (label, showIf) => ({
  input_type: "section_header",
  label,
  ...(showIf ? { showIf } : {}),
});

// one step only: core's "Reload page to see changes" restarts the workflow
// at its first step, so a multi-step form looks like it lost the later steps
const configuration_workflow = () =>
  new Workflow({
    steps: [
      {
        name: "Theme",
        form: async () => {
          const userTable = Table.findOne({ name: "users" });
          const userFields = userTable ? await userTable.getFields() : [];
          return new Form({
            fields: [
              formSection("Layout"),
              {
                name: "layout_style",
                label: "Layout style",
                type: "String",
                required: true,
                default: "Sidebar",
                attributes: {
                  inline: true,
                  options: ["Sidebar", "Topbar", "No menu"],
                },
                sublabel:
                  "No menu hides navigation for non-admin users (admins still get the sidebar)",
              },
              {
                name: "sidebar_variant",
                label: "Sidebar variant",
                type: "String",
                required: true,
                default: "Sidebar",
                attributes: { options: ["Sidebar", "Floating", "Inset"] },
                showIf: { layout_style: ["Sidebar", "No menu"] },
              },
              {
                name: "collapsible_sidebar",
                label: "Collapsible sidebar",
                sublabel: "Show a button that hides the sidebar on desktop",
                type: "Bool",
                default: true,
                showIf: { layout_style: ["Sidebar", "No menu"] },
              },
              {
                name: "sidebar_groups",
                label: "Sidebar menu groups",
                sublabel:
                  "How menu items with sub-items start out. Expanded opens the top level only; deeper groups stay collapsed. The group holding the current page is always open. With the Topbar layout this is the menu on phones",
                type: "String",
                required: true,
                default: "collapsed",
                attributes: {
                  options: [
                    { name: "collapsed", label: "Collapsed" },
                    { name: "expanded", label: "Expanded" },
                  ],
                },
              },
              {
                name: "keyboard_shortcuts",
                label: "Keyboard shortcuts",
                sublabel:
                  "⌘/Ctrl+B toggles the sidebar, D light/dark (when the header toggle is on), / focuses search, ? lists all shortcuts. Never overrides menu item shortcuts",
                type: "Bool",
                default: true,
              },
              {
                name: "show_title",
                label: "Show page title in header",
                type: "Bool",
                showIf: { layout_style: ["Sidebar", "No menu"] },
              },
              {
                name: "fluid",
                label: "Fluid content width",
                type: "Bool",
              },
              {
                name: "in_card",
                label: "Put simple pages in a card",
                type: "Bool",
              },
              {
                name: "hide_site_name",
                label: "Hide site name next to logo",
                type: "Bool",
              },
              {
                name: "avatar_file",
                label: "Avatar field",
                sublabel:
                  "A File field on the users table with the user's image",
                type: "String",
                attributes: {
                  options: userFields
                    .filter((f) => f.type === "File")
                    .map((f) => f.name),
                },
              },

              formSection("Colors and mode"),
              {
                name: "mode",
                label: "Mode",
                type: "String",
                required: true,
                default: "light",
                attributes: {
                  options: [
                    { name: "light", label: "Light" },
                    { name: "dark", label: "Dark" },
                    { name: "auto", label: "Follow system" },
                  ],
                },
              },
              {
                name: "show_mode_toggle",
                label: "Light/dark toggle in header",
                sublabel: "Lets each visitor switch mode (stored in their browser)",
                type: "Bool",
              },
              {
                name: "base_color",
                label: "Base color",
                type: "String",
                required: true,
                default: "Zinc",
                attributes: { options: Object.keys(bases) },
              },
              {
                name: "dark_shade",
                label: "Dark mode shade",
                sublabel:
                  "How deep the dark mode background is. Lower values give a softer, dimmer dark",
                type: "String",
                required: true,
                default: "100",
                attributes: {
                  options: [
                    { name: "100", label: "100% (deepest)" },
                    { name: "75", label: "75%" },
                    { name: "50", label: "50%" },
                    { name: "25", label: "25% (dim)" },
                  ],
                },
              },
              {
                // stored as accent_color for compatibility with saved configs
                name: "accent_color",
                label: "Primary color",
                sublabel:
                  "Buttons, links, focus rings, checkboxes. Default uses the base color (near-black in light mode)",
                type: "String",
                required: true,
                default: "Default",
                attributes: { options: colorOptions },
              },
              {
                name: "custom_primary",
                label: "Custom primary color",
                type: "Color",
                default: "#2563eb",
                showIf: { accent_color: "Custom" },
              },
              {
                name: "custom_primary_dark_on",
                label: "Different primary color in dark mode",
                type: "Bool",
                showIf: { accent_color: "Custom" },
              },
              {
                name: "custom_primary_dark",
                label: "Custom primary color (dark mode)",
                type: "Color",
                default: "#2563eb",
                showIf: { accent_color: "Custom", custom_primary_dark_on: true },
              },
              {
                name: "secondary_color",
                label: "Secondary color",
                sublabel:
                  "Secondary buttons and badges. Default is the neutral gray from the base color",
                type: "String",
                required: true,
                default: "Default",
                attributes: { options: colorOptions },
              },
              {
                name: "custom_secondary",
                label: "Custom secondary color",
                type: "Color",
                default: "#64748b",
                showIf: { secondary_color: "Custom" },
              },
              {
                name: "custom_secondary_dark_on",
                label: "Different secondary color in dark mode",
                type: "Bool",
                showIf: { secondary_color: "Custom" },
              },
              {
                name: "custom_secondary_dark",
                label: "Custom secondary color (dark mode)",
                type: "Color",
                default: "#64748b",
                showIf: { secondary_color: "Custom", custom_secondary_dark_on: true },
              },
              {
                name: "radius",
                label: "Radius",
                type: "String",
                required: true,
                default: "0.5",
                attributes: {
                  options: [
                    { name: "0", label: "0" },
                    { name: "0.3", label: "0.3rem" },
                    { name: "0.5", label: "0.5rem" },
                    { name: "0.625", label: "0.625rem" },
                    { name: "0.75", label: "0.75rem" },
                    { name: "1", label: "1rem" },
                  ],
                },
              },

              formSection("Typography"),
              {
                name: "font",
                label: "Font",
                type: "String",
                required: true,
                default: "Inter",
                attributes: {
                  options: Object.entries(fonts).map(([name, f]) => ({
                    name,
                    label: f.label,
                  })),
                },
              },
              {
                name: "font_size",
                label: "Base font size",
                sublabel:
                  "Size of body text; buttons, inputs, tables, menus and spacing scale with it",
                type: "String",
                required: true,
                default: "14px",
                attributes: { options: fontSizes },
              },

              formSection("Sidebar and top bar"),
              {
                name: "sidebar_bg",
                label: "Sidebar background",
                sublabel:
                  "Text, hover and borders adapt to the color. Default is the base color's sidebar tone; Dark is a dark sidebar in light mode too. With the Topbar layout this is the menu on phones",
                type: "String",
                required: true,
                default: "Default",
                attributes: { options: barBgOptions(sidebarBackgrounds) },
              },
              ...barCustomFields("sidebar", "sidebar"),
              {
                name: "topbar_bg",
                label: "Top bar background",
                sublabel:
                  "The Topbar layout's bar and the Sidebar layout's header. Default is frosted glass; Transparent turns frosted once the page scrolls under it",
                type: "String",
                required: true,
                default: "Default",
                attributes: { options: barBgOptions(topbarBackgrounds) },
              },
              ...barCustomFields("topbar", "top bar"),
              {
                name: "topbar_light_text",
                label: "Light text on the transparent bar",
                sublabel:
                  "White text and icons while the bar sits on a background image at the top of the page (for dark images)",
                type: "Bool",
                showIf: { topbar_bg: "Transparent" },
              },
              {
                name: "topbar_opacity",
                label: "Top bar opacity",
                sublabel:
                  "How solid the frosted bar is (Default, and Transparent once scrolled). Lower lets more of the page show through",
                type: "String",
                required: true,
                default: "85",
                attributes: {
                  options: [
                    { name: "100", label: "100% (solid)" },
                    { name: "85", label: "85%" },
                    { name: "70", label: "70%" },
                    { name: "50", label: "50%" },
                    { name: "35", label: "35%" },
                    { name: "20", label: "20%" },
                  ],
                },
                showIf: { topbar_bg: ["Default", "Transparent"] },
              },
              {
                name: "topbar_position",
                label: "Top bar position",
                type: "String",
                required: true,
                default: "fixed",
                attributes: {
                  options: [
                    { name: "fixed", label: "Fixed at the top" },
                    { name: "static", label: "Scrolls with the page" },
                  ],
                },
              },

              formSection("Toasts"),
              {
                name: "toast_position",
                label: "Position",
                type: "String",
                required: true,
                default: "top-right",
                attributes: { options: toastPositions },
              },
              {
                name: "toast_style_picker",
                label: "Style",
                input_type: "custom_html",
                attributes: { html: toastStylePicker() },
              },
              {
                name: "toast_style",
                label: "Selected style",
                sublabel: "Click a preview above, or pick here",
                type: "String",
                required: true,
                default: "classic",
                attributes: { options: toastStyles.map(({ name, label }) => ({ name, label })) },
              },

              formSection("Style"),
              {
                name: "style",
                label: "Style",
                sublabel:
                  "shadcn/ui component styles: control sizes, spacing and corner shapes. Default is this theme's original look; Vega is shadcn's classic one",
                type: "String",
                required: true,
                default: "Default",
                attributes: { options: Object.keys(styles) },
              },
            ],
          });
        },
      },
    ],
  });

const user_config_form = async (ctx) =>
  new Form({
    fields: [
      {
        name: "mode",
        label: "Mode",
        sublabel: "Site default follows the Mode chosen in the theme settings",
        type: "String",
        required: true,
        default: "default",
        attributes: {
          options: [
            { name: "default", label: "Site default" },
            { name: "light", label: "Light" },
            { name: "dark", label: "Dark" },
            { name: "auto", label: "Follow system" },
          ],
        },
      },
    ],
  });

const layout = (config = {}) => {
  const cssCache = themeCss(config);
  return {
    hints,
    wrap: wrap(config, cssCache),
    authWrap: authWrap(config, cssCache),
    renderBody: ({ title, body, alerts, role, req }) =>
      renderBody(title, body, alerts, config, role, req),
  };
};

module.exports = {
  sc_plugin_api_version: 1,
  plugin_name: PLUGIN_NAME,
  layout,
  configuration_workflow,
  user_config_form,
  // offered in the page builder's font picker (all bundled fonts are available)
  fonts: () => ({
    ...Object.fromEntries(
      Object.entries(fonts)
        .filter(([name]) => name !== "System")
        .map(([name, f]) => [name, f.sans])
    ),
    "Geist Mono": geistMono,
  }),
  routes: (config = {}) => [avatarRoute(config)],
  actions: () => ({
    toggle_shadcn_dark_mode: {
      description: "Switch between dark and light mode",
      configFields: [],
      run: async ({ user, req }) => {
        if (!user) return { error: "Not logged in" };
        let plugin = await Plugin.findOne({ name: PLUGIN_NAME });
        if (!plugin)
          plugin = await Plugin.findOne({ name: `@saltcorn/${PLUGIN_NAME}` });
        const dbUser = await User.findOne({ id: user.id });
        const attrs = dbUser._attributes || {};
        const userLayout = attrs.layout || { config: {} };
        userLayout.plugin = plugin.name;
        const currentMode =
          userLayout.config.mode || plugin.configuration?.mode || "light";
        userLayout.config.mode = currentMode === "dark" ? "light" : "dark";
        userLayout.config.is_user_config = true;
        attrs.layout = userLayout;
        await dbUser.update({ _attributes: attrs });
        await db.commitAndBeginNewTransaction?.();
        await getState().refreshUserLayouts?.();
        await dbUser.relogin(req);
        return { reload_page: true };
      },
    },
  }),
};
