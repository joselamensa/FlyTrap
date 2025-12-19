document.addEventListener("DOMContentLoaded", function () {
    // Efecto navbar al hacer scroll
    const navbar = document.querySelector(".navbar");
    
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Efecto parallax para las cards de experiencia
    const experienceCards = document.querySelectorAll(".experience-card");
    
    window.addEventListener("mousemove", function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        experienceCards.forEach((card, index) => {
            const offsetX = (x - 0.5) * 20 * (index % 2 === 0 ? 1 : -1);
            const offsetY = (y - 0.5) * 20;
            
            card.style.transform = `translateY(-10px) rotateX(${5 + offsetY/2}deg) rotateY(${offsetX/2}deg)`;
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

    // Formulario de contacto
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const nombre = this.querySelector('input[name="nombre"]').value;
            const mensaje = this.querySelector('textarea[name="mensaje"]').value;
            const responseElement = document.getElementById("formResponse");
            const currentLang = localStorage.getItem('selectedLanguage') || 'es';
            
            // Verificar si translations está disponible
            const translations = window.translations ? window.translations[currentLang] : null;
            
            // Mostrar indicador de carga
            responseElement.textContent = "Preparando...";
            responseElement.style.color = "#d4af37";
            
            // Crear mensaje para WhatsApp
            const reviewMessage = translations?.contact?.reviewMessage || "";
            const whatsappMessage = `${reviewMessage} *${mensaje}*`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Abrir WhatsApp con el mensaje
            window.open(`https://wa.me/+5491136267653?text=${encodedMessage}`, '_blank');
            
            // Mostrar mensaje de éxito
            responseElement.textContent = translations?.contact?.success || "¡Mensaje enviado con éxito!";
            responseElement.style.color = "#d4af37";
            contactForm.reset();
            
            // Efecto de confeti
            createConfetti();
        });
    }
    
    // Función de confeti para éxito en formulario
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

    // Configurar los botones de reserva para abrir WhatsApp con mensajes personalizados
    setupWhatsAppButtons();
});

// Función para configurar los botones de WhatsApp con mensajes personalizados
function setupWhatsAppButtons() {
    // Obtener todos los enlaces de reserva
    const bookLinks = document.querySelectorAll('.experience-card .btn-gold');
    
    // Obtener el idioma actual
    const currentLang = localStorage.getItem('selectedLanguage') || 'es';
    console.log('Idioma actual para WhatsApp:', currentLang);
    
    // Configurar cada enlace con su mensaje personalizado
    bookLinks.forEach((link, index) => {
        // Eliminar eventos anteriores para evitar duplicados
        if (link.clickHandler) {
            link.removeEventListener('click', link.clickHandler);
        }
        
        // Crear un nuevo manejador de eventos
        link.clickHandler = function(e) {
            e.preventDefault();
            
            // Obtener el idioma actual
            const currentLang = localStorage.getItem('selectedLanguage') || 'es';
            
            let messageKey;
            
            // Determinar qué mensaje usar según el índice del enlace
            switch(index) {
                case 0:
                    messageKey = 'boatMessage';
                    break;
                case 1:
                    messageKey = 'toursMessage';
                    break;
                case 2:
                    messageKey = 'dinnerMessage';
                    break;
                default:
                    messageKey = 'message';
            }
            
            // Obtener el mensaje traducido
            const message = translations[currentLang].whatsapp[messageKey];
            console.log('Mensaje de WhatsApp:', message);
            const encodedMessage = encodeURIComponent(message);
            
            // Abrir WhatsApp con el mensaje personalizado
            window.open(`https://wa.me/5491136267653?text=${encodedMessage}`, '_blank');
        };
        
        // Agregar el nuevo manejador de eventos
        link.addEventListener('click', link.clickHandler);
    });
}