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
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  };
});
document.querySelector('.close')?.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});

// Form Responses
function validateEnquiry() {
  const interest = document.getElementById('interest').value;
  const div = document.getElementById('response');
  let msg = '';
  if (interest === 'sponsor') msg = 'Sponsoring 1 child = <strong>R450</strong>. We’ll send payment details.';
  else if (interest === 'volunteer') msg = 'Volunteers needed! Training is free.';
  else msg = 'Programs reach 500+ children. Download brochure.';
  div.innerHTML = msg; div.style.display = 'block';
  return false;
}

function validateContact() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value;
  const type = document.getElementById('type').value;
  const msg = document.getElementById('message').value.trim();
  const err = document.getElementById('contactError');

  if (name.length < 2) return showError('Name too short');
  if (!email.includes('@')) return showError('Invalid email');
  if (!type) return showError('Select message type');
  if (msg.length < 10) return showError('Message too short');

  const subject = encodeURIComponent(`Lisika: ${type}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  window.open(`mailto:info@lisikaunite.org?subject=${subject}&body=${body}`, '_blank');
  return false;
}

function showError(msg) {
  const err = document.getElementById('contactError');
  err.textContent = msg; err.style.display = 'block';
  return false;
}