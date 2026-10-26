/* shadcn-theme client helpers */
(function () {
  var MODE_KEY = "sc-shadcn-mode";

  function currentMode() {
    return document.documentElement.getAttribute("data-bs-theme") === "dark"
      ? "dark"
      : "light";
  }

  function applyMode(mode) {
    document.documentElement.setAttribute("data-bs-theme", mode);
    window._sc_shadcn_mode = mode;
    // core uses this for e.g. code editor themes
    window._sc_lightmode = mode;
  }

  // the header toggle (window.scToggleMode) is defined inline in the page head

  // "Follow system": track OS changes unless the visitor picked a mode
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (e) {
      var stored = null;
      try {
        stored = localStorage.getItem(MODE_KEY);
      } catch (err) {}
      if (!stored && window._sc_shadcn_auto) applyMode(e.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // unread notification indicator on the user avatar (called by core)
  window.update_theme_notification_count = function (n) {
    var dots = document.querySelectorAll(".sc-notify-dot");
    for (var k = 0; k < dots.length; k++)
      dots[k].classList.toggle("d-none", !(+n > 0));
  };

  function initBootstrapWidgets(root) {
    if (!window.bootstrap) return;
    var tts = (root || document).querySelectorAll('[data-bs-toggle="tooltip"]');
    for (var k = 0; k < tts.length; k++)
      bootstrap.Tooltip.getOrCreateInstance(tts[k]);
    var pops = (root || document).querySelectorAll('[data-bs-toggle="popover"]');
    for (var j = 0; j < pops.length; j++)
      bootstrap.Popover.getOrCreateInstance(pops[j]);
  }
  window.scInitWidgets = initBootstrapWidgets;

  // the server only knows the configured mode ("auto" or the pre-toggle one)
  window._sc_lightmode = currentMode();

  function onReady() {
    initBootstrapWidgets(document);
    // entities page: core gives its bulk-action selects an inline
    // "border: 2px solid … !important", which no stylesheet can override
    var bulkSelects = document.querySelectorAll("#entity-selection-bar select");
    for (var b = 0; b < bulkSelects.length; b++) bulkSelects[b].style.removeProperty("border");
    // enable sidebar transitions only after the initial (possibly collapsed)
    // state has been applied, so the page doesn't animate on load
    setTimeout(function () {
      document.body.classList.add("sc-ready");
    }, 50);
    // close the mobile sidebar when navigating within the page
    var sidebar = document.getElementById("sc-sidebar");
    if (sidebar && window.bootstrap) {
      sidebar.addEventListener("click", function (e) {
        var link = e.target.closest && e.target.closest("a.sc-nav-link[href^='javascript:']");
        if (!link) return;
        var oc = bootstrap.Offcanvas.getInstance(sidebar);
        if (oc) oc.hide();
      });
    }
  }

  /* ------------------------------------------------------------ shortcuts
   * ⌘/Ctrl+B sidebar, D light/dark, / search, ? help. Core's own shortcuts
   * (menu items, entities page Alt+…, builder ⌘/Ctrl+C/X/V/Z/Y) are never
   * overridden: menu item shortcuts win, and nothing here uses Alt.
   */
  // userAgentData.platform is "macOS" in Chrome, navigator.platform "MacIntel"
  var IS_MAC = /mac|iphone|ipad/i.test(
    (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || ""
  );

  function shortcutConfig() {
    var el = document.getElementById("sc-shortcuts");
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  }

  // same matching rules as core's menu shortcut handler (saltcorn.js)
  function matchesMenuShortcut(e) {
    var list = window._sc_menu_shortcuts || [];
    for (var i = 0; i < list.length; i++) {
      var parts = String(list[i].shortcut).split("+");
      var need = { alt: false, ctrl: false, shift: false, meta: false };
      var key = "";
      for (var j = 0; j < parts.length; j++) {
        var p = parts[j].trim().toLowerCase();
        if (p in need) need[p] = true;
        else key = p;
      }
      if (
        e.altKey === need.alt &&
        e.ctrlKey === need.ctrl &&
        e.shiftKey === need.shift &&
        e.metaKey === need.meta &&
        (e.key === " " ? "space" : e.key.toLowerCase()) === key
      )
        return true;
    }
    return false;
  }

  function isTyping(t) {
    if (!t || !t.closest) return false;
    if (t.isContentEditable) return true;
    if (t.closest(".CodeMirror, .cm-editor, .monaco-editor, .ql-editor, .cke, .ProseMirror")) return true;
    var tag = t.tagName;
    if (tag === "TEXTAREA" || tag === "SELECT") return true;
    if (tag === "INPUT")
      return !/^(checkbox|radio|button|submit|reset|range|color|file)$/i.test(t.type);
    return false;
  }

  // rich text / code editors use ⌘/Ctrl+B for bold or their own commands
  function inEditor(t) {
    return !!(
      t &&
      t.closest &&
      (t.isContentEditable ||
        t.closest(".CodeMirror, .cm-editor, .monaco-editor, .ql-editor, .cke, .ProseMirror"))
    );
  }

  function toggleSidebar() {
    var sidebar = document.getElementById("sc-sidebar");
    if (!sidebar) return false;
    var desktop = window.matchMedia && window.matchMedia("(min-width: 992px)").matches;
    if (desktop) {
      // only when the sidebar is collapsible: reuse the header button so core
      // remembers the state (it listens to clicks on [data-sidebar-toggler])
      var btn = document.querySelector("[data-sidebar-toggler]");
      if (!btn) return false;
      btn.click();
      return true;
    }
    if (!window.bootstrap) return false;
    bootstrap.Offcanvas.getOrCreateInstance(sidebar).toggle();
    return true;
  }

  // the page's own search box first, then the menu search
  function focusSearch() {
    var groups = [
      "#page-inner-content input[type=search]",
      ".sc-header-search input",
      "#sc-sidebar input[type=search]",
    ];
    for (var g = 0; g < groups.length; g++) {
      var candidates = document.querySelectorAll(groups[g]);
      for (var i = 0; i < candidates.length; i++) {
        var inp = candidates[i];
        if (inp.offsetParent !== null) {
          inp.focus();
          inp.select && inp.select();
          return true;
        }
      }
    }
    return false;
  }

  function kbd(combo) {
    return combo
      .split("+")
      .map(function (k) {
        var key = k.trim();
        var l = key.toLowerCase();
        var label =
          l === "mod" ? (IS_MAC ? "⌘" : "Ctrl") :
          l === "meta" ? (IS_MAC ? "⌘" : "Meta") :
          l === "ctrl" ? "Ctrl" :
          l === "alt" ? (IS_MAC ? "⌥" : "Alt") :
          l === "shift" ? "⇧" :
          key.length === 1 ? key.toUpperCase() : key;
        return "<kbd>" + label.replace(/</g, "&lt;") + "</kbd>";
      })
      .join(" ");
  }

  function showHelp(cfg) {
    var existing = document.getElementById("sc-shortcuts-help");
    if (existing) {
      bootstrap.Modal.getOrCreateInstance(existing).toggle();
      return;
    }
    var rows = [];
    if (cfg.collapse || document.getElementById("sc-sidebar"))
      rows.push([IS_MAC ? "Mod+B" : "Ctrl+B", "Toggle sidebar"]);
    if (cfg.mode) rows.push(["D", "Toggle light / dark"]);
    rows.push(["/", "Focus search"]);
    rows.push(["?", "Show keyboard shortcuts"]);
    var esc = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    };
    var list = function (items) {
      return items
        .map(function (r) {
          return '<li class="sc-shortcut-row"><span>' + esc(r[1]) + "</span><span>" + kbd(r[0]) + "</span></li>";
        })
        .join("");
    };
    var menuRows = (cfg.menu || []).map(function (m) {
      return [m.shortcut, m.label];
    });
    var html =
      '<div class="modal fade" id="sc-shortcuts-help" tabindex="-1" aria-labelledby="sc-shortcuts-title" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
      '<div class="modal-header"><h5 class="modal-title" id="sc-shortcuts-title">Keyboard shortcuts</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body"><ul class="sc-shortcut-list">' + list(rows) + "</ul>" +
      (menuRows.length
        ? '<div class="sc-shortcut-heading">Menu</div><ul class="sc-shortcut-list">' + list(menuRows) + "</ul>"
        : "") +
      "</div></div></div></div>";
    document.body.insertAdjacentHTML("beforeend", html);
    bootstrap.Modal.getOrCreateInstance(document.getElementById("sc-shortcuts-help")).show();
  }

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.isComposing) return;
    var cfg = shortcutConfig();
    if (!cfg) return;
    if (matchesMenuShortcut(e)) return; // core handles menu item shortcuts
    var key = (e.key || "").toLowerCase();

    // ⌘B or Ctrl+B: toggle sidebar (works in plain inputs too, like VS Code / shadcn).
    // Both are accepted everywhere, except Ctrl+B in a Mac text field, where it is
    // the system "move cursor back" key.
    if ((e.metaKey !== e.ctrlKey) && !e.altKey && !e.shiftKey && key === "b") {
      if (inEditor(e.target)) return;
      if (IS_MAC && e.ctrlKey && isTyping(e.target)) return;
      if (toggleSidebar()) e.preventDefault();
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
    if (document.querySelector(".modal.show:not(#sc-shortcuts-help)")) return;

    if (key === "d" && !e.shiftKey && cfg.mode && window.scToggleMode) {
      e.preventDefault();
      window.scToggleMode();
    } else if (key === "/" && !e.shiftKey) {
      if (focusSearch()) e.preventDefault();
    } else if (e.key === "?" && window.bootstrap) {
      e.preventDefault();
      showHelp(cfg);
    }
  });

  /* ------------------------------------------------------------ trace
   * Workflow run page (/actions/run/:id): core lists the step traces as an
   * accordion ("1: step_name", details in a table). Rebuild it as a shadcn
   * Trace: one line per step with a status icon, the step name and its
   * duration; clicking a line shows its details. Core's markup is the only
   * input, so nothing changes if it is missing or different.
   */
  function rowsOf(table) {
    var out = {};
    if (!table) return out;
    var trs = table.querySelectorAll(":scope > tbody > tr");
    for (var k = 0; k < trs.length; k++) {
      var th = trs[k].querySelector("th"),
        td = trs[k].querySelector("td");
      if (th && td) out[th.textContent.trim()] = td;
    }
    return out;
  }

  function duration(td) {
    var v = parseFloat(td ? td.textContent : "");
    if (isNaN(v)) return "";
    return v < 1 ? Math.max(1, Math.round(v * 1000)) + " ms" : v.toFixed(v < 10 ? 2 : 1) + " s";
  }

  var traceUid = 0;
  function traceLine(o) {
    // o: {status, icon, title, desc, details (node|null)}
    var li = document.createElement("li");
    li.className = "sc-trace-item";
    li.setAttribute("data-status", o.status);
    var line = document.createElement(o.details ? "button" : "div");
    line.className = "sc-trace-line";
    if (o.details) {
      line.type = "button";
      line.setAttribute("aria-expanded", "false");
    }
    var icon = document.createElement("span");
    icon.className = "sc-trace-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = '<i class="fas ' + o.icon + '"></i>';
    var title = document.createElement("span");
    title.className = "sc-trace-title";
    title.textContent = o.title;
    title.title = o.title;
    line.appendChild(icon);
    line.appendChild(title);
    if (o.desc) {
      var desc = document.createElement("span");
      desc.className = "sc-trace-desc";
      desc.textContent = o.desc;
      line.appendChild(desc);
    }
    li.appendChild(line);
    if (o.details) {
      var chev = document.createElement("i");
      chev.className = "fas fa-chevron-down sc-trace-chevron";
      chev.setAttribute("aria-hidden", "true");
      line.appendChild(chev);
      var content = document.createElement("div");
      content.className = "sc-trace-content";
      content.id = "sc-trace-" + ++traceUid;
      content.hidden = true;
      content.appendChild(o.details);
      line.setAttribute("aria-controls", content.id);
      line.addEventListener("click", function () {
        var open = line.getAttribute("aria-expanded") !== "true";
        line.setAttribute("aria-expanded", open ? "true" : "false");
        content.hidden = !open;
      });
      li.appendChild(content);
    }
    return li;
  }

  function buildTraces() {
    var accordions = document.querySelectorAll(".accordion");
    for (var a = 0; a < accordions.length; a++) {
      var acc = accordions[a];
      var items = acc.querySelectorAll(':scope > .accordion-item');
      if (!items.length || !acc.querySelector('.accordion-button[data-bs-target^="#trtab"]')) continue;
      var list = document.createElement("ol");
      list.className = "sc-trace";
      for (var k = 0; k < items.length; k++) {
        var btn = items[k].querySelector(".accordion-button");
        var name = (btn ? btn.textContent : "").trim().replace(/^\d+:\s*/, "");
        var rows = rowsOf(items[k].querySelector(".accordion-body > table"));
        var st = (rows.Status ? rows.Status.textContent : "").trim();
        var waiting = st === "Waiting";
        var failed = st === "Error";
        // details: everything but the status, and the context last
        var dl = document.createElement("dl");
        dl.className = "sc-trace-props";
        ["Started at", "Run by user", "Waiting for"].forEach(function (key) {
          if (!rows[key] || !rows[key].textContent.trim()) return;
          var dt = document.createElement("dt");
          dt.textContent = key;
          var dd = document.createElement("dd");
          dd.textContent = rows[key].textContent.trim();
          dl.appendChild(dt);
          dl.appendChild(dd);
        });
        var details = document.createElement("div");
        details.appendChild(dl);
        var pre = rows.Context && rows.Context.querySelector("pre");
        if (pre) details.appendChild(pre.cloneNode(true));
        list.appendChild(
          traceLine({
            status: failed ? "error" : waiting ? "pending" : "done",
            icon: failed ? "fa-exclamation-circle" : waiting ? "fa-pause-circle" : "fa-check-circle",
            title: waiting ? "Waiting at " + name : name,
            desc: duration(rows.Elapsed),
            details: details,
          })
        );
      }
      // a failed run: the failing step itself has no trace, the run has the error
      var runRows = rowsOf(document.querySelector("#page-inner-content .card table"));
      var runStatus = runRows.Status ? runRows.Status.textContent.trim() : "";
      if (runStatus === "Error") {
        var msg = runRows["Error message"] ? runRows["Error message"].textContent.trim() : "";
        var errDetails = null;
        if (msg) {
          errDetails = document.createElement("pre");
          errDetails.textContent = msg;
        }
        list.appendChild(
          traceLine({ status: "error", icon: "fa-exclamation-circle", title: "Failed" + (msg ? ": " + msg : ""), desc: "", details: errDetails })
        );
      } else if (runStatus === "Finished") {
        list.appendChild(traceLine({ status: "done", icon: "fa-flag-checkered", title: "Finished", desc: "", details: null }));
      }
      acc.replaceWith(list);
    }
  }

  /* ------------------------------------------------------------ alert dialog
   * shadcn's AlertDialog in place of the browser's confirm() / alert().
   * Core calls confirm() synchronously from inline handlers, e.g.
   *   onclick="return confirm('Are you sure?')"
   * so the first call answers "no" and opens the dialog; "Continue" replays
   * the same click (or form submit) with confirm() answering "yes" once.
   * A confirm() that is not caused by a click or submit (e.g. in an ajax
   * callback) cannot be replayed and keeps the native dialog.
   */
  var nativeConfirm = window.confirm.bind(window);
  var approved = null; // message whose replay may pass
  var lastAction = null; // {el, kind, submitter, t}

  document.addEventListener(
    "click",
    function (e) {
      lastAction = { el: e.target, kind: "click", t: Date.now() };
    },
    true
  );
  document.addEventListener(
    "submit",
    function (e) {
      lastAction = { el: e.target, kind: "submit", submitter: e.submitter, t: Date.now() };
    },
    true
  );

  function dialogEl() {
    var d = document.getElementById("sc-alert-dialog");
    if (d) return d;
    document.body.insertAdjacentHTML(
      "beforeend",
      '<dialog id="sc-alert-dialog" class="sc-alert-dialog" aria-labelledby="sc-alert-title" aria-describedby="sc-alert-desc">' +
        '<form method="dialog" class="sc-alert-dialog-inner">' +
        '<h2 id="sc-alert-title" class="sc-alert-title"></h2>' +
        '<p id="sc-alert-desc" class="sc-alert-desc"></p>' +
        '<div class="sc-alert-footer">' +
        '<button value="cancel" class="btn btn-outline-secondary sc-alert-cancel">Cancel</button>' +
        '<button value="ok" class="btn btn-primary sc-alert-ok">Continue</button>' +
        "</div></form></dialog>"
    );
    d = document.getElementById("sc-alert-dialog");
    // click on the backdrop = cancel
    d.addEventListener("click", function (e) {
      if (e.target === d) d.close("cancel");
    });
    return d;
  }

  // opens the dialog; calls done(true|false)
  function openDialog(msg, isAlert, done, fromEl) {
    var d = dialogEl();
    if (d.open) d.close("cancel");
    var text = String(msg == null ? "" : msg);
    var short = text.length <= 80 && text.indexOf("\n") < 0;
    d.querySelector(".sc-alert-title").textContent = isAlert
      ? short ? text : "Notice"
      : short ? text : "Are you sure?";
    var desc = d.querySelector(".sc-alert-desc");
    desc.textContent = short ? "" : text;
    desc.hidden = short;
    d.querySelector(".sc-alert-cancel").hidden = !!isAlert;
    var ok = d.querySelector(".sc-alert-ok");
    ok.textContent = isAlert ? "OK" : "Continue";
    // destructive wording gets the destructive button
    var dangerous =
      /delet|remov|destroy|lost|reset/i.test(text) ||
      !!(fromEl && fromEl.closest && fromEl.closest(".btn-danger, .text-danger, .dropdown-item-danger, [class*='delete']"));
    ok.classList.toggle("btn-danger", !isAlert && dangerous);
    ok.classList.toggle("btn-primary", !ok.classList.contains("btn-danger"));
    d.returnValue = "";
    d.onclose = function () {
      d.onclose = null;
      done(d.returnValue === "ok");
    };
    d.showModal();
    ok.focus();
  }

  function replay(action) {
    if (action.kind === "submit") {
      var f = action.el;
      if (f.requestSubmit) f.requestSubmit(action.submitter && action.submitter.form === f ? action.submitter : undefined);
      else f.submit();
    } else if (action.el && action.el.isConnected) {
      // the element that was clicked (a link, button, checkbox…)
      var el = action.el.closest("a, button, input, label, [onclick]") || action.el;
      el.click();
    }
  }

  window.confirm = function (msg) {
    var text = String(msg == null ? "" : msg);
    if (approved !== null && approved === text) {
      approved = null;
      return true;
    }
    var action = lastAction && Date.now() - lastAction.t < 1000 ? lastAction : null;
    if (!action || !document.body) return nativeConfirm(msg);
    lastAction = null;
    openDialog(text, false, function (yes) {
      if (!yes) return;
      approved = text;
      replay(action);
      // nothing asked again (e.g. the handler changed): drop the approval
      setTimeout(function () {
        approved = null;
      }, 0);
    }, action.el);
    return false;
  };

  // alert() does not block here; its return value is never used
  window.alert = function (msg) {
    if (!document.body) return;
    openDialog(msg, true, function () {});
  };

  /* ------------------------------------------------------------ monaco
   * Monaco themes are global, and every editor created without a theme (e.g.
   * the builder's formula inputs) resets it to the light "vs". Keep a theme
   * that matches the page: in dark mode the editor background is the page's.
   */
  function rgbToHex(c) {
    var m = String(c).match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return null;
    return (
      "#" +
      m.slice(0, 3)
        .map(function (x) {
          return Math.round(+x).toString(16).padStart(2, "0");
        })
        .join("")
    );
  }
  var monacoHooked = false;
  function applyMonacoTheme() {
    var mo = window.monaco;
    if (!mo || !mo.editor || !mo.editor.defineTheme) return false;
    var dark = currentMode() === "dark";
    var bg = rgbToHex(getComputedStyle(document.body).backgroundColor);
    try {
      if (dark && bg) {
        mo.editor.defineTheme("sc-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": bg,
            "editorGutter.background": bg,
            "minimap.background": bg,
            "editorStickyScroll.background": bg,
          },
        });
        mo.editor.setTheme("sc-dark");
      } else mo.editor.setTheme("vs");
    } catch (e) {}
    if (!monacoHooked && mo.editor.onDidCreateEditor) {
      monacoHooked = true;
      // after the new editor applied its own theme option
      mo.editor.onDidCreateEditor(function () {
        setTimeout(applyMonacoTheme, 0);
      });
    }
    return true;
  }
  function watchMonaco() {
    if (applyMonacoTheme()) return;
    // monaco loads lazily (builder, code fields): look again when one appears
    var mo = new MutationObserver(function () {
      if (document.querySelector(".monaco-editor") && applyMonacoTheme()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  // follow the light/dark toggle
  new MutationObserver(function () {
    if (monacoHooked) applyMonacoTheme();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });

  // transparent fixed top bar: frosted once the page scrolls under it
  (function () {
    var html = document.documentElement;
    if (!html.classList.contains("sc-topbar-transparent")) return;
    var on = null;
    var update = function () {
      var s = window.scrollY > 4;
      if (s !== on) html.classList.toggle("sc-scrolled", (on = s));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  })();

  // theme settings (site or personal): the Mode shown there is what gets
  // saved, so a header-toggle choice in this browser must not hide it
  function watchModeSetting() {
    var sel = document.querySelector('form select[name="mode"]');
    if (!sel || !sel.querySelector('option[value="auto"]') || !window.scClearModeOverride) return;
    var form = sel.form;
    var note = null;
    var override = window.scModeOverride && window.scModeOverride();
    if (override) {
      note = document.createElement("div");
      note.className = "form-text sc-mode-note";
      note.textContent =
        "This browser is showing " +
        (override === "dark" ? "Dark" : "Light") +
        " mode because of the header toggle. Saving resets it to the Mode chosen here.";
      sel.insertAdjacentElement("afterend", note);
    }
    var reset = function () {
      window.scClearModeOverride();
      if (note) {
        note.remove();
        note = null;
      }
    };
    sel.addEventListener("change", function () {
      reset();
      var v = sel.value;
      if (v === "auto")
        v = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      if (v === "light" || v === "dark") applyMode(v);
      window._sc_shadcn_auto = sel.value === "auto";
    });
    if (form) form.addEventListener("submit", reset);
  }

  // topbar: move the items that don't fit into the "More" dropdown
  function menuEntriesFor(el) {
    var lis = [];
    var li = function (child) {
      var l = document.createElement("li");
      l.appendChild(child);
      lis.push(l);
    };
    var header = function (label) {
      var h = document.createElement("span");
      h.className = "dropdown-header";
      h.textContent = label;
      li(h);
    };
    if (el.classList.contains("sc-header-sep")) {
      var hr = document.createElement("hr");
      hr.className = "dropdown-divider";
      li(hr);
    } else if (el.classList.contains("sc-topnav-label")) {
      header(el.textContent.trim());
    } else if (el.classList.contains("dropdown")) {
      var toggle = el.querySelector("[data-bs-toggle=dropdown]");
      // the whole dropdown becomes a sub-menu of "More"
      var sub = document.createElement("li");
      sub.className = "sc-submenu";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dropdown-item sc-submenu-toggle" + (el.querySelector(".active") ? " active" : "");
      btn.setAttribute("aria-haspopup", "menu");
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = toggle ? toggle.innerHTML : "";
      btn.querySelectorAll("i").forEach(function (ic) {
        ic.classList.remove("me-1");
        ic.classList.add("me-2", "text-body-secondary");
      });
      var src = el.querySelector(":scope > .dropdown-menu");
      var ul = src ? src.cloneNode(true) : document.createElement("ul");
      ul.className = "dropdown-menu sc-submenu-menu";
      sub.appendChild(btn);
      sub.appendChild(ul);
      lis.push(sub);
    } else if (el.tagName === "A") {
      var a = el.cloneNode(true);
      a.className = "dropdown-item" + (el.classList.contains("active") ? " active" : "");
      a.removeAttribute("data-bs-toggle");
      a.removeAttribute("data-bs-title");
      a.removeAttribute("title");
      a.querySelectorAll("i").forEach(function (ic) {
        ic.classList.remove("me-1");
        ic.classList.add("me-2", "text-body-secondary");
      });
      li(a);
    } else {
      var wrap = document.createElement("div");
      wrap.className = "px-2 py-1";
      wrap.appendChild(el.cloneNode(true));
      li(wrap);
    }
    return lis;
  }
  function fitTopnav() {
    var nav = document.querySelector(".sc-topnav");
    var more = nav && nav.querySelector(":scope > .sc-topnav-more");
    if (!more || !nav.offsetParent) return;
    var items = Array.prototype.filter.call(nav.children, function (c) {
      return c !== more;
    });
    items.forEach(function (c) {
      c.classList.remove("sc-topnav-hidden");
    });
    more.hidden = true;
    if (nav.scrollWidth <= nav.clientWidth + 1) return;
    more.hidden = false;
    var cut = items.length;
    while (cut > 0 && nav.scrollWidth > nav.clientWidth + 1) {
      cut--;
      items[cut].classList.add("sc-topnav-hidden");
    }
    // a separator shouldn't be the last visible item
    while (cut > 0 && items[cut - 1].classList.contains("sc-header-sep")) {
      cut--;
      items[cut].classList.add("sc-topnav-hidden");
    }
    var menu = more.querySelector(".dropdown-menu");
    menu.innerHTML = "";
    var active = false;
    items.slice(cut).forEach(function (el) {
      if (el.matches(".active, :has(.active)")) active = true;
      menuEntriesFor(el).forEach(function (l) {
        menu.appendChild(l);
      });
    });
    while (menu.firstChild && menu.firstChild.querySelector(".dropdown-divider"))
      menu.removeChild(menu.firstChild);
    more.querySelector(".sc-topnav-link").classList.toggle("active", active);
  }
  function watchTopnav() {
    var nav = document.querySelector(".sc-topnav");
    if (!nav) return;
    fitTopnav();
    var raf = 0;
    var refit = function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fitTopnav);
    };
    if (window.ResizeObserver) new ResizeObserver(refit).observe(nav.parentElement);
    else window.addEventListener("resize", refit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
  }

  // flyout sub-menus inside dropdowns
  function subMenuOf(li) {
    return li.querySelector(":scope > .sc-submenu-menu");
  }
  function closeSub(li) {
    li.querySelectorAll(".sc-submenu-menu.show").forEach(function (m) {
      m.classList.remove("show");
    });
    li.querySelectorAll(".sc-submenu-toggle").forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
    });
    var m = subMenuOf(li);
    if (m) m.classList.remove("show");
  }
  function closeSiblings(li) {
    Array.prototype.forEach.call(li.parentElement.children, function (x) {
      if (x !== li && x.classList.contains("sc-submenu")) closeSub(x);
    });
  }
  function openSub(li) {
    var menu = subMenuOf(li);
    if (!menu) return;
    closeSiblings(li);
    li.classList.remove("sc-submenu-flip", "sc-submenu-inline");
    menu.style.top = "";
    menu.classList.add("show");
    li.querySelector(":scope > .sc-submenu-toggle").setAttribute("aria-expanded", "true");
    var gap = 8;
    var out = function () {
      var r = menu.getBoundingClientRect();
      return r.left < gap || r.right > window.innerWidth - gap;
    };
    // keep going the way the parent sub-menu went, turn back only when
    // there is no room
    var parent = li.parentElement.closest(".sc-submenu");
    var flip = !!(parent && parent.classList.contains("sc-submenu-flip"));
    li.classList.toggle("sc-submenu-flip", flip);
    if (out()) {
      li.classList.toggle("sc-submenu-flip", !flip);
      if (out()) {
        li.classList.remove("sc-submenu-flip");
        li.classList.add("sc-submenu-inline");
        return;
      }
    }
    // keep it on screen vertically
    var r = menu.getBoundingClientRect();
    var over = r.bottom - (window.innerHeight - gap);
    if (over > 0)
      menu.style.top = menu.offsetTop - Math.min(over, r.top - gap) + "px";
  }
  function subItems(menu) {
    return Array.prototype.map
      .call(menu.children, function (l) {
        return l.querySelector(":scope > .dropdown-item:not(.disabled):not(:disabled)");
      })
      .filter(Boolean);
  }
  function isRtl(el) {
    return getComputedStyle(el).direction === "rtl";
  }
  document.addEventListener(
    "click",
    function (e) {
      var t = e.target.closest && e.target.closest(".sc-submenu-toggle");
      if (!t) return;
      // keep the parent dropdown open (Bootstrap closes it on clicks inside)
      e.preventDefault();
      e.stopPropagation();
      var li = t.parentElement;
      if (subMenuOf(li).classList.contains("show") && e.detail > 0) closeSub(li);
      else {
        openSub(li);
        if (e.detail === 0) {
          var first = subItems(subMenuOf(li))[0];
          if (first) first.focus();
        }
      }
    },
    true
  );
  var hoverTimer = 0;
  document.addEventListener("mouseover", function (e) {
    if (!window.matchMedia("(hover: hover)").matches) return;
    var li = e.target.closest && e.target.closest(".dropdown-menu > li");
    if (!li) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function () {
      if (li.classList.contains("sc-submenu")) {
        if (!subMenuOf(li).classList.contains("show")) openSub(li);
      } else closeSiblings(li);
    }, 90);
  });
  document.addEventListener(
    "keydown",
    function (e) {
      var t = e.target;
      if (!t.closest) return;
      var rtl = isRtl(t);
      var openKey = rtl ? "ArrowLeft" : "ArrowRight";
      var closeKey = rtl ? "ArrowRight" : "ArrowLeft";
      if (t.classList.contains("sc-submenu-toggle") && e.key === openKey) {
        e.preventDefault();
        e.stopPropagation();
        openSub(t.parentElement);
        var first = subItems(subMenuOf(t.parentElement))[0];
        if (first) first.focus();
        return;
      }
      var menu = t.closest(".sc-submenu-menu.show");
      if (!menu) return;
      if (e.key === closeKey || e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        var li = menu.parentElement;
        closeSub(li);
        li.querySelector(":scope > .sc-submenu-toggle").focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        // move within this sub-menu only
        e.preventDefault();
        e.stopPropagation();
        var items = subItems(menu);
        var ix = items.indexOf(t.closest(".dropdown-item"));
        var next = items[(ix + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
        if (next) next.focus();
      }
    },
    true
  );
  document.addEventListener("hide.bs.dropdown", function (e) {
    var dd = e.target.closest(".dropdown, .dropup, .dropstart, .dropend") || e.target.parentElement;
    if (dd)
      dd.querySelectorAll(".sc-submenu").forEach(closeSub);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchTopnav);
    document.addEventListener("DOMContentLoaded", watchModeSetting);
    document.addEventListener("DOMContentLoaded", onReady);
    document.addEventListener("DOMContentLoaded", buildTraces);
    document.addEventListener("DOMContentLoaded", watchMonaco);
  } else {
    watchTopnav();
    watchModeSetting();
    onReady();
    buildTraces();
    watchMonaco();
  }
})();
