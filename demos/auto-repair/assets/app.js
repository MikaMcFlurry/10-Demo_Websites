/* === Shared Demo JS — Mobile menu, Cookie banner, FAQ accordion, Legal modals === */
(function () {
    "use strict";

    /* --- Mobile Nav Toggle --- */
    var toggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (toggle && navLinks) {
        toggle.addEventListener("click", function () {
            var expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            navLinks.classList.toggle("open");
        });
        document.addEventListener("click", function (e) {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* --- Cookie Banner --- */
    var banner = document.querySelector(".cookie-banner");
    var acceptBtn = document.querySelector(".cookie-accept");
    var declineBtn = document.querySelector(".cookie-decline");

    if (banner) {
        if (!localStorage.getItem("cookie-consent")) {
            banner.classList.add("show");
        }
        if (acceptBtn) {
            acceptBtn.addEventListener("click", function () {
                localStorage.setItem("cookie-consent", "accepted");
                banner.classList.remove("show");
            });
        }
        if (declineBtn) {
            declineBtn.addEventListener("click", function () {
                localStorage.setItem("cookie-consent", "declined");
                banner.classList.remove("show");
            });
        }
    }

    /* --- FAQ Accordion --- */
    var faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
        var question = item.querySelector(".faq-question");
        var answer = item.querySelector(".faq-answer");
        if (!question || !answer) return;

        question.addEventListener("click", function () {
            var isOpen = item.classList.contains("open");
            faqItems.forEach(function (fi) {
                fi.classList.remove("open");
                var a = fi.querySelector(".faq-answer");
                if (a) a.style.maxHeight = null;
                var q = fi.querySelector(".faq-question");
                if (q) q.setAttribute("aria-expanded", "false");
            });
            if (!isOpen) {
                item.classList.add("open");
                answer.style.maxHeight = answer.scrollHeight + "px";
                question.setAttribute("aria-expanded", "true");
            }
        });
    });

    /* --- Legal Modals --- */
    document.querySelectorAll("[data-legal]").forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            var target = document.getElementById(link.getAttribute("data-legal"));
            if (target) {
                target.classList.add("open");
                document.body.style.overflow = "hidden";
                var closeBtn = target.querySelector(".legal-close");
                if (closeBtn) closeBtn.focus();
            }
        });
    });
    document.querySelectorAll(".legal-close").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var section = btn.closest(".legal-section");
            if (section) {
                section.classList.remove("open");
                document.body.style.overflow = "";
            }
        });
    });
    document.querySelectorAll(".legal-section").forEach(function (section) {
        section.addEventListener("click", function (e) {
            if (e.target === section) {
                section.classList.remove("open");
                document.body.style.overflow = "";
            }
        });
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            document.querySelectorAll(".legal-section.open").forEach(function (s) {
                s.classList.remove("open");
                document.body.style.overflow = "";
            });
        }
    });

    /* --- Contact form mailto fallback --- */
    var form = document.querySelector(".contact-form");
    if (form && !form.getAttribute("action")) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var fd = new FormData(form);
            var name = fd.get("name") || "";
            var email = fd.get("email") || "";
            var message = fd.get("message") || "";
            var subject = fd.get("subject") || "Kontaktanfrage";
            var mailto = form.getAttribute("data-mailto") || "info@example.com";
            var body = "Name: " + name + "%0D%0AE-Mail: " + email + "%0D%0A%0D%0A" + encodeURIComponent(message);
            window.location.href = "mailto:" + mailto + "?subject=" + encodeURIComponent(subject) + "&body=" + body;
        });
    }
})();
