/* ============================================
   CONTACT JS — Interações da seção Contato
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const contactLinks = Array.from(document.querySelectorAll('.contact-link'));
  
  if (!contactLinks.length) return;

  // Acompanhamento de foco para acessibilidade
  document.body.addEventListener('focusin', (e) => {
    const link = e.target.closest('.contact-link');
    if (link && contactLinks.includes(link)) {
      // Link ganhou foco, estilo já aplicado por :focus
    }
  });

  // Ripple effect ao clicar
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const rect = link.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(126, 200, 247, 0.4)';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.pointerEvents = 'none';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      ripple.style.animation = 'ripple 0.6s ease-out';
      
      link.style.position = 'relative';
      link.style.overflow = 'hidden';
      link.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
});

// Adicionar animação de ripple ao CSS dinâmico
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
