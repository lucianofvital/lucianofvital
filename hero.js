/* ============================================
   HEADER & HERO JS — Luciano F Vital Portfolio
   Módulos: scroll header | menu mobile | dialogue typewriter
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. HEADER: adiciona classe ao rolar ───────────────────────────────────

  const header     = document.getElementById('header');
  const THRESHOLD  = 40; // px para ativar o fundo

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // roda de imediato caso a página abra rolada


  // ─── 2. MENU MOBILE: abre/fecha com animação clip-path ────────────────────

  const menuBtn    = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks  = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function toggleMenu(force) {
    const isOpen = typeof force === 'boolean'
      ? force
      : !menuBtn.classList.contains('active');

    menuBtn.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen);

    // Impede scroll do body enquanto menu está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleMenu());
  }

  // Fecha ao clicar em qualquer link do menu mobile
  menuLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });


  // ─── 3. HERO: carrossel dialógico com typewriter + glitch ─────────────────

  const dialogueEl = document.querySelector('.dialogue-text');
  if (!dialogueEl) return;

  /*
    Frases em duas partes: [texto normal, palavra de destaque (highlight)]
    O carrossel mantém o tom humano e direto que o Luciano quer —
    sem exagero de copy, como se ele mesmo estivesse falando.
  */
  const frases = [

    {
        normal:'Faço Sites que ',
        destaque:'Vendem.'
    },

    {
        normal:'Faço Marcas que ',
        destaque:'Ficam.'
    },

    {
        normal:'Faço Design com ',
        destaque:'Propósito.'
    }

];

  // Caracteres de glitch usados na troca de frase
  const GLITCH_CHARS = '█▓▒░#@&%$';

  let fraseAtual  = 0;
  let charIndex   = 0;
  let apagando    = false;
  let bloqueado   = false; // pausa entre frases

  // Velocidades (ms por caractere)
  const VEL_DIGITAR = 52;
  const VEL_APAGAR  = 28;
  const PAUSA_FRASE = 2400; // tempo que a frase fica completa
  const PAUSA_INICIO = 900; // espera antes de começar a próxima

  // Monta o HTML da frase com span de highlight
  function montarHTML(normal, destaque) {
    return `${normal}<span class="highlight">${destaque}</span>`;
  }

  // Versão em texto puro (para typewriter caractere a caractere)
  function textoCompleto(frase) {
    return frase.normal + frase.destaque;
  }

  function render(texto, frase, progresso) {
    /*
      progresso: quanto do texto já foi digitado (0..total)
      Quando progresso >= frase.normal.length, o restante vai para o highlight
    */
    const normalLen   = frase.normal.length;
    const destaqueLen = frase.destaque.length;
    const total       = normalLen + destaqueLen;

    const normalPart   = texto.slice(0, Math.min(progresso, normalLen));
    const destacPart   = progresso > normalLen
      ? texto.slice(normalLen, progresso)
      : '';

    // Caractere de glitch opcional — aparece só no último caractere às vezes
    const glitch = Math.random() < 0.12
      ? `<span style="color:var(--azul-medio);opacity:0.7">${GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]}</span>`
      : '';

    if (destacPart) {
      dialogueEl.innerHTML = `${normalPart}<span class="highlight">${destacPart}</span>${glitch}`;
    } else {
      dialogueEl.innerHTML = `${normalPart}${glitch}`;
    }
  }

  function digitar() {
    if (bloqueado) return;

    const frase  = frases[fraseAtual];
    const total  = textoCompleto(frase).length;

    if (!apagando) {
      // ── Digitando ──
      if (charIndex <= total) {
        render(textoCompleto(frase), frase, charIndex);
        charIndex++;
        setTimeout(digitar, VEL_DIGITAR + Math.random() * 20); // variação humana
      } else {
        // Frase completa — exibe com markup de destaque real
        dialogueEl.innerHTML = montarHTML(frase.normal, frase.destaque);

        // Pausa e começa a apagar
        bloqueado = true;
        setTimeout(() => {
          bloqueado = false;
          apagando  = true;
          setTimeout(digitar, PAUSA_INICIO);
        }, PAUSA_FRASE);
      }
    } else {
      // ── Apagando ──
      if (charIndex > 0) {
        charIndex--;
        render(textoCompleto(frase), frase, charIndex);
        setTimeout(digitar, VEL_APAGAR);
      } else {
        // Troca para próxima frase
        apagando   = false;
        fraseAtual = (fraseAtual + 1) % frases.length;
        bloqueado  = true;
        setTimeout(() => {
          bloqueado = false;
          digitar();
        }, PAUSA_INICIO);
      }
    }
  }

  // Inicia com pequena espera para a animação de entrada do CSS terminar
  setTimeout(digitar, 900);


  // ─── 4. PARALLAX LEVE: foto do hero ───────────────────────────────────────

  const heroImg = document.querySelector('.hero-image img');

  if (heroImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY  = window.scrollY;
      const heroH    = document.getElementById('hero').offsetHeight;
      const progress = Math.min(scrollY / heroH, 1);
      // Move a foto levemente para cima ao rolar — máx 30px
      heroImg.style.transform = `translateY(${progress * -30}px)`;
    }, { passive: true });
  }


  // ─── 5. REVEAL: animação nos links do menu ao abrir mobile ────────────────

  const observer = new MutationObserver(() => {
    if (mobileMenu.classList.contains('open')) {
      menuLinks.forEach((link, i) => {
        link.style.opacity    = '0';
        link.style.transform  = 'translateX(-16px)';
        link.style.transition = 'none';

        setTimeout(() => {
          link.style.transition = `opacity 0.35s ease ${i * 0.07}s, transform 0.35s ease ${i * 0.07}s`;
          link.style.opacity    = '1';
          link.style.transform  = 'translateX(0)';
        }, 20);
      });
    }
  });

  if (mobileMenu) {
    observer.observe(mobileMenu, { attributes: true, attributeFilter: ['class'] });
  }

});