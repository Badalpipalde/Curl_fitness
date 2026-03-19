/* ================================================
   CURL FITNESS — main.js
   Handles: Loader, Navbar, AOS, Back-to-Top, Forms
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loading Screen ---- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
  }

  /* ---- Sticky Navbar ---- */
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Back-to-top button
    const btt = document.getElementById('backToTop');
    if (btt) {
      btt.classList.toggle('visible', window.scrollY > 400);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on init

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Hamburger Mobile Menu ---- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  const overlay   = document.querySelector('.nav-overlay');

  if (hamburger && navLinks) {
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    };
    hamburger.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
      document.body.style.overflow = '';
    }));
  }

  /* ---- Back to Top ---- */
  const btt = document.getElementById('backToTop');
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- AOS-like Scroll Animations ---- */
  // Simple, light-weight intersection observer (no external library needed)
  const observeElements = () => {
    const items = document.querySelectorAll('[data-aos]');
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.aosDelay ? parseInt(el.dataset.aosDelay) : 0;
          setTimeout(() => el.classList.add('aos-animate'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(el => {
      const anim = el.dataset.aos || 'fade-up';
      // Set initial hidden transforms
      switch (anim) {
        case 'fade-up':    el.style.transform = 'translateY(40px)'; break;
        case 'fade-down':  el.style.transform = 'translateY(-40px)'; break;
        case 'fade-left':  el.style.transform = 'translateX(40px)'; break;
        case 'fade-right': el.style.transform = 'translateX(-40px)'; break;
        case 'zoom-in':    el.style.transform = 'scale(0.85)'; break;
        case 'zoom-out':   el.style.transform = 'scale(1.1)'; break;
        default:           el.style.transform = 'translateY(30px)'; break;
      }
      const dur = el.dataset.aosDuration ? parseInt(el.dataset.aosDuration) : 700;
      el.style.transitionDuration = dur + 'ms';
      el.style.transitionTimingFunction = 'cubic-bezier(0.4,0,0.2,1)';
      io.observe(el);
    });

    // When animated, reset transform
    document.querySelectorAll('[data-aos].aos-animate').forEach(el => {
      el.style.transform = 'none';
    });
  };

  // Re-apply on animate
  const style = document.createElement('style');
  style.textContent = '[data-aos].aos-animate { transform: none !important; opacity: 1 !important; }';
  document.head.appendChild(style);
  observeElements();

  /* ---- Counter Animation ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = 16;
    const increments = Math.ceil(duration / step);
    let current = 0;
    const inc = target / increments;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, step);
  }

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      // Simulate send
      setTimeout(() => {
        this.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.style.display = 'block';
      }, 1500);
    });
  }

  /* ---- Smooth hover counter on stat numbers (hero) ---- */
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (statNums.length) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); sio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    statNums.forEach(n => sio.observe(n));
  }

});
