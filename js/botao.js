document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector("#hero");
  const socialFloat = document.querySelector(".social-float");
  const whatsappFloat = document.querySelector(".whatsapp-float");

  if (!heroSection || !socialFloat || !whatsappFloat) return;

  let heroActive = false;

  function setHeroState(isHeroVisible) {
    if (isHeroVisible === heroActive) return;
    heroActive = isHeroVisible;

    if (heroActive) {
      // HERO visível:
      // mostra GitHub + Instagram
      // esconde WhatsApp
      socialFloat.classList.remove("float-hidden");
      whatsappFloat.classList.add("float-hidden");
    } else {
      // Fora da HERO:
      // esconde GitHub + Instagram
      // mostra WhatsApp
      socialFloat.classList.add("float-hidden");
      whatsappFloat.classList.remove("float-hidden");
    }
  }

  function updateFloatingButtons() {
    const rect = heroSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    /*
      HERO ativa quando ainda ocupa uma área relevante da tela.
      Esse cálculo deixa a troca mais natural do que usar apenas isIntersecting.
    */
    const heroVisible =
      rect.top <= viewportHeight * 0.25 &&
      rect.bottom >= viewportHeight * 0.35;

    setHeroState(heroVisible);
  }

  // Estado inicial logo no carregamento
  updateFloatingButtons();

  // Observa a hero para reagir ao scroll com suavidade
  const observer = new IntersectionObserver(
    () => {
      updateFloatingButtons();
    },
    {
      threshold: [0, 0.08, 0.15, 0.25, 0.4, 0.6, 0.8, 1]
    }
  );

  observer.observe(heroSection);

  // Recalcula em resize
  window.addEventListener("resize", updateFloatingButtons);

  // Segurança extra: atualiza também no scroll
  // útil em layouts com hero muito alta, sticky elements ou transições
  window.addEventListener("scroll", updateFloatingButtons, { passive: true });
});