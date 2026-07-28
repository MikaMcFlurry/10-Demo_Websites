(() => {
  const root = document.documentElement;
  const clock = document.querySelector('[data-clock]');
  const archive = document.querySelector('[data-archive]');

  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    root.style.setProperty('--page-progress', distance > 0 ? String(window.scrollY / distance) : '0');
  };

  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Berlin',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  };

  updateProgress();
  updateClock();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  window.setInterval(updateClock, 30_000);

  if (archive) {
    archive.addEventListener('toggle', () => {
      archive.querySelector('summary')?.setAttribute('aria-expanded', String(archive.open));
    });
  }
})();
