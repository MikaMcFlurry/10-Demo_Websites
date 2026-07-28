(() => {
  "use strict";

  const one = (selector, scope = document) => scope.querySelector(selector);
  const all = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function readSetting(key) {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch (_) {
      return false;
    }
  }

  function writeSetting(key, active) {
    try {
      sessionStorage.setItem(key, active ? "1" : "0");
    } catch (_) {
      // The control remains active for the current page.
    }
  }

  const viewSettings = [
    { key: "fokus40-large-type", selector: "[data-large-type]", className: "large-type" },
    { key: "fokus40-high-contrast", selector: "[data-high-contrast]", className: "high-contrast" }
  ];

  viewSettings.forEach((setting) => {
    const active = readSetting(setting.key);
    document.body.classList.toggle(setting.className, active);
    all(setting.selector).forEach((button) => {
      button.setAttribute("aria-pressed", String(active));
      button.addEventListener("click", () => {
        const next = !document.body.classList.contains(setting.className);
        document.body.classList.toggle(setting.className, next);
        all(setting.selector).forEach((peer) => peer.setAttribute("aria-pressed", String(next)));
        writeSetting(setting.key, next);
      });
    });
  });

  const menuButton = one("[data-menu-toggle]");
  const menu = one("[data-site-nav]");
  if (menuButton && menu) {
    const media = window.matchMedia("(max-width: 760px)");
    const syncMenu = () => {
      if (!media.matches) {
        menu.hidden = false;
        menuButton.setAttribute("aria-expanded", "true");
      } else if (menuButton.dataset.touched !== "true") {
        menu.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
      }
    };

    menuButton.addEventListener("click", () => {
      menuButton.dataset.touched = "true";
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menu.hidden = expanded;
      menuButton.setAttribute("aria-expanded", String(!expanded));
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key !== "Escape"
        || !media.matches
        || menuButton.getAttribute("aria-expanded") !== "true"
      ) {
        return;
      }
      menu.hidden = true;
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.focus();
    });
    media.addEventListener("change", syncMenu);
    syncMenu();
  }

  const focusDescriptions = [
    { max: 15, text: "stark unscharf" },
    { max: 35, text: "deutlich unscharf" },
    { max: 55, text: "weich" },
    { max: 75, text: "fast klar" },
    { max: 100, text: "klar" }
  ];

  all("[data-focus-slider]").forEach((slider) => {
    const scope = slider.closest("[data-focus-scope]") || document;
    const status = one("[data-focus-status]", scope);
    const visual = one("[data-focus-visual]", scope);

    const updateFocus = () => {
      const value = Number(slider.value);
      const blur = Math.max(0, (100 - value) / 13);
      const state = focusDescriptions.find((item) => value <= item.max) || focusDescriptions.at(-1);
      if (visual) visual.style.setProperty("--blur-amount", `${blur.toFixed(2)}px`);
      if (status) status.textContent = `${state.text} · ${value} von 100`;
      slider.setAttribute("aria-valuetext", `${state.text}, ${value} von 100`);
    };

    slider.addEventListener("input", updateFocus);
    updateFocus();
  });

  all("[data-lens-stage]").forEach((stage) => {
    const scope = stage.closest("[data-lens-lab]") || document;
    const result = one("[data-lens-result]", scope);
    all("[data-lens-choice]", scope).forEach((button) => {
      button.addEventListener("click", () => {
        const choice = button.dataset.lensChoice;
        stage.dataset.choice = choice;
        all("[data-lens-choice]", scope).forEach((peer) => {
          peer.setAttribute("aria-pressed", String(peer === button));
        });
        if (result) {
          result.textContent = choice === "a"
            ? "Glas A: kühlerer Eindruck, harte Kanten, neutraler Weißpunkt."
            : "Glas B: wärmerer Eindruck, weichere Kanten, leicht gedämpftes Blau.";
        }
      });
    });
  });

  all("[data-triage]").forEach((form) => {
    const steps = all("[data-triage-step]", form);
    const message = one("[data-triage-message]", form);
    let current = 0;

    function showStep(index) {
      current = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach((step, stepIndex) => {
        step.hidden = stepIndex !== current;
      });
      one("input", steps[current])?.focus();
    }

    all("[data-triage-next]", form).forEach((button) => {
      button.addEventListener("click", () => {
        const selected = one("input:checked", steps[current]);
        if (!selected) {
          message.textContent = "Bitte zuerst eine Antwort auswählen.";
          message.focus?.();
          return;
        }
        message.textContent = "";
        showStep(current + 1);
      });
    });

    all("[data-triage-back]", form).forEach((button) => {
      button.addEventListener("click", () => {
        message.textContent = "";
        showStep(current - 1);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const timing = one("input[name='timing']:checked", form)?.value;
      const reason = one("input[name='reason']:checked", form)?.value;
      if (!timing || !reason) {
        message.textContent = "Bitte beide Fragen beantworten.";
        return;
      }

      if (timing === "sudden") {
        message.innerHTML = "<strong>Bitte nicht auf einen Ateliertermin warten.</strong> Plötzliche Sehverschlechterung, Lichtblitze, ein Schatten im Sichtfeld oder starke Schmerzen sollten zeitnah ärztlich abgeklärt werden. Im Notfall 112 wählen.";
      } else if (reason === "contact") {
        message.innerHTML = "<strong>Vorschlag: Kontaktlinsen-Beratung, 60 Minuten.</strong> Sie umfasst im fiktiven Ablauf Anamnese, Messung, Probetragen und Handhabung. Keine Buchung wird übertragen.";
      } else if (reason === "new") {
        message.innerHTML = "<strong>Vorschlag: Sehprofil &amp; Fassungsatelier, 75 Minuten.</strong> Genug Zeit für Messung, Bedarfsgespräch und eine ruhige Auswahl. Keine Buchung wird übertragen.";
      } else {
        message.innerHTML = "<strong>Vorschlag: Sehprofil, 45 Minuten.</strong> Für eine reguläre Kontrolle ohne akute Beschwerden. Diese Orientierung ersetzt keine medizinische Einschätzung.";
      }
    });
  });
})();
