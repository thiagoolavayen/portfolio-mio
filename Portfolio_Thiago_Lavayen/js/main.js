// Portfolio de Thiago Lavayen - Interactividad con JavaScript
(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const menuButton = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const shareButton = document.getElementById('shareButton');
  const toast = document.getElementById('toast');
  const year = document.getElementById('year');

  // Modo claro / oscuro. El tema seleccionado se recuerda al recargar la página.
  let savedTheme;
  try { savedTheme = localStorage.getItem('thiago-portfolio-theme'); } catch (_) { /* Navegación privada */ }
  const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeButton.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0b1020' : '#f7f8fd');
    try { localStorage.setItem('thiago-portfolio-theme', theme); } catch (_) { /* Se mantiene durante la visita */ }
  }
  setTheme(initialTheme);
  themeButton.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  // Menú desplegable para pantallas pequeñas.
  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
  }
  menuButton.addEventListener('click', () => {
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 720) closeMenu(); });

  // Aparición suave de las secciones al hacer scroll.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Compartir el enlace de GitHub Pages después de publicar el sitio.
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
  }
  shareButton.addEventListener('click', async () => {
    if (window.location.protocol === 'file:') {
      showToast('Cuando lo publiques en GitHub Pages, vas a poder copiar el enlace.');
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('¡Enlace copiado! Ya podés compartir tu portfolio.');
    } catch (_) {
      showToast('Copiá el enlace desde la barra de direcciones.');
    }
  });
  year.textContent = String(new Date().getFullYear());
})();
