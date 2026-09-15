document.addEventListener('DOMContentLoaded', () => {
  // Configurações Globais GSAP
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  /* ====================================================================
     1. MASTER INTRO (Animação do Logo abrindo a página) & HERO
  ==================================================================== */
  // Garante visibilidade dos itens que farão animação depois
  gsap.set('.gsap-reveal', { autoAlpha: 1 });

  const introScreen = document.getElementById('intro-screen');
  const masterTl = gsap.timeline({ defaults: { ease: "power4.out" } });
  const introTl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });

  // Configuração da animação do Hero (roda depois do logo intro)
  introTl
    .from('.hero-image img', { scale: 1.15, filter: "brightness(0.3) blur(10px)", duration: 2.2, ease: "power3.out" })
    .from('.eyebrow', { y: 20, opacity: 0, duration: 1 }, "-=1.5")
    .from('.hero-title', { y: 40, opacity: 0, duration: 1.2, stagger: 0.1 }, "-=1.2")
    .from('.hero-dialogue', { y: 20, opacity: 0, duration: 1 }, "-=1")
    .from('.hero-description', { y: 20, opacity: 0, duration: 1 }, "-=0.9")
    .from('.hero-buttons .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.8");

  // Animação de Entrada - Efeito revelando o logo, carregando, e deslizando
  masterTl
    .to('.intro-logo', { opacity: 1, y: -10, duration: 1, ease: "power3.out" })
    .to('.intro-logo::after', { width: "100%", duration: 0.8, ease: "power2.inOut" }, "-=0.4")
    .to('.intro-progress-bar', { opacity: 1, duration: 0.3 }, "-=0.2")
    .to('.intro-progress-fill', { width: "100%", duration: 1, ease: "power3.inOut" })
    .to('.intro-content', { opacity: 0, y: -20, duration: 0.6, delay: 0.2 })
    .to('#intro-screen', { 
        clipPath: "inset(0 0 100% 0)", 
        duration: 1.2, 
        ease: "power4.inOut",
        onComplete: () => {
            introScreen.style.display = 'none'; // Libera o DOM
            introTl.play(); // Dispara o Hero
        }
    }, "-=0.2");


  /* ====================================================================
     2. HEADER & MENU MOBILE
  ==================================================================== */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });

  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function toggleMenu(force) {
    const isOpen = typeof force === 'boolean' ? force : !menuBtn.classList.contains('active');
    menuBtn.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    if(isOpen) {
      gsap.fromTo(menuLinks, 
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.1 }
      );
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu());
  menuLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));


  /* ====================================================================
     3. HERO TYPEWRITER
  ==================================================================== */
  const dialogueEl = document.querySelector('.dialogue-text');
  if (dialogueEl) {
    const frases = [
      { normal:'Construo Sites que ', destaque:'Vendem.' },
      { normal:'Desenho Marcas que ', destaque:'Ficam.' },
      { normal:'Crio Interfaces com ', destaque:'Essência.' }
    ];
    let fraseAtual = 0, charIndex = 0, apagando = false, bloqueado = false;
    
    function render(texto, frase, progresso) {
      const normalLen = frase.normal.length;
      const normalPart = texto.slice(0, Math.min(progresso, normalLen));
      const destacPart = progresso > normalLen ? texto.slice(normalLen, progresso) : '';
      const glitch = Math.random() < 0.12 ? `<span style="color:var(--azul-medio);opacity:0.7">#</span>` : '';
      dialogueEl.innerHTML = destacPart ? `${normalPart}<span class="highlight">${destacPart}</span>${glitch}` : `${normalPart}${glitch}`;
    }

    function digitar() {
      if (bloqueado) return;
      const frase = frases[fraseAtual];
      const texto = frase.normal + frase.destaque;
      if (!apagando) {
        if (charIndex <= texto.length) {
          render(texto, frase, charIndex); charIndex++; setTimeout(digitar, 52 + Math.random() * 20);
        } else {
          dialogueEl.innerHTML = `${frase.normal}<span class="highlight">${frase.destaque}</span>`;
          bloqueado = true; setTimeout(() => { bloqueado = false; apagando = true; setTimeout(digitar, 900); }, 2400);
        }
      } else {
        if (charIndex > 0) {
          charIndex--; render(texto, frase, charIndex); setTimeout(digitar, 28);
        } else {
          apagando = false; fraseAtual = (fraseAtual + 1) % frases.length; bloqueado = true;
          setTimeout(() => { bloqueado = false; digitar(); }, 900);
        }
      }
    }
    // Aguarda a tela de carregamento para iniciar a digitação
    setTimeout(digitar, 4000);
  }

  /* ====================================================================
     4. SCROLL ANIMATION (Expertise Section - OTIMIZADA PARA MOBILE)
  ==================================================================== */
  const listItems = gsap.utils.toArray(".list__item");

  listItems.forEach(item => {
    const itemTitle = item.querySelector(".list__item__title");
    const itemTitleOutline = item.querySelector(".list__item__titleOutline");
    const itemImg = item.querySelector("img");

    ScrollTrigger.matchMedia({
      // DESKTOP: Mantém a fluidez original
      "(min-width: 769px)": function() {
        const itemTL = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            end: "bottom 50%",
            scrub: 1.5,
          }
        });

        itemTL.fromTo(itemTitle, { scale: 2, y: "100%", opacity: 0 }, { scale: 1, y: "0%", opacity: 1, ease: "power2.inOut" }, 0);
        itemTL.fromTo(itemTitleOutline, { scale: 2, y: "100%", opacity: 0 }, { scale: 1, y: "0%", opacity: 1, ease: "power2.inOut" }, 0);
        
        gsap.fromTo(itemImg, 
          { x: "60vw", y: "40vh", rotate: -15, scale: 1.1 }, 
          { 
            x: "-60vw", y: "-40vh", rotate: 15, scale: 1, ease: "none", 
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            }
          }
        );
      },

      // MOBILE: Travessia Horizontal Contínua leve
      "(max-width: 768px)": function() {
        gsap.fromTo(itemImg, 
          { x: "150vw", y: "8vh", rotation: 20 }, 
          { x: "-150vw", y: "-8vh", rotation: -20, ease: "none", 
            scrollTrigger: {
              trigger: item, start: "top 100%", end: "bottom 0%", scrub: 1.2, invalidateOnRefresh: true
            }
          }
        );

        gsap.fromTo(itemTitle,
          { y: "80%", scale: 0.9, opacity: 0 },
          { y: "0%", scale: 1, opacity: 1, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 85%", end: "center 50%", scrub: 1.2 }
          }
        );

        gsap.fromTo(itemTitleOutline,
          { y: "120%", scale: 1.1, opacity: 0 },
          { y: "-20%", scale: 1, opacity: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 85%", end: "bottom 40%", scrub: 1.5 }
          }
        );
      }
    });
  });

  /* ====================================================================
     5. FAQ & SECTIONS REVEAL + PARALLAX
  ==================================================================== */
  gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.to(element, {
      scrollTrigger: { trigger: element, start: "top 85%" },
      y: 0, opacity: 1, duration: 1, ease: "power3.out"
    });
  });

  gsap.from(".faq-item", {
    scrollTrigger: { trigger: ".faq-section", start: "top 75%" },
    y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
  });

  const faqItems = document.querySelectorAll(".faq-item");
  let currentOpenItem = null;
  faqItems.forEach((item) => {
    const title = item.querySelector(".faq-title");
    const plusBlock = item.querySelector(".plus-block");
    const verticalLine = item.querySelector(".plus-line.vertical");
    const content = item.querySelector(".faq-content");
    const trackProgress = item.querySelector(".track-progress");

    item.closeFaq = () => {
      gsap.to(content, { height: 0, duration: 0.5, ease: "power3.inOut", overwrite: "auto" });
      gsap.to(verticalLine, { rotation: 90, duration: 0.5, ease: "power3.inOut" });
      if (!item.matches(':hover')) gsap.to(trackProgress, { width: "0%", duration: 0.5 });
      item.classList.remove('is-open');
    };

    item.openFaq = () => {
      gsap.to(content, { height: "auto", duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
      gsap.to(verticalLine, { rotation: 0, duration: 0.6, ease: "power3.inOut" });
      gsap.to(trackProgress, { width: "100%", duration: 0.4 });
      item.classList.add('is-open');
    };

    item.addEventListener("mouseenter", () => {
      gsap.to(title, { x: 12, duration: 0.4, ease: "power2.out" });
      gsap.to(trackProgress, { width: "100%", duration: 0.5, ease: "power3.inOut" });
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(title, { x: 0, duration: 0.4, ease: "power2.out" });
      if (!item.classList.contains('is-open')) gsap.to(trackProgress, { width: "0%", duration: 0.4 });
    });

    item.addEventListener("click", () => {
      if (item.classList.contains('is-open')) {
        item.closeFaq(); currentOpenItem = null;
      } else {
        if (currentOpenItem && currentOpenItem !== item) currentOpenItem.closeFaq();
        item.openFaq(); currentOpenItem = item;
      }
    });
  });

  ScrollTrigger.matchMedia({
    "(min-width: 769px)": function() {
      gsap.to(".faq-parallax-bg", {
        y: 120, ease: "none",
        scrollTrigger: { trigger: ".faq-section", start: "top bottom", end: "bottom top", scrub: true }
      });
    },
    "(max-width: 768px)": function() {
      gsap.to(".faq-parallax-bg", {
        y: 45, ease: "none",
        scrollTrigger: { trigger: ".faq-section", start: "top bottom", end: "bottom top", scrub: true }
      });
    }
  });


  /* ====================================================================
     6. CLASSE UTILITÁRIA GSAP: BLUR REVEAL
  ==================================================================== */
  gsap.utils.toArray(".gsap-blur-reveal").forEach(element => {
    gsap.fromTo(element, 
      { y: 100, opacity: 0, scale: 0.95, filter: "blur(5px)", autoAlpha: 0 },
      {
        scrollTrigger: { trigger: element, start: "top 85%", end: "bottom 80%", scrub: 1 },
        y: 0, opacity: 1, scale: 1, filter: "blur(0px)", autoAlpha: 1, ease: "power2.out"
      }
    );
  });


  /* ====================================================================
     7. MICROINTERAÇÕES MAGNÉTICAS
  ==================================================================== */
  if (window.matchMedia("(min-width: 1024px)").matches) {
    const magnets = document.querySelectorAll('[data-magnetic]');
    
    magnets.forEach(magnet => {
      magnet.addEventListener('mousemove', (e) => {
        const bounds = magnet.getBoundingClientRect();
        const x = (e.clientX - bounds.left) - bounds.width / 2;
        const y = (e.clientY - bounds.top) - bounds.height / 2;
        gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      });
      magnet.addEventListener('mouseleave', () => {
        gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)", overwrite: "auto" });
      });
    });
  }

  /* ====================================================================
     8. GALERIA & MODAL PREMIUM (Com injeção de "Clique para ver o site")
  ==================================================================== */
  const portfolioData = [
    {
      titulo: "Sobonire Store",
      categoria: "Identidade Visual & Web",
      subtitulo: "Direcionamento visual e experiência fluida",
      imagem: "img/sobonire01.PNG",
      url: "http://sobonire.store/"
    },
    {
      titulo: "Teleprag",
      categoria: "Catálogo & Marketing",
      subtitulo: "Landing page orientada para conversão local",
      imagem: "img/telepra01.PNG",
      url: "https://lucianofvital.github.io/projeto-teleprag/"
    },
    {
      titulo: "Coletivo Afrologia",
      categoria: "Plataforma Digital",
      subtitulo: "Interface institucional valorizando o cenário artístico",
      imagem: "img/afrologia01.PNG",
      url: "https://lucianofvital.github.io/afrologia/"
    },
    {
      titulo: "Dra Gabriela Araújo",
      categoria: "Performance UI/UX",
      subtitulo: "Apresentação de autoridade com estrutura leve",
      imagem: "img/pg01.PNG",
      url: "https://lucianofvital.github.io/gabriela-araujo/"
    }
  ];

  const portfolioGrid = document.getElementById('portfolio-grid');
  const projectModal = document.getElementById('project-modal');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalContent = document.querySelector('.modal-content');
  const modalClose = document.querySelector('.modal-close');
  const projectIframe = document.getElementById('project-iframe');
  const modalLoader = document.querySelector('.modal-loader');
  
  // Elemento do balão do modal
  const modalBalloon = document.querySelector('.modal-balloon');

  if (portfolioGrid) {
    portfolioData.forEach((project, index) => {
      const card = document.createElement('div');
      card.className = 'portfolio-card';
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      
      // Inserção da interface do usuário "Clique para ver o site"
      card.innerHTML = `
        <img src="${project.imagem}" alt="${project.titulo}" class="portfolio-card-img" loading="lazy">
        <div class="portfolio-overlay">
          <div class="portfolio-click-text">Clique para ver o site <ion-icon name="open-outline"></ion-icon></div>
          <span class="portfolio-cat">${project.categoria}</span>
          <h3 class="portfolio-title">${project.titulo}</h3>
          <p class="portfolio-sub">${project.subtitulo}</p>
        </div>
      `;
      portfolioGrid.appendChild(card);

      card.addEventListener('click', () => openModal(project.url));
    });

    ScrollTrigger.batch(".portfolio-card", {
      start: "top 85%",
      onEnter: batch => gsap.to(batch, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power3.out",
        overwrite: true
      }),
      once: true
    });
  }

  let isModalOpen = false;
  // Animação flutuante contínua do balão
  let balloonBounce = null;

  function openModal(url) {
    if (isModalOpen) return;
    isModalOpen = true;

    document.body.style.overflow = 'hidden';
    projectModal.setAttribute('aria-hidden', 'false');
    projectModal.style.pointerEvents = 'all';
    projectModal.style.visibility = 'visible';
    projectIframe.style.opacity = '0';
    modalLoader.style.opacity = '1';
    projectIframe.src = url;

    // Reseta e anima a entrada da estrutura do modal
    gsap.to(modalBackdrop, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(modalContent, 
      { opacity: 0, scale: 0.95, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.4)", delay: 0.1 }
    );

    // Anima a entrada do balão e faz ele flutuar (chamar a atenção)
    gsap.fromTo(modalBalloon, 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: "back.out(1.5)", delay: 0.8, 
        onComplete: () => {
          balloonBounce = gsap.to(modalBalloon, {
            x: -4, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut"
          });
        }
      }
    );

    setTimeout(() => modalClose.focus(), 100);
  }

  function closeModal() {
    if (!isModalOpen) return;
    isModalOpen = false;

    // Mata a animação do balão
    if(balloonBounce) balloonBounce.kill();
    gsap.to(modalBalloon, { opacity: 0, x: -10, duration: 0.3 });

    gsap.to(modalContent, {
      opacity: 0, scale: 0.96, y: -20, duration: 0.4, ease: "power2.in",
      onComplete: () => {
        projectIframe.src = ""; 
        projectModal.setAttribute('aria-hidden', 'true');
        projectModal.style.pointerEvents = 'none';
        projectModal.style.visibility = 'hidden';
        document.body.style.overflow = ''; 
      }
    });
    gsap.to(modalBackdrop, { opacity: 0, duration: 0.4, ease: "power2.in", delay: 0.1 });
  }

  if (projectIframe) {
    projectIframe.addEventListener('load', () => {
      if (projectIframe.src && projectIframe.src !== window.location.href) {
        gsap.to(modalLoader, { opacity: 0, duration: 0.4 });
        gsap.to(projectIframe, { opacity: 1, duration: 0.6, delay: 0.1 });
      }
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) closeModal();
  });

});