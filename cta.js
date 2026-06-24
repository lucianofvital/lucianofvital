/* ============================================
   CTA JS — Interações da seção CTA
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const ctaBox = document.querySelector('.cta-box');
  
  if (!ctaBox) return;

  // Adiciona um efeito sutil de parallax leve ao scroll
  const handleScroll = () => {
    const rect = ctaBox.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      const scrollAmount = window.innerHeight - rect.top;
      const percentage = scrollAmount / window.innerHeight;
      const offset = (percentage - 0.5) * 12; // Movimento sutil
      ctaBox.style.transform = `translateY(${offset}px)`;
    }
  };

  window.addEventListener('scroll', handleScroll);
});
