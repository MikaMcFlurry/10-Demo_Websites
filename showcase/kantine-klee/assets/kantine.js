(() => {
  "use strict";

  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-navigation]");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      navigation.dataset.open = String(open);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        menuButton.setAttribute("aria-expanded", "false");
        navigation.dataset.open = "false";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menuButton.getAttribute("aria-expanded") !== "true") {
        return;
      }
      menuButton.setAttribute("aria-expanded", "false");
      navigation.dataset.open = "false";
      menuButton.focus();
    });
  }

  const drawer = document.querySelector("[data-reservation-drawer]");
  const drawerTriggers = document.querySelectorAll("[data-open-reservation]");
  const drawerClose = document.querySelector("[data-close-reservation]");
  let opener = null;

  if (drawer) {
    drawerTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        opener = trigger;
        drawer.showModal();
      });
    });

    drawerClose?.addEventListener("click", () => drawer.close());

    drawer.addEventListener("click", (event) => {
      const bounds = drawer.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) drawer.close();
    });

    drawer.addEventListener("close", () => opener?.focus());
  }

  const form = document.querySelector("[data-reservation-form]");
  const formStatus = document.querySelector("[data-form-status]");

  if (form && formStatus) {
    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().slice(0, 10);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        formStatus.dataset.state = "error";
        formStatus.textContent = "Bitte prüfen Sie die markierten Pflichtfelder.";
        form.reportValidity();
        return;
      }

      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      submit.textContent = "Wird notiert …";
      formStatus.dataset.state = "";
      formStatus.textContent = "Die Demo-Anfrage wird vorbereitet.";

      window.setTimeout(() => {
        submit.disabled = false;
        submit.textContent = "Demo-Anfrage notieren";
        formStatus.dataset.state = "success";
        formStatus.textContent =
          "Notiert – nur als Demo. Es wurden keine Daten versendet.";
        form.reset();
      }, 550);
    });
  }

  const filterButtons = [...document.querySelectorAll("[data-menu-filter]")];
  const menuRows = [...document.querySelectorAll("[data-diet]")];
  const filterStatus = document.querySelector("[data-filter-status]");

  if (filterButtons.length && menuRows.length && filterStatus) {
    const applyFilter = (value) => {
      let visible = 0;

      filterButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.menuFilter === value));
      });

      menuRows.forEach((row) => {
        const matches = value === "all" || row.dataset.diet.split(" ").includes(value);
        row.hidden = !matches;
        if (matches) visible += 1;
      });

      const labels = {
        all: "Alle Gerichte",
        vegan: "Vegane Gerichte",
        vegetarian: "Vegetarische Gerichte",
        glutenarm: "Glutenarme Gerichte"
      };
      filterStatus.textContent = `${visible} · ${labels[value]}`;
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => applyFilter(button.dataset.menuFilter));
    });

    applyFilter("all");
  }
})();
