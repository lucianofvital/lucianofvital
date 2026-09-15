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








/* ============================================
   SHOWCASE GSAP — Interações da seção interativa
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o GSAP está carregado na página
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const titles = gsap.utils.toArray(".showcase-left-content");
  const cards = gsap.utils.toArray(".showcase-card");

  if (!titles.length || !cards.length) return;

  const mm = gsap.matchMedia();

  // ─── COMPORTAMENTO DESKTOP ───
  mm.add("(min-width: 769px)", () => {
    // Fixa a coluna da direita enquanto a esquerda rola
    ScrollTrigger.create({
      trigger: ".showcase-wrapper",
      start: "top top",
      end: "bottom bottom",
      pin: ".showcase-right",
      pinSpacing: false
    });

    titles.forEach((title, i) => {
      const card = cards[i];
      if (i === 0) return; // O primeiro já vem aberto no CSS

      ScrollTrigger.create({
        trigger: title,
        start: "top 55%",
        end: "bottom top",
        onEnter: () => gsap.to(card, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.6, ease: "power2.out" }),
        onLeaveBack: () => gsap.to(card, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", duration: 0.6, ease: "power2.inOut" }),
        invalidateOnRefresh: true,
      });
    });
  });

  // ─── COMPORTAMENTO MOBILE ───
  // Requisito: Não rolar o texto, texto muda simultâneo à imagem
  mm.add("(max-width: 768px)", () => {
    
    // Fixa a seção inteira na tela e atrela a animação ao scroll (scrub)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".showcase-wrapper",
        start: "top top",
        end: "+=250%", // Define o espaço virtual de rolagem (tempo que a seção fica presa)
        pin: true,
        scrub: 1, // Suaviza a troca
      }
    });

    // Reset de segurança para o primeiro item
    gsap.set(titles[0], { opacity: 1, y: 0 });
    gsap.set(cards[0], { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });

    // Constrói a linha do tempo (timeline)
    titles.forEach((title, i) => {
      if (i === 0) return;

      const card = cards[i];
      const prevTitle = titles[i - 1];

      // Fade out do texto anterior -> Fade In do texto atual -> Clip in da imagem atual
      tl.to(prevTitle, { opacity: 0, y: -15, duration: 0.4 }, `step${i}`)
        .to(title, { opacity: 1, y: 0, duration: 0.4 }, `step${i}`)
        .to(card, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.6, ease: "power1.inOut" }, `step${i}`);
    });
  });
});








/* ============================================
   FAQ JS — Lógica do Accordion com GSAP (Exclusivo)
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");
  
  if (!faqItems.length || typeof gsap === 'undefined') return;

  // Variável para rastrear qual item está aberto no momento
  let currentOpenItem = null;

  faqItems.forEach((item) => {
    const title = item.querySelector(".faq-title");
    const plusBlock = item.querySelector(".plus-block");
    const verticalLine = item.querySelector(".plus-line.vertical");
    const content = item.querySelector(".faq-content");
    const trackProgress = item.querySelector(".track-progress");

    // Criamos uma função de "Fechar" atrelada ao próprio item
    item.closeFaq = () => {
      gsap.to(content, { height: 0, duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
      gsap.to(verticalLine, { rotation: 90, duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
      
      // Se o mouse não estiver mais em cima ao fechar, recolhe a barra de progresso
      if (!item.matches(':hover')) {
        gsap.to(trackProgress, { width: "0%", duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
      }
      
      item.classList.remove('is-open');
    };

    // Criamos uma função de "Abrir" atrelada ao próprio item
    item.openFaq = () => {
      gsap.to(content, { height: "auto", duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
      gsap.to(verticalLine, { rotation: 0, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
      gsap.to(trackProgress, { width: "100%", duration: 0.4, overwrite: "auto" });
      
      item.classList.add('is-open');
    };

    // --- Interação de Hover (Passar o mouse) ---
    item.addEventListener("mouseenter", () => {
      gsap.to(title, { x: 16, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      gsap.to(plusBlock, { x: -10, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      gsap.to(trackProgress, { width: "100%", duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(title, { x: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      gsap.to(plusBlock, { x: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });

      if (!item.classList.contains('is-open')) {
        gsap.to(trackProgress, { width: "0%", duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
      }
    });

    // --- Interação de Clique ---
    item.addEventListener("click", () => {
      const isOpen = item.classList.contains('is-open');

      if (isOpen) {
        // Se clicar no que já está aberto, ele apenas fecha.
        item.closeFaq();
        currentOpenItem = null;
      } else {
        // Se clicar em um fechado, primeiro fecha o atual (se existir algum)
        if (currentOpenItem && currentOpenItem !== item) {
          currentOpenItem.closeFaq();
        }
        
        // Abre o item clicado e o define como o atual aberto
        item.openFaq();
        currentOpenItem = item;
      }
    });
  });
});





/* ============================================
   PRE-FOOTER CTA — Efeito de surgimento no Scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const preFooterCta = document.querySelector('.pre-footer-cta');
  
  if (!preFooterCta) return;

  // IntersectionObserver para revelar o CTA quando ele chegar na tela
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // Para a animação acontecer só uma vez
      }
    });
  }, { 
    root: null, 
    rootMargin: '0px 0px -15%', // Ativa um pouco antes de chegar ao fim
    threshold: 0.1 
  });

  observer.observe(preFooterCta);
});