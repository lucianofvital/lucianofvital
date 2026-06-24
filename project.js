/* ============================================
   PROJECTS JS — Animações e interações dos projetos
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  if (!projectCards.length) return;

  // IntersectionObserver para revelar os cards com stagger
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const idx = projectCards.indexOf(el);
      // Delay escalonado para efeito em cascata
      setTimeout(() => el.classList.add('visible'), Math.min(250, idx * 100));
      obs.unobserve(el);
    });
  }, { root: null, rootMargin: '0px 0px -15%', threshold: 0.08 });

  projectCards.forEach(card => observer.observe(card));

  // Acessibilidade: revela card ao receber foco
  document.body.addEventListener('focusin', (e) => {
    const card = e.target.closest('.project-card');
    if (card) card.classList.add('visible');
  });
});
