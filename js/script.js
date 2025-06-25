import leaflet from 'leaflet';

// Script principal Design Plus – menu mobile, navigation active, formulaire et carte
document.addEventListener('DOMContentLoaded', () => {
  // Initialisation EmailJS (remplacez par votre clé publique)
  emailjs.init('YOUR_PUBLIC_KEY');
  /* ---------- MENU MOBILE ---------- */
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('is-active');
    });
    navLinks.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('is-active');
      })
    );
  }

  /* ---------- LIEN ACTIF AU SCROLL ---------- */
  const sections   = document.querySelectorAll('main section');
  const navAnchors = document.querySelectorAll('#main-header nav .nav-links li a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (pageYOffset >= section.offsetTop - 100) current = section.id;
    });
    navAnchors.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href').includes(current))
    );
  });

  /* ---------- FORMULAIRE CONTACT ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const serviceId  = 'YOUR_SERVICE_ID';
      const templateId = 'YOUR_TEMPLATE_ID';
      const templateParams = {
        from_name: form.name.value,
        from_email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
      };
      emailjs.send(serviceId, templateId, templateParams)
        .then(() => {
          alert('Votre message a bien été envoyé, merci !');
          form.reset(); 
        })
        .catch(() => alert('Erreur lors de l\'envoi, veuillez réessayer plus tard.'));
    });
  }

  /* ---------- CARTE LEAFLET ---------- */
  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    const lat = -4.32758, lon = 15.31357;
    const map = leaflet.map('map').setView([lat, lon], 14);
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const goldIcon = new leaflet.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    leaflet
      .marker([lat, lon], { icon: goldIcon })
      .addTo(map)
      .bindPopup('<b>Design Plus Entreprise</b><br>01, Avenue Dumi, Gombe')
      .openPopup();
  }
});