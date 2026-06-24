/* ============================================
	 SERVICES JS — Revela cards e adiciona pequenas interações
	 ============================================ */

document.addEventListener('DOMContentLoaded', () => {

	const serviceCards = Array.from(document.querySelectorAll('.service-card'));
	if (!serviceCards.length) return;

	// IntersectionObserver para revelar os cards com stagger
	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const el = entry.target;
			const idx = serviceCards.indexOf(el);
			// delay pequeno com base na ordem para efeito escalonado
			setTimeout(() => el.classList.add('visible'), Math.min(300, idx * 80));
			obs.unobserve(el);
		});
	}, { root: null, rootMargin: '0px 0px -10%', threshold: 0.12 });

	serviceCards.forEach(card => observer.observe(card));

	// Efeito sutil no número do serviço ao mover o mouse
	serviceCards.forEach(card => {
		const number = card.querySelector('.service-number');
		if (!number) return;

		card.addEventListener('mousemove', (e) => {
			const r = card.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width - 0.5;
			const y = (e.clientY - r.top) / r.height - 0.5;
			number.style.transform = `translate(${(x * 8).toFixed(2)}px, ${(y * 6).toFixed(2)}px)`;
		});

		card.addEventListener('mouseleave', () => {
			number.style.transform = '';
		});
	});

	// Acessibilidade: revela card quando elemento interno recebe foco
	document.body.addEventListener('focusin', (e) => {
		const card = e.target.closest('.service-card');
		if (card) card.classList.add('visible');
	});

	// ─── MOBILE SCROLL DETECTION: Cards acendem ao scrollar ───
	// Em mobile (viewport <= 768px), os cards ganham efeito de hover ao passar na viewport
	if (window.innerWidth <= 768) {
		const scrollObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					// Card está visível: acende
					entry.target.classList.add('active-mobile');
				} else {
					// Card saiu da viewport: desliga
					entry.target.classList.remove('active-mobile');
				}
			});
		}, { 
			root: null, 
			rootMargin: '0px 0px -20% 0px', // Começa a acender um pouco antes do meio da tela
			threshold: 0
		});

		serviceCards.forEach(card => scrollObserver.observe(card));

		// Atualiza observer ao redimensionar (se mudar de mobile para desktop)
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				const isNowMobile = window.innerWidth <= 768;
				if (!isNowMobile) {
					// Se virou desktop, remove as classes active
					serviceCards.forEach(card => card.classList.remove('active-mobile'));
				}
			}, 150);
		});
	}

});
