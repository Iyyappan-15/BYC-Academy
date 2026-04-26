// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ===== HAMBURGER =====
const ham = document.getElementById('ham');
const navLinks = document.getElementById('navLinks');
if (ham) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ===== COUNTER ANIMATION (easing) =====
function animateCount(el) {
  const target = +el.dataset.target;
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ===== SCROLL REVEAL =====
const revealItems = document.querySelectorAll(
  '.subj-card,.testi-card,.mentor-card,.story-card,.ach-card,.legacy-point,.why-point,.contact-info-card,.contact-form-box,.info-card,.qs-item,.trust-badge,.map-wrapper'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }, 60 * (Array.from(revealItems).indexOf(e.target) % 6));
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

revealItems.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  revealObserver.observe(el);
});

// ===== CONTACT FORM – Google Apps Script (no API key needed) =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn        = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMsg');
    const errorMsg   = document.getElementById('errorMsg');

    // Hide previous messages
    successMsg.classList.remove('show');
    errorMsg.classList.remove('show');

    // Validate required fields
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const subject = form.querySelector('[name="inquiry_type"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !phone || !message) {
      errorMsg.textContent = '⚠️ Please fill in all required fields.';
      errorMsg.classList.add('show');
      setTimeout(() => errorMsg.classList.remove('show'), 5000);
      return;
    }

    // Button loading state
    btn.textContent   = '⏳ Sending...';
    btn.disabled      = true;
    btn.style.opacity = '0.75';

    // ── REPLACE THIS URL after deploying your Google Apps Script ──
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbztKc_wzdo2vS-LW6-uXlQ0H0qQuP4s2rolCYskAl07uE80h8blX_2xwxCXXbfEydi9/exec';

    try {
      const params = new URLSearchParams({ name, email, phone, inquiry_type: subject, message });

      // no-cors: Google Apps Script doesn't need to send back data to browser
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode:   'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      // Optimistically show success (email is delivered server-side)
      successMsg.textContent = '✅ Thank you! We\'ll get back to you within 24 hours.';
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg.classList.remove('show'), 6000);

    } catch (err) {
      errorMsg.textContent = '❌ Something went wrong. Please try again later.';
      errorMsg.classList.add('show');
      setTimeout(() => errorMsg.classList.remove('show'), 6000);
    } finally {
      btn.textContent   = '🚀 Submit Inquiry';
      btn.disabled      = false;
      btn.style.opacity = '1';
    }
  });
}

// ===== ABOUT MV GRID RESPONSIVE =====
const mvGrid = document.querySelector('.mv-grid');
if (mvGrid) {
  const fix = () => {
    mvGrid.style.gridTemplateColumns = window.innerWidth < 640 ? '1fr' : '1fr 1fr';
  };
  fix();
  window.addEventListener('resize', fix);
}


// ===== ACTIVE NAV HIGHLIGHT ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
if (sections.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 80) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });
}
