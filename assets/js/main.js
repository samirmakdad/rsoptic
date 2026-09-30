/**
 * RS OPTIC — JavaScript Principal
 */

document.addEventListener('DOMContentLoaded', () => {
  // Année dynamique
  const a = document.getElementById('annee');
  if (a) a.textContent = new Date().getFullYear();

  initNav();
  initMobile();
  initScrollActif();
  initLightbox();
  initFormulaire();
  initBtnBlanc();
});

/* ── Navigation scroll ── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function maj() {
    if (window.scrollY > 50) {
      nav.classList.remove('sur-hero');
      nav.classList.add('defilé');
    } else {
      nav.classList.add('sur-hero');
      nav.classList.remove('defilé');
    }
  }
  window.addEventListener('scroll', maj, { passive: true });
  maj();
}

/* ── Menu mobile ── */
function initMobile() {
  const btn    = document.getElementById('hamburger');
  const menu   = document.getElementById('nav-liens');
  const fond   = document.getElementById('tiroir-fond');
  if (!btn || !menu) return;

  function ouvrir() {
    menu.classList.add('ouvert');
    fond && fond.classList.add('visible');
    btn.classList.add('ouvert');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function fermer() {
    menu.classList.remove('ouvert');
    fond && fond.classList.remove('visible');
    btn.classList.remove('ouvert');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => menu.classList.contains('ouvert') ? fermer() : ouvrir());
  fond && fond.addEventListener('click', fermer);
  menu.querySelectorAll('.nav-lien').forEach(l => l.addEventListener('click', fermer));
}

/* ── Scroll fluide & lien actif ── */
function initScrollActif() {
  // Scroll fluide
  document.querySelectorAll('a[href^="#"]').forEach(lien => {
    lien.addEventListener('click', e => {
      const id = lien.getAttribute('href');
      if (id === '#') return;
      const cible = document.querySelector(id);
      if (!cible) return;
      e.preventDefault();
      window.scrollTo({ top: cible.getBoundingClientRect().top + window.scrollY - 75, behavior: 'smooth' });
    });
  });

  // Lien actif
  const sections = document.querySelectorAll('section[id]');
  const liens    = document.querySelectorAll('.nav-lien');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        liens.forEach(l => l.classList.remove('actif'));
        const actif = document.querySelector(`.nav-lien[href="#${e.target.id}"]`);
        if (actif) actif.classList.add('actif');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ── Lightbox galerie ── */
function initLightbox() {
  const items = document.querySelectorAll('.gal');
  const lb    = document.getElementById('lightbox');
  if (!items.length || !lb) return;

  const lbImg     = document.getElementById('lb-img');
  const lbLegende = document.getElementById('lb-legende');
  const lbFermer  = document.getElementById('lb-fermer');
  const lbPrec    = document.getElementById('lb-prec');
  const lbSuiv    = document.getElementById('lb-suiv');

  let courant = 0;
  const data = Array.from(items).map(el => ({
    src: el.querySelector('img').src,
    alt: el.querySelector('img').alt,
    cap: el.dataset.caption || ''
  }));

  function montrer(i) {
    courant = (i + data.length) % data.length;
    lbImg.src = data[courant].src;
    lbImg.alt = data[courant].alt;
    lbLegende.textContent = data[courant].cap;
  }
  function ouvrir(i) { montrer(i); lb.classList.add('ouvert'); document.body.style.overflow = 'hidden'; }
  function fermer()  { lb.classList.remove('ouvert'); document.body.style.overflow = ''; }

  items.forEach((el, i) => el.addEventListener('click', () => ouvrir(i)));
  lbFermer && lbFermer.addEventListener('click', fermer);
  lbPrec   && lbPrec.addEventListener('click', () => montrer(courant - 1));
  lbSuiv   && lbSuiv.addEventListener('click', () => montrer(courant + 1));
  lb.addEventListener('click', e => { if (e.target === lb) fermer(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('ouvert')) return;
    if (e.key === 'Escape')      fermer();
    if (e.key === 'ArrowRight')  montrer(courant + 1);
    if (e.key === 'ArrowLeft')   montrer(courant - 1);
  });
}

/* ── Formulaire de contact ── */
function initFormulaire() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi…';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Message envoyé !';
      btn.style.background = '#25a244';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }, 1200);
  });
}

/* ── Correction classe btn-blanc manquante ── */
function initBtnBlanc() {
  // Assure que .btn-blanc fonctionne (white button)
  const style = document.createElement('style');
  style.textContent = `.btn-blanc{background:#fff;color:#111;border:1.5px solid #fff;} .btn-blanc:hover{background:#f0ece4;}`;
  document.head.appendChild(style);
}
