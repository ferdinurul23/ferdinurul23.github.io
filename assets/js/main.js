/**
 * MATERIAL DESIGN 3 (M3) INTERACTION ENGINE
 * Ferdi Nurul - Web & Backend Engineer Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initDynamicPalette();
  initRippleEffect();
  initScrollEffects();
  initProjectModal();
  initFilterChips();
  initContactForm();
  initMobileDrawer();
});

/* --------------------------------------------------------------------------
   1. THEME & PALETTE MANAGERS
   -------------------------------------------------------------------------- */
function initThemeSystem() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-toggle-icon');
  
  // Saved or system preference
  const savedTheme = localStorage.getItem('m3-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showSnackbar(`Mode ${newTheme === 'dark' ? 'Gelap' : 'Terang'} diaktifkan`);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('m3-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }
}

function initDynamicPalette() {
  const paletteBtn = document.getElementById('palette-btn');
  const palettePopover = document.getElementById('palette-popover');
  const paletteItems = document.querySelectorAll('.palette-item');

  const savedPalette = localStorage.getItem('m3-palette') || 'default';
  if (savedPalette !== 'default') {
    document.documentElement.setAttribute('data-palette', savedPalette);
  }

  if (paletteBtn && palettePopover) {
    paletteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      palettePopover.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!palettePopover.contains(e.target) && e.target !== paletteBtn) {
        palettePopover.classList.remove('open');
      }
    });

    paletteItems.forEach(item => {
      item.addEventListener('click', () => {
        const palette = item.getAttribute('data-palette-val');
        if (palette === 'default') {
          document.documentElement.removeAttribute('data-palette');
        } else {
          document.documentElement.setAttribute('data-palette', palette);
        }
        localStorage.setItem('m3-palette', palette);
        palettePopover.classList.remove('open');
        showSnackbar(`Tema warna ${item.textContent.trim()} diterapkan!`);
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. MATERIAL INK RIPPLE EFFECT
   -------------------------------------------------------------------------- */
function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.md-ripple');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('md-ripple-ink');

    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - rect.left - radius}px`;
    ripple.style.top = `${e.clientY - rect.top - radius}px`;

    target.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL & NAVIGATION EFFECTS
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const topAppBar = document.getElementById('top-app-bar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const fab = document.getElementById('scroll-top-fab');

  window.addEventListener('scroll', () => {
    // Top Bar Scrolled State
    if (window.scrollY > 40) {
      topAppBar?.classList.add('scrolled');
      fab?.style.setProperty('display', 'flex');
    } else {
      topAppBar?.classList.remove('scrolled');
      fab?.style.setProperty('display', 'none');
    }

    // Scrollspy Navigation
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (fab) {
    fab.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   4. FILTER CHIPS (PROJECTS & SKILLS)
   -------------------------------------------------------------------------- */
function initFilterChips() {
  // Project Filtering
  const projectChips = document.querySelectorAll('.project-chip');
  const projectCards = document.querySelectorAll('.project-card');

  projectChips.forEach(chip => {
    chip.addEventListener('click', () => {
      projectChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. PROJECT DETAILS MODAL DIALOG
   -------------------------------------------------------------------------- */
const projectDetailsData = {
  siakad: {
    title: "Sistem Informasi Akademik & Portal Kampus (SIAKAD)",
    subtitle: "Enterprise Academic Management System",
    image: "assets/img/siakad.jpg",
    category: "Backend & Academic System",
    description: "Sistem Manajemen Akademik berbasis web yang dirancang untuk mengelola seluruh siklus akademik perguruan tinggi. Meliputi modul KRS/KHS, manajemen kurikulum RPS, penilaian otomatis, serta integrasi sinkronisasi data dengan Feeder Dikti.",
    features: [
      "Sinkronisasi data otomatis dengan web service Dikti/Kemdikbud via REST API.",
      "Modul KRS & KHS interaktif dengan perhitungan IPK/IPS otomatis.",
      "Role-Based Access Control (RBAC) untuk Dosen, Mahasiswa, dan Staff Admin.",
      "Optimasi query database MySQL untuk menangani ribuan mahasiswa aktif saat masa KRS."
    ],
    stack: ["PHP 8.2", "Laravel 10", "MySQL", "REST API Feeder", "Bootstrap/Material UI", "Redis Cache"],
    demoUrl: "#",
    githubUrl: "https://github.com/ferdinurul23"
  },
  rest_api: {
    title: "High-Performance REST API Gateway",
    subtitle: "Secure & Scalable Microservices API",
    image: "assets/img/rest_api.jpg",
    category: "Backend & API Architecture",
    description: "Arsitektur RESTful API performa tinggi untuk integrasi layanan antar-sistem. Dilengkapi dengan autentikasi berbasis JWT (JSON Web Tokens), rate limiting, logging terstruktur, dan validasi data ketat.",
    features: [
      "Autentikasi aman JWT & Refresh Token rotation.",
      "Custom Rate Limiting & Throttling middleware untuk perlindungan DDoS.",
      "Dokumentasi API interaktif berbasis OpenAPI/Swagger Specification.",
      "Response time rata-rata di bawah 80ms dengan strategi caching Redis."
    ],
    stack: ["Laravel REST API", "JWT Auth", "PostgreSQL", "Redis", "Swagger/OpenAPI", "Docker"],
    demoUrl: "#",
    githubUrl: "https://github.com/ferdinurul23"
  },
  inventory: {
    title: "Dashboard Fleet & Inventory Monitoring",
    subtitle: "Real-time Asset Tracking & Reporting Engine",
    image: "assets/img/inventory.jpg",
    category: "Enterprise Dashboard",
    description: "Aplikasi manajemen stok dan armada logistik perusahaan. Menyediakan pemantauan stok barang masuk/keluar, peringatan otomatis stok kritis, serta generator laporan PDF/Excel interaktif.",
    features: [
      "Dashboard analytics visual dengan grafik real-time.",
      "Modul ekspor laporan otomatis (PDF & Excel format).",
      "Audit trail log pergerakan aset dan riwayat barang.",
      "Integrasi scanner barcode / QR code web-based."
    ],
    stack: ["Laravel", "Vue.js", "MySQL", "Chart.js", "DOMPDF", "Bootstrap"],
    demoUrl: "#",
    githubUrl: "https://github.com/ferdinurul23"
  },
  eoffice: {
    title: "Smart Attendance & E-Office System",
    subtitle: "Web-Based Geolocation Attendance & Leave Approval",
    image: "assets/img/eoffice.jpg",
    category: "Web Application",
    description: "Sistem presensi karyawan dan manajemen surat dinas berbasis web. Dilengkapi dengan validasi lokasi berbasis Geolocation GPS, foto selfie presensi, serta alur persetujuan (approval workflow) bertingkat.",
    features: [
      "Presensi berbasis radius lokasi (Geofencing GPS) dan bukti foto.",
      "Workflow pengajuan izin, cuti, dan lembur secara real-time.",
      "Notifikasi otomatis via Email & Telegram Bot API.",
      "Laporan rekapitulasi kehadiran bulanan otomatis."
    ],
    stack: ["PHP Laravel", "Leaflet JS Maps", "MySQL", "Telegram Bot API", "Tailwind CSS"],
    demoUrl: "#",
    githubUrl: "https://github.com/ferdinurul23"
  }
};

function initProjectModal() {
  const modalScrim = document.getElementById('project-modal-scrim');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modalScrim) return;

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      const data = projectDetailsData[projectId];
      if (!data) return;

      document.getElementById('modal-img').src = data.image;
      document.getElementById('modal-category').textContent = data.category;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-subtitle').textContent = data.subtitle;
      document.getElementById('modal-desc').textContent = data.description;

      // Features
      const featuresList = document.getElementById('modal-features');
      featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

      // Tech Stack Tags
      const stackContainer = document.getElementById('modal-stack');
      stackContainer.innerHTML = data.stack.map(s => `<span class="tech-tag">${s}</span>`).join('');

      // Github link
      document.getElementById('modal-github-link').href = data.githubUrl;

      modalScrim.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  modalScrim.addEventListener('click', (e) => {
    if (e.target === modalScrim) closeModal();
  });

  function closeModal() {
    modalScrim.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM & UTILS
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      
      showSnackbar(`Terima kasih ${name}! Pesan Anda telah berhasil terkirim.`);
      form.reset();
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('ferdinurul23@gmail.com').then(() => {
        showSnackbar('Email ferdinurul23@gmail.com disalin ke clipboard!');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   7. MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-drawer-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const scrim = document.getElementById('mobile-drawer-scrim');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (toggleBtn && drawer && scrim) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      scrim.classList.add('open');
    });

    scrim.addEventListener('click', closeDrawer);
    drawerLinks.forEach(l => l.addEventListener('click', closeDrawer));

    function closeDrawer() {
      drawer.classList.remove('open');
      scrim.classList.remove('open');
    }
  }
}

/* --------------------------------------------------------------------------
   8. TOAST SNACKBAR NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function showSnackbar(message) {
  let snackbar = document.getElementById('m3-snackbar');
  if (!snackbar) {
    snackbar = document.createElement('div');
    snackbar.id = 'm3-snackbar';
    snackbar.className = 'm3-snackbar';
    document.body.appendChild(snackbar);
  }

  snackbar.innerHTML = `
    <span class="material-symbols-outlined">info</span>
    <span>${message}</span>
  `;

  snackbar.classList.add('show');
  setTimeout(() => {
    snackbar.classList.remove('show');
  }, 3500);
}