(() => {
  "use strict";

  const one = (selector, scope = document) => scope.querySelector(selector);
  const all = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const pad = (number) => String(number).padStart(2, "0");

  function nowPlus(minutes = 0) {
    return new Date(Date.now() + minutes * 60000);
  }

  function formatTime(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function updateLocalTime() {
    const now = new Date();
    all("[data-local-clock]").forEach((clock) => {
      clock.textContent = `${formatTime(now)}:${pad(now.getSeconds())}`;
      clock.setAttribute("datetime", now.toISOString());
    });

    all("[data-departure-offset]").forEach((node) => {
      const offset = Number(node.dataset.departureOffset || 0);
      const departure = nowPlus(offset);
      node.textContent = formatTime(departure);
      node.setAttribute("datetime", departure.toISOString());
    });

    all("[data-countdown]").forEach((node) => {
      const offset = Number(node.dataset.countdown || 0);
      node.textContent = offset <= 1 ? "gleich" : `in ${offset} min`;
    });

    all("[data-planner-now]").forEach((node) => {
      node.textContent = `Abfahrt ab ${formatTime(now)}`;
    });
  }

  updateLocalTime();
  window.setInterval(updateLocalTime, 1000);

  const planner = one("[data-journey-planner]");
  if (planner) {
    const from = one("[name='from']", planner);
    const to = one("[name='to']", planner);
    const result = one("[data-route-result]", planner);
    const durations = {
      "Werfttor–Hauptbahnhof": 11,
      "Werfttor–Markthalle": 7,
      "Werfttor–Seegarten": 16,
      "Hauptbahnhof–Markthalle": 5,
      "Hauptbahnhof–Seegarten": 9,
      "Markthalle–Seegarten": 12
    };

    one("[data-swap]", planner)?.addEventListener("click", () => {
      const previous = from.value;
      from.value = to.value;
      to.value = previous;
      from.focus();
    });

    planner.addEventListener("submit", (event) => {
      event.preventDefault();
      if (from.value === to.value) {
        result.innerHTML = "<strong>Start und Ziel sind gleich.</strong><span>Bitte zwei verschiedene Haltestellen wählen.</span>";
        return;
      }

      const key = [from.value, to.value].sort().join("–");
      const duration = durations[key] || 14;
      const departure = nowPlus(3);
      const arrival = nowPlus(3 + duration);
      const line = duration < 8 ? "T3" : duration < 12 ? "U1" : "U2";
      result.innerHTML =
        `<strong>${from.value} → ${to.value}</strong>` +
        `<span>${formatTime(departure)} ab · ${line} · ${duration} Min. · ${formatTime(arrival)} an</span>`;
    });
  }

  function activateLine(line) {
    all("[data-line-filter]").forEach((button) => {
      const active = button.dataset.lineFilter === line;
      button.setAttribute("aria-pressed", String(active));
    });

    all("[data-map-line]").forEach((route) => {
      const active = line === "all" || route.dataset.mapLine === line;
      route.classList.toggle("is-muted", !active);
      route.classList.toggle("is-active", active && line !== "all");
    });

    all("[data-departure-line]").forEach((departure) => {
      departure.hidden = line !== "all" && departure.dataset.departureLine !== line;
    });
  }

  all("[data-line-filter]").forEach((button) => {
    button.addEventListener("click", () => activateLine(button.dataset.lineFilter));
  });

  const stopFilter = one("[data-stop-filter]");
  if (stopFilter) {
    stopFilter.addEventListener("change", () => {
      const selected = stopFilter.value;
      all("[data-stop]").forEach((departure) => {
        departure.hidden = selected !== "all" && departure.dataset.stop !== selected;
      });
      const status = one("[data-filter-status]");
      if (status) {
        const visible = all("[data-stop]:not([hidden])").length;
        status.textContent = `${visible} Abfahrten für ${selected === "all" ? "alle Haltestellen" : selected}`;
      }
    });
  }

  const alert = one("[data-service-alert]");
  if (alert) {
    try {
      if (sessionStorage.getItem("nordhafen-alert-dismissed") === "1") {
        alert.hidden = true;
      }
    } catch (_) {
      // The alert remains visible when storage is unavailable.
    }

    one("[data-dismiss-alert]", alert)?.addEventListener("click", () => {
      alert.hidden = true;
      try {
        sessionStorage.setItem("nordhafen-alert-dismissed", "1");
      } catch (_) {
        // Dismissal still works for the current page.
      }
    });
  }

  const switcher = one("[data-mobile-switcher]");
  if (switcher) {
    document.documentElement.classList.add("js");
    const media = window.matchMedia("(max-width: 760px)");
    const buttons = all("[role='tab']", switcher);
    const panels = buttons
      .map((button) => document.getElementById(button.getAttribute("aria-controls")))
      .filter(Boolean);

    function showPanel(id) {
      buttons.forEach((button) => {
        const active = button.getAttribute("aria-controls") === id;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = media.matches && panel.id !== id;
      });
    }

    function syncLayout() {
      if (media.matches) {
        const selected = one("[role='tab'][aria-selected='true']", switcher) || buttons[0];
        showPanel(selected.getAttribute("aria-controls"));
      } else {
        panels.forEach((panel) => {
          panel.hidden = false;
        });
      }
    }

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => showPanel(button.getAttribute("aria-controls")));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = buttons[(index + delta + buttons.length) % buttons.length];
        next.focus();
        showPanel(next.getAttribute("aria-controls"));
      });
    });

    media.addEventListener("change", syncLayout);
    syncLayout();
  }
})();
