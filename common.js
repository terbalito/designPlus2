// common.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestion du menu mobile
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
hamburger.addEventListener('click', (e) => {
  console.log('>> clic sur hamburger');
  e.stopPropagation(); // Empêche la propagation du clic
            
            // Basculer l'état du menu
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('is-active');
            
            // Empêcher le défilement du corps lorsque le menu est ouvert
            document.body.classList.toggle('menu-open');
            
            // Fermer le menu si on clique en dehors
            if (navLinks.classList.contains('active')) {
                document.addEventListener('click', closeMenuOnClickOutside);
            } else {
                document.removeEventListener('click', closeMenuOnClickOutside);
            }
        });
        
        // Fonction pour fermer le menu lorsqu'on clique à l'extérieur
        function closeMenuOnClickOutside(event) {
            if (!navLinks.contains(event.target) && 
                !hamburger.contains(event.target) &&
                navLinks.classList.contains('active')) {
                closeMenu();
            }
        }
        
        // Fonction pour fermer le menu
        function closeMenu() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('is-active');
            document.body.classList.remove('menu-open');
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
        
        // Fermer le menu au clic sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }
    
    // 2. Navigation active au défilement
    const sections = document.querySelectorAll('main section');
    const navAnchors = document.querySelectorAll('#main-header nav .nav-links li a');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Ajout d'un seuil plus précis
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navAnchors.forEach(a => {
            a.classList.remove('active');
            const href = a.getAttribute('href');
            
            // Gère les liens internes et externes
            if (href.includes('#') && href.split('#')[1] === current) {
                a.classList.add('active');
            } else if (href === window.location.pathname && !current) {
                // Pour la page d'accueil
                a.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);
    
    // 3. Basculer le thème
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            
            // Sauvegarder la préférence
            localStorage.setItem('theme', newTheme);
        });
        
        // Charger le thème sauvegardé
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    
    // // 4. Gestion du formulaire
    // const contactForm = document.getElementById('contact-form');
    // if (contactForm) {
    //     contactForm.addEventListener('submit', (e) => {
    //         e.preventDefault();
            
    //         // Simulation d'envoi
    //         setTimeout(() => {
    //             alert('Merci pour votre message ! Nous vous contacterons très rapidement.');
    //             contactForm.reset();
    //         }, 500);
    //     });
    // }
    
    // 5. Gestion du header transparent sur l'image
    const header = document.getElementById('main-header');
    const heroSection = document.getElementById('home');
    
    if (heroSection) {
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    header.classList.remove('transparent');
                    if (themeToggle) themeToggle.classList.remove('transparent');
                } else {
                    header.classList.add('transparent');
                    if (themeToggle) themeToggle.classList.add('transparent');
                }
            });
        }, {
            threshold: 0.1,
        });
        
        headerObserver.observe(heroSection);
    } else {
        // Si pas de section hero, garder le header normal
        header.classList.remove('transparent');
        if (themeToggle) themeToggle.classList.remove('transparent');
    }
    
    // 6. Observer pour les animations de fade-in
    const fadeSections = document.querySelectorAll('.fade-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
    });
    
    fadeSections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // 7. Initialisation du scroll au chargement
    window.addEventListener('load', () => {
        if (heroSection && window.scrollY > heroSection.offsetHeight * 0.9) {
            header.classList.remove('transparent');
            if (themeToggle) themeToggle.classList.remove('transparent');
        } else {
            header.classList.add('transparent');
            if (themeToggle) themeToggle.classList.add('transparent');
        }
    });
    
    // 8. Navigation par page
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop();
        const navAnchors = document.querySelectorAll('#main-header nav .nav-links li a');
        
        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === currentPage || 
               (currentPage === 'index.html' && a.getAttribute('href') === '#home')) {
                a.classList.add('active');
            }
        });
    }
    
    setActiveNavItem();
});