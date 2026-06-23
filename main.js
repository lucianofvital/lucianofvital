/* ==================================================
   HEADER SCROLL
================================================== */

const header = document.querySelector("#header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        header.classList.add("header-active");

    }else{

        header.classList.remove("header-active");

    }

});


/* ==================================================
   SMOOTH SCROLL LINKS
================================================== */

const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {

    link.addEventListener("click", (e) => {

        e.preventDefault();

        const target = document.querySelector(
            link.getAttribute("href")
        );

        if(target){

            target.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });

        }

    });

});


/* ==================================================
   SCROLL REVEAL
================================================== */

const reveals = document.querySelectorAll(
    "section, .card, .project-card, article"
);

function revealElements(){

    const trigger =
    window.innerHeight * 0.85;

    reveals.forEach(item => {

        const top =
        item.getBoundingClientRect().top;

        if(top < trigger){

            item.classList.add("active");

        }

    });

}

window.addEventListener(
    "scroll",
    revealElements
);

revealElements();


/* ==================================================
   ADD REVEAL CLASS AUTOMATIC
================================================== */

reveals.forEach(item => {

    item.classList.add("reveal");

});


/* ==================================================
   HERO PARALLAX
================================================== */

const heroImage =
document.querySelector(".hero-image img");

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;

    if(heroImage){

        heroImage.style.transform =
        `translateY(${scroll * 0.15}px)`;

    }

});


/* ==================================================
   PROGRESS BAR
================================================== */

const progressBar =
document.createElement("div");

progressBar.classList.add(
    "progress-bar"
);

document.body.appendChild(
    progressBar
);

window.addEventListener("scroll", () => {

    const scrollTop =
    window.scrollY;

    const height =
    document.documentElement.scrollHeight -
    window.innerHeight;

    const progress =
    (scrollTop / height) * 100;

    progressBar.style.width =
    progress + "%";

});


/* ==================================================
   MOUSE GLOW EFFECT
================================================== */

const glow =
document.createElement("div");

glow.classList.add(
    "mouse-glow"
);

document.body.appendChild(
    glow
);

document.addEventListener(
    "mousemove",
    (e) => {

        glow.style.left =
        e.clientX + "px";

        glow.style.top =
        e.clientY + "px";

    }
);


/* ==================================================
   STAGGER ANIMATION
================================================== */

const cards =
document.querySelectorAll(
    ".card, .project-card"
);

cards.forEach((card,index)=>{

    card.style.transitionDelay =
    `${index * 0.1}s`;

});


/* ==================================================
   HERO TEXT PARALLAX
================================================== */

const heroContent =
document.querySelector(
    ".hero-content"
);

window.addEventListener("scroll",()=>{

    const scroll =
    window.scrollY;

    if(heroContent){

        heroContent.style.transform =
        `translateY(${scroll * 0.05}px)`;

    }

});


/* ==================================================
   HERO DIALOGUE TYPING / PERSISTENT LAST PHRASE
   - Types full presentation (including name)
   - After the last question is typed, it stays fixed
   - If user reloads the page, the sequence resets
================================================== */

const dialogueEl = document.querySelector('.dialogue-text');

const dialoguePhrases = [
    'Olá, eu sou Luciano F Vital.',
    'Crio sites e identidades visuais que geram resultados.',
    'Sites modernos, rápidos e responsivos.',
    'Identidade visual que destaca sua marca.',
    'Quer transformar sua presença digital comigo?'
];

function getNavigationType(){
    try{
        const nav = performance.getEntriesByType('navigation')[0];
        if(nav && nav.type) return nav.type; // 'reload', 'navigate', 'back_forward', 'prerender'
    }catch(e){}
    // fallback
    if(performance && performance.navigation){
        return performance.navigation.type === 1 ? 'reload' : 'navigate';
    }
    return 'navigate';
}

if(dialogueEl){

    // if the page was reloaded, clear the saved lock so sequence runs again
    if(getNavigationType() === 'reload'){
        sessionStorage.removeItem('dialogueLocked');
    }

    const locked = sessionStorage.getItem('dialogueLocked') === 'true';

    if(locked){
        // show last phrase fixed
        dialogueEl.textContent = dialoguePhrases[dialoguePhrases.length - 1];
        dialogueEl.classList.add('locked');
    } else {

        let pIndex = 0;
        let cIndex = 0;
        let deleting = false;

        function tick(){
            const current = dialoguePhrases[pIndex];

            if(!deleting){
                dialogueEl.textContent = current.slice(0, ++cIndex);
                if(cIndex === current.length){
                    // if it's the last phrase, lock it and stop
                    if(pIndex === dialoguePhrases.length - 1){
                        sessionStorage.setItem('dialogueLocked', 'true');
                        dialogueEl.classList.add('locked');
                        return;
                    }
                    deleting = true;
                    setTimeout(tick, 1200);
                } else {
                    setTimeout(tick, 45);
                }
            } else {
                dialogueEl.textContent = current.slice(0, --cIndex);
                if(cIndex === 0){
                    deleting = false;
                    pIndex = (pIndex + 1) % dialoguePhrases.length;
                    setTimeout(tick, 300);
                } else {
                    setTimeout(tick, 20);
                }
            }
        }

        // small delay to allow layout settle
        setTimeout(tick, 600);

    }

}


/* ==================================================
   PROJECT HOVER TILT
================================================== */

const projectCards =
document.querySelectorAll(
    ".project-card"
);

projectCards.forEach(card=>{

    card.addEventListener(
        "mousemove",
        (e)=>{

            const rect =
            card.getBoundingClientRect();

            const x =
            e.clientX - rect.left;

            const y =
            e.clientY - rect.top;

            const rotateX =
            ((y / rect.height) - 0.5) * -10;

            const rotateY =
            ((x / rect.width) - 0.5) * 10;

            card.style.transform =
            `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.03)
            `;

        }
    );

    card.addEventListener(
        "mouseleave",
        ()=>{

            card.style.transform =
            `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
            `;

        }
    );

});


console.log(
    "Portfolio Premium Loaded 🚀"
);

const menuBtn =
document.querySelector(".menu-btn");

const mobileMenu =
document.querySelector(".mobile-menu");

const mobileLinks =
document.querySelectorAll(".mobile-menu a");

if(menuBtn && mobileMenu){
    menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("active");
        mobileMenu.classList.toggle("active");
    });
}

mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
        if(menuBtn) menuBtn.classList.remove("active");
        if(mobileMenu) mobileMenu.classList.remove("active");
    });
});
