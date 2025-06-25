// common.js
document.addEventListener('DOMContentLoaded', () => {
    // Code du menu mobile
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('is-active');
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('is-active');
            });
        });
    }
    
    // Code du thème
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            localStorage.setItem('theme', newTheme);
        });
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
});


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

document.addEventListener('DOMContentLoaded', setActiveNavItem);