  // ─── 6. PREMIUM DIVIDER: carrossel infinito da faixa diagonal ─────────────

  const divider = document.querySelector('.premium-divider');
  const dividerTrack = document.querySelector('.premium-divider__track');

  if (divider && dividerTrack) {
    // Cria pontos de brilho automaticamente
    const glow1 = document.createElement('span');
    glow1.className = 'premium-divider__glow premium-divider__glow--1';

    const glow2 = document.createElement('span');
    glow2.className = 'premium-divider__glow premium-divider__glow--2';

    divider.appendChild(glow1);
    divider.appendChild(glow2);

    // Clona os itens para criar loop infinito (duplica exatamente 2x)
    const originalItems = Array.from(dividerTrack.children);
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      dividerTrack.appendChild(clone);
    });

    let position = 0;
    let speed = 0.5;
    let singleLoopWidth = 0;
    let animationId = null;
    let isPaused = false;

    function calcularLarguraLoop() {
      // Calcula o tamanho de UM loop completo (metade dos itens totais)
      singleLoopWidth = 0;
      
      const totalItems = dividerTrack.children.length;
      const loopItems = totalItems / 2;
      
      // Soma a largura de cada item original
      for (let i = 0; i < loopItems; i++) {
        const item = dividerTrack.children[i];
        singleLoopWidth += item.offsetWidth;
      }
      
      // Soma os gaps (44px entre itens, então é um a menos que itens)
      const gapSize = 44;
      singleLoopWidth += (loopItems - 1) * gapSize;
      
      // Ajusta velocidade baseado no tamanho da viewport
      const viewportWidth = window.innerWidth;
      if (viewportWidth <= 600) {
        speed = 0.4; // mobile: mais lento
      } else if (viewportWidth <= 900) {
        speed = 0.45; // tablet
      } else {
        speed = 0.5; // desktop
      }
    }

    function animateDivider() {
      if (isPaused) {
        animationId = requestAnimationFrame(animateDivider);
        return;
      }

      position -= speed;

      // Reset quando completa um loop (mais preciso agora)
      if (Math.abs(position) >= singleLoopWidth) {
        position = 0;
      }

      dividerTrack.style.transform = `translate3d(${position}px, 0, 0)`;
      animationId = requestAnimationFrame(animateDivider);
    }

    function iniciarDivider() {
      cancelAnimationFrame(animationId);
      position = 0;
      calcularLarguraLoop();
      animateDivider();
    }

    // Pausa ao passar o mouse (hover pausa elegantemente)
    divider.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    divider.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Recalcula ao redimensionar
    window.addEventListener('resize', iniciarDivider);

    // Inicia após o layout carregar
    setTimeout(iniciarDivider, 300);
  }