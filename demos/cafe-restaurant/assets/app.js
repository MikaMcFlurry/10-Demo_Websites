/* Café Goldstück — app.js */
(function() {
    'use strict';

    /* Mobile nav toggle */
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.nav-links-row');
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            var open = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open);
        });
        document.addEventListener('click', function(e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* FAQ accordion */
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;
        question.addEventListener('click', function() {
            var isOpen = item.classList.contains('open');
            faqItems.forEach(function(fi) {
                fi.classList.remove('open');
                var a = fi.querySelector('.faq-answer');
                if (a) a.style.maxHeight = null;
                var q = fi.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* Cookie banner */
    var banner = document.querySelector('.cookie-banner');
    if (banner && !localStorage.getItem('cafe-cookie-noted')) {
        banner.classList.add('show');
    }
    var cookieBtn = document.querySelector('.cookie-btn');
    if (cookieBtn) {
        cookieBtn.addEventListener('click', function() {
            banner.classList.remove('show');
            localStorage.setItem('cafe-cookie-noted', '1');
        });
    }

    /* Legal modals */
    document.querySelectorAll('[data-legal]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.getElementById(link.getAttribute('data-legal'));
            if (target) {
                target.classList.add('open');
                document.body.style.overflow = 'hidden';
                var closeBtn = target.querySelector('.legal-close');
                if (closeBtn) closeBtn.focus();
            }
        });
    });
    document.querySelectorAll('.legal-close').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var overlay = btn.closest('.legal-overlay');
            if (overlay) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });
    document.querySelectorAll('.legal-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.legal-overlay.open').forEach(function(o) {
                o.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
    });

    /* Contact form mailto fallback */
    var form = document.querySelector('.contact-form');
    if (form && !form.getAttribute('action')) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var fd = new FormData(form);
            var name = fd.get('name') || '';
            var email = fd.get('email') || '';
            var message = fd.get('message') || '';
            var subject = fd.get('subject') || 'Kontaktanfrage';
            var mailto = form.getAttribute('data-mailto') || 'info@example.com';
            var body = 'Name: ' + name + '%0D%0AE-Mail: ' + email + '%0D%0A%0D%0A' + encodeURIComponent(message);
            window.location.href = 'mailto:' + mailto + '?subject=' + encodeURIComponent(subject) + '&body=' + body;
        });
    }
})();
