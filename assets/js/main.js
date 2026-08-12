/**
 * MATERIAL DESIGN 3 (M3) INTERACTION ENGINE
 * Ferdi Nurul - Software Engineer (Mobile & Backend Specialist)
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
    if (window.scrollY > 40) {
      topAppBar?.classList.add('scrolled');
      fab?.style.setProperty('display', 'flex');
    } else {
      topAppBar?.classList.remove('scrolled');
      fab?.style.setProperty('display', 'none');
    }

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
   5. REAL GITHUB REPOSITORY PROJECT DETAILS
   -------------------------------------------------------------------------- */
const projectDetailsData = {
  sima: {
    title: "Aplikasi USM SIMA (Sistem Informasi Manajemen Akademik)",
    subtitle: "Aplikasi Mobile & Web Portal Akademik Universitas Semarang",
    image: "assets/img/siakad.jpg",
    category: "Mobile & Sistem Kampus",
    description: "Sistem Informasi Manajemen Akademik (SIMA) utama Universitas Semarang untuk memfasilitasi mahasiswa dan dosen dalam proses perkuliahan, pengisian KRS online, melihat KHS & Transkrip, serta jadwal ujian dan pengumuman kampus.",
    features: [
      "Modul KRS & KHS online interaktif dengan perhitungan IPK otomatis.",
      "Jadwal kuliah, lokasi ruang, serta notifikasi presensi perkuliahan real-time.",
      "Arsitektur Mobile Android berbasis Kotlin & Java dengan komunikasi REST API.",
      "Integrasi sistem otentikasi akun tunggal (SSO) civitas akademika USM."
    ],
    stack: ["Android (Kotlin/Java)", "PHP Laravel API", "MySQL", "REST API", "Gradle"],
    repoName: "AplikasiUsmSima",
    githubUrl: "https://github.com/ferdinurul23/AplikasiUsmSima"
  },
  presensi_doskar: {
    title: "Aplikasi USM Presensi & Kinerja Doskar",
    subtitle: "Sistem Presensi Geofencing GPS & Log Kinerja Dosen / Karyawan USM",
    image: "assets/img/eoffice.jpg",
    category: "Mobile & Enterprise",
    description: "Aplikasi mobile presensi dan pelaporan kinerja harian Dosen dan Karyawan (Doskar) di lingkungan Universitas Semarang. Menggunakan verifikasi geofencing GPS dan foto presensi otomatis.",
    features: [
      "Presensi masuk & pulang berbasis geofencing radius lokasi kampus USM.",
      "Pencatatan dan pengajuan log kinerja harian serta laporan kepegawaian.",
      "Workflow pengajuan izin, sakit, dan lembur secara real-time.",
      "Integrasi notifikasi presensi dan dashboard verifikasi admin HRD."
    ],
    stack: ["Android Studio", "Kotlin", "Geofencing GPS API", "PHP Laravel API", "MySQL"],
    repoName: "AplikasiUsmPresensiKinerjaDoskar",
    githubUrl: "https://github.com/ferdinurul23/AplikasiUsmPresensiKinerjaDoskar"
  },
  usm_eksekutif: {
    title: "Aplikasi USM Eksekutif",
    subtitle: "Dashboard Executive Information System Rektorat USM",
    image: "assets/img/inventory.jpg",
    category: "Mobile & Executive Dashboard",
    description: "Aplikasi mobile dashboard untuk jajaran pimpinan dan rektorat Universitas Semarang guna memantau indikator kinerja utama (KPI) universitas, statistik pendaftaran mahasiswa, grafik IPK, dan data kepegawaian.",
    features: [
      "Visualisasi analitik grafik pendaftaran & pertumbuhan mahasiswa baru.",
      "Ringkasan statistik IPK per fakultas/program studi secara real-time.",
      "Monitoring performa kehadiran dan kinerja dosen/karyawan.",
      "Format tampilan dashboard eksklusif dengan keamanan tinggi."
    ],
    stack: ["Android Kotlin", "RESTful API Backend", "Chart Engine", "JSON API"],
    repoName: "AplikasiUsmEksekutif",
    githubUrl: "https://github.com/ferdinurul23/AplikasiUsmEksekutif"
  },
  tracer_backend: {
    title: "Tracer Study Backend API System",
    subtitle: "RESTful API Engine Pelacakan Alumni & Akreditasi Kampus",
    image: "assets/img/rest_api.jpg",
    category: "Backend & API Architecture",
    description: "Sistem backend API untuk platform Tracer Study Universitas Semarang. Berfungsi mengelola survei penelusuran alumni, riwayat pekerjaan lulusan, serta menghasilkan data pendukung akreditasi perguruan tinggi.",
    features: [
      "Autentikasi API aman berbasis Laravel Sanctum & token management.",
      "Modul kuesioner dinamis untuk pengumpulan umpan balik alumni & pengguna lulusan.",
      "Export data rekapitulasi statistik dalam format JSON & Excel.",
      "Struktur database terindeks untuk query responsif."
    ],
    stack: ["PHP 8.x", "Laravel", "Laravel Sanctum", "MySQL Database", "Postman Collection"],
    repoName: "tracer_backend",
    githubUrl: "https://github.com/ferdinurul23/tracer_backend"
  },
  acarain: {
    title: "Acarain Web Event Portal",
    subtitle: "Platform Manajemen Event & Registrasi Tiket Berbasis Web",
    image: "assets/img/siakad.jpg",
    category: "Web Application",
    description: "Sistem informasi pengelolaan kegiatan dan webinar (*event management*) berbasis Laravel. Memungkinkan penyelenggara memublikasikan acara, pendaftaran peserta online, serta penerbitan e-ticket.",
    features: [
      "Katalog event interaktif dengan pencarian dan filter kategori.",
      "Formulir pendaftaran peserta & verifikasi pembayaran tiket.",
      "Generator e-ticket dan sertifikat otomatis.",
      "Dashboard admin manajemen peserta dan statistik penjualan tiket."
    ],
    stack: ["Laravel Framework", "MySQL", "Webpack Mix", "Bootstrap", "Blade"],
    repoName: "acarainweb",
    githubUrl: "https://github.com/ferdinurul23/acarainweb"
  },
  ucac_jobs: {
    title: "UCAC Career & Job Placement Portal",
    subtitle: "Portal Lowongan Kerja USM Career & Alumni Center",
    image: "assets/img/eoffice.jpg",
    category: "Web Application & Career",
    description: "Portal karir dan rekrutmen khusus lulusan Universitas Semarang di bawah naungan USM Career & Alumni Center (UCAC). Memfasilitasi perusahaan mitra memposting lowongan dan alumni melamar kerja.",
    features: [
      "Portal pendaftaran perusahaan mitra & posting lowongan kerja.",
      "Modul lamaran online & unggah CV bagi alumni USM.",
      "Notifikasi informasi rekrutmen kampus & jadwal interview.",
      "Dashboard pengelolaan data pelamar untuk tim UCAC."
    ],
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap UI"],
    repoName: "ucac_jobs",
    githubUrl: "https://github.com/ferdinurul23/ucac_jobs"
  },
  presensi_dpu: {
    title: "Presensi Kerja DPU & Pemilu",
    subtitle: "Aplikasi Monitoring Kehadiran Petugas Lapangan",
    image: "assets/img/inventory.jpg",
    category: "Mobile & Field Operations",
    description: "Aplikasi presensi dan pemantauan kehadiran kerja berbasis lokasi untuk petugas dinas pekerjaan umum (DPU) dan tim operasional pemilu di lapangan.",
    features: [
      "Presensi lokasi GPS dengan verifikasi foto snapshot lapangan.",
      "Pencatatan lokasi penugasan dan riwayat presensi harian.",
      "Offline sync buffer saat terkendala jaringan internet."
    ],
    stack: ["Android Studio", "Java/Kotlin", "Location Services GPS", "REST API"],
    repoName: "PresensiKerjaDpu",
    githubUrl: "https://github.com/ferdinurul23/PresensiKerjaDpu"
  },
  madeinblora: {
    title: "Made in Blora App",
    subtitle: "Aplikasi Mobile Katalog & Promotional Showcase UMKM Blora",
    image: "assets/img/rest_api.jpg",
    category: "Mobile Application",
    description: "Aplikasi mobile showcase dan katalog produk lokal karya UMKM Kabupaten Blora untuk memperluas jangkauan pemasaran produk daerah secara digital.",
    features: [
      "Katalog produk kerajinan & kuliner khas Blora dengan foto berkategori.",
      "Informasi kontak langsung ke penjual/pengrajin lokal via WhatsApp.",
      "Tampilan UI responsif dan ringan digunakan di berbagai perangkat Android."
    ],
    stack: ["Android (Java/Kotlin)", "REST API", "JSON Data"],
    repoName: "madeinbloraApp",
    githubUrl: "https://github.com/ferdinurul23/madeinbloraApp"
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

      const featuresList = document.getElementById('modal-features');
      featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

      const stackContainer = document.getElementById('modal-stack');
      stackContainer.innerHTML = data.stack.map(s => `<span class="tech-tag">${s}</span>`).join('');

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