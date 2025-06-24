import leaflet from 'leaflet';

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Switcher ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggle.checked = true;
        }
    } else {
        // Default to dark
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        // Leaflet map needs invalidation after theme change to redraw tiles correctly
        setTimeout(() => {
            if(map) map.invalidateSize();
        }, 300);
    }

    themeToggle.addEventListener('change', switchTheme, false);

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('is-active');
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('is-active');
        });
    });


    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('main section');
    const navLi = document.querySelectorAll('#main-header nav .nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- Contact Form ---
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send form data to a server
        alert('Merci pour votre message ! Nous vous répondrons bientôt.');
        form.reset();
    });

    // --- Leaflet Interactive Map ---
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Kinshasa coordinates
    const lat = -4.32758;
    const lon = 15.31357;
    
    const map = leaflet.map('map').setView([lat, lon], 14);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const goldIcon = new leaflet.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    leaflet.marker([lat, lon], {icon: goldIcon}).addTo(map)
        .bindPopup('<b>Design Plus Entreprise</b><br>123, Avenue des Ambassadeurs, Gombe')
        .openPopup();
});

