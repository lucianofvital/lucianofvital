/* ============================================
   ABOUT JS — Animações da seção Sobre
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const aboutText = document.querySelector('.about-text');
  
  if (!aboutText) return;

  // IntersectionObserver para revelar o texto com fade
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 150);
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -20%', threshold: 0.1 });

  observer.observe(aboutText);

  // Efeito hover na imagem (ligeiro)
  const aboutImage = document.querySelector('.about-image img');
  if (aboutImage) {
    const imageContainer = aboutImage.parentElement;
    
    imageContainer.addEventListener('mouseenter', () => {
      aboutImage.style.filter = 'grayscale(0%) contrast(1.15)';
      aboutImage.style.transform = 'scale(1.02)';
    });

    imageContainer.addEventListener('mouseleave', () => {
      aboutImage.style.filter = 'grayscale(25%) contrast(1.08)';
      aboutImage.style.transform = 'scale(1)';
    });
  }
});
