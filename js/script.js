// Mobile Menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Accordion
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    header.nextElementSibling.classList.toggle('active');
  });
});

// Search
document.getElementById('projectSearch')?.addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(term) ? 'block' : 'none';
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
document.querySelectorAll('.gallery-img').forEach(img => {
  img.onclick = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxImg.src = img.src;
  };
});
document.querySelector('.close')?.addEventListener('click', () => {
  if (!lightbox) return;
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden', 'true');
});
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
  }
});

// Enquiry form validation + AJAX fallback
function validateEnquiry() {
  const form = document.getElementById('enquiryForm');
  if (!form) return false;
  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const interest = form.querySelector('#interest').value;
  const message = form.querySelector('#message').value.trim();
  const responseDiv = document.getElementById('response');

  if (name.length < 2) { showEnquiryResponse('Please enter your name (min 2 chars)', true); return false; }
  if (!email.includes('@')) { showEnquiryResponse('Please enter a valid email', true); return false; }
  if (!interest) { showEnquiryResponse('Please select an interest', true); return false; }
  if (message.length < 10) { showEnquiryResponse('Message is too short', true); return false; }

  // optimistic UI
  showEnquiryResponse('Sending enquiry…');

  // try to POST to server endpoint; fallback to local response if no endpoint
  fetch('/submit-enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, interest, message, date: new Date().toISOString() })
  })
  .then(res => {
    if (!res.ok) throw new Error('Network response not ok');
    return res.json();
  })
  .then(data => {
    showEnquiryResponse(data.message || 'Your enquiry was sent. We will contact you shortly.');
    form.reset();
  })
  .catch(() => {
    // graceful fallback for static hosting: show contextual info
    const fallback = interest === 'sponsor'
      ? 'Thank you. Sponsoring a child costs R450. We will email payment details.'
      : interest === 'volunteer'
      ? 'Thank you for your interest in volunteering. We will get back with training dates.'
      : 'Thank you. We will reply with further details soon.';
    showEnquiryResponse(fallback);
    form.reset();
  });

  return false; // prevent normal submit
}

function showEnquiryResponse(msg, isError = false) {
  const d = document.getElementById('response');
  if (!d) return;
  d.style.display = 'block';
  d.style.background = isError ? '#ffe6e6' : '#e6f4ea';
  d.style.color = isError ? '#900' : '#064820';
  d.innerHTML = msg;
}

// Contact form: composes a mailto (existing behaviour) and validates client-side
function validateContact() {
  const form = document.getElementById('contactForm');
  if (!form) return false;
  const name = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const type = form.querySelector('#type').value;
  const msg = form.querySelector('#message').value.trim();

  if (name.length < 2) return showError('Name too short');
  if (!email.includes('@')) return showError('Invalid email');
  if (!type) return showError('Select message type');
  if (msg.length < 10) return showError('Message too short');

  const subject = encodeURIComponent(`Lisika Unite - ${type} enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  // open mail client
  window.open(`mailto:info@lisikaunite.org?subject=${subject}&body=${body}`, '_blank');
  form.reset();
  return false;
}

function showError(text) {
  const err = document.getElementById('contactError');
  if (!err) return false;
  err.style.display = 'block';
  err.textContent = text;
  return false;
}

// Map init (Leaflet)
function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;
  const center = [-23.9045, 29.4689]; // Polokwane approx
  const map = L.map(mapEl).setView(center, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  L.marker(center).addTo(map).bindPopup('Lisika Unite - Polokwane').openPopup();
}

// Run init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMap();
});