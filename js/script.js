document.addEventListener("DOMContentLoaded", function () {
    // Hero Slider
    setupHeroSlider();
    // Efecto navbar al hacer scroll
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Efecto parallax 3D para las cards de experiencia
    const experienceCards = document.querySelectorAll(".experience-card");

    experienceCards.forEach(card => {
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    window.addEventListener("mousemove", function (e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        experienceCards.forEach((card, index) => {
            if (card.matches(":hover")) return;
            const offsetX = (x - 0.5) * 20 * (index % 2 === 0 ? 1 : -1);
            const offsetY = (y - 0.5) * 20;
            card.style.transform = `rotateX(${offsetY / 2}deg) rotateY(${offsetX / 2}deg)`;
        });
    });

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });

    // Efecto de aparición para las secciones
    const sections = document.querySelectorAll("section");

    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight - 100) {
                section.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();

    // Formulario de contacto — abre WhatsApp con el mensaje
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nombre = this.querySelector('input[name="nombre"]').value;
            const mensaje = this.querySelector('textarea[name="mensaje"]').value;
            const responseElement = document.getElementById("formResponse");

            responseElement.textContent = "Preparando...";
            responseElement.style.color = "#d4af37";

            const whatsappMessage = `Hola, soy *${nombre}*. ${mensaje}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);

            window.open(`https://wa.me/+5491167291352?text=${encodedMessage}`, "_blank");

            responseElement.textContent = "¡Mensaje enviado con éxito!";
            responseElement.style.color = "#d4af37";
            contactForm.reset();

            createConfetti();
        });
    }

    // Scroll suave en cards de Lugares de Aplicación → sección de equipos
    const equiposSection = document.querySelector("#quien-soy");
    document.querySelectorAll(".location-card").forEach(card => {
        card.addEventListener("click", function () {
            if (equiposSection) {
                window.scrollTo({
                    top: equiposSection.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });

    // Tabs de productos
    setupProductTabs();

    // Configurar funcionalidad de expandir/contraer texto en mobile
    setupExpandableText();
});

function setupHeroSlider() {
    const dotsContainer = document.getElementById("heroDots");
    if (!dotsContainer) return;

    const isMobile = () => window.innerWidth <= 767;

    let currentIndex = 0;
    let slides = [];
    let autoInterval;

    function getActiveSlides() {
        const type = isMobile() ? ".mobile-slide" : ".desktop-slide";
        return [...document.querySelectorAll(type)];
    }

    function buildDots(count) {
        dotsContainer.innerHTML = "";
        for (let i = 0; i < count; i++) {
            const dot = document.createElement("button");
            dot.className = "hero-dot" + (i === 0 ? " active" : "");
            dot.setAttribute("aria-label", `Slide ${i + 1}`);
            dot.addEventListener("click", () => {
                goTo(i);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function goTo(index) {
        slides[currentIndex].classList.remove("active");
        dotsContainer.children[currentIndex].classList.remove("active");
        currentIndex = index;
        slides[currentIndex].classList.add("active");
        dotsContainer.children[currentIndex].classList.add("active");
    }

    function next() {
        goTo((currentIndex + 1) % slides.length);
    }

    function resetInterval() {
        clearInterval(autoInterval);
        autoInterval = setInterval(next, 4500);
    }

    function init() {
        // Ocultar todos los slides primero
        document.querySelectorAll(".hero-slide").forEach(s => s.classList.remove("active"));
        currentIndex = 0;
        slides = getActiveSlides();
        if (slides.length === 0) return;
        slides[0].classList.add("active");
        buildDots(slides.length);
        resetInterval();
    }

    init();

    // Reiniciar si cambia entre mobile y desktop
    let lastMobile = isMobile();
    window.addEventListener("resize", () => {
        const nowMobile = isMobile();
        if (nowMobile !== lastMobile) {
            lastMobile = nowMobile;
            init();
        }
    });
}

function setupProductTabs() {
    const tabBtns = document.querySelectorAll(".product-tab-btn");
    const panels = document.querySelectorAll(".product-panel");
    const container = document.querySelector(".product-panels");

    // Igualar alturas: medir todos los paneles y fijar el máximo
    if (container && panels.length > 0) {
        // Mostrar todos temporalmente (invisibles) para medir
        panels.forEach(p => {
            p.style.visibility = "hidden";
            p.classList.remove("d-none");
        });

        const maxHeight = Math.max(...[...panels].map(p => p.offsetHeight));
        container.style.minHeight = maxHeight + "px";

        // Restaurar estado original
        panels.forEach((p, i) => {
            p.style.visibility = "";
            if (i !== 0) p.classList.add("d-none");
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = this.dataset.product;
            tabBtns.forEach(b => b.classList.remove("active"));
            panels.forEach(p => p.classList.add("d-none"));
            this.classList.add("active");
            document.getElementById(`product-${idx}`).classList.remove("d-none");
        });
    });
}

function setupProductInfoButtons() {
    const productButtons = document.querySelectorAll("#quien-soy .btn-gold");

    productButtons.forEach((button, index) => {
        if (button.clickHandler) {
            button.removeEventListener("click", button.clickHandler);
        }

        button.clickHandler = function (e) {
            e.preventDefault();

            let message;
            if (index === 0) {
                message = "Hola, quiero más información sobre el Equipo Elegante Negro.";
            } else if (index === 1) {
                message = "Hola, quiero más información sobre el Equipo Industrial Blanco.";
            } else {
                message = "Hola, quiero más información.";
            }

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/5491167291352?text=${encodedMessage}`, "_blank");
        };

        button.addEventListener("click", button.clickHandler);
    });
}

function setupExpandableText() {
    const expandButtons = document.querySelectorAll(".btn-expand-mobile");

    expandButtons.forEach(button => {
        button.addEventListener("click", function () {
            const textElement = this.previousElementSibling;
            const expandText = this.querySelector(".expand-text");
            const collapseText = this.querySelector(".collapse-text");

            if (textElement && textElement.classList.contains("expandable-text")) {
                const isExpanded = textElement.classList.contains("expanded");

                if (isExpanded) {
                    textElement.classList.remove("expanded");
                    expandText.style.display = "inline";
                    collapseText.style.display = "none";
                } else {
                    textElement.classList.add("expanded");
                    expandText.style.display = "none";
                    collapseText.style.display = "inline";
                }
            }
        });
    });
}

function createConfetti() {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.width = "8px";
    confetti.style.height = "8px";
    confetti.style.backgroundColor = `hsl(${Math.random() * 60 + 30}, 100%, 50%)`;
    confetti.style.borderRadius = "50%";
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = "-10px";
    confetti.style.zIndex = "9999";
    confetti.style.opacity = "0.8";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(confetti);

    const animationDuration = Math.random() * 3 + 2;

    confetti.animate([
        { top: "-10px", opacity: 1 },
        { top: `${Math.random() * 100 + 50}vh`, opacity: 0 }
    ], {
        duration: animationDuration * 1000,
        easing: "cubic-bezier(0.1, 0.8, 0.3, 1)"
    });

    setTimeout(() => {
        confetti.remove();
    }, animationDuration * 1000);
}
