/**
 * MATERIAL DESIGN 3 (M3) INTERACTION ENGINE & COMPONENT LOADER
 * Ferdi Nurul - Software Engineer (Mobile & Backend Specialist)
 * Modular Component Architecture
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Step 1: Load all modular components asynchronously
  await loadComponents();

  // Step 2: Initialize Material Design 3 UI controllers
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
   0. MODULAR HTML COMPONENT LOADER
   -------------------------------------------------------------------------- */
async function loadComponents() {
  const includeElements = document.querySelectorAll('[data-include]');
  
  const loadTasks = Array.from(includeElements).map(async (el) => {
    const filePath = el.getAttribute('data-include');
    if (!filePath) return;

    try {
      const response = await fetch(filePath);
      if (response.ok) {
        const html = await response.text();
        el.outerHTML = html;
      } else {
        console.error(`Failed to load component: ${filePath} (Status ${response.status})`);
      }
    } catch (err) {
      console.error(`Error fetching component ${filePath}:`, err);
    }
  });

  await Promise.all(loadTasks);
}

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
      showSnackbar(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
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
        showSnackbar(`${item.textContent.trim()} color theme applied!`);
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
    title: "USM SIMA Mobile App (Academic Management System)",
    subtitle: "Native Android & Web Portal for Universitas Semarang Academic Ecosystem",
    image: "assets/img/siakad.jpg",
    category: "Mobile & Enterprise System",
    description: "The core Academic Information Management System (SIMA) for Universitas Semarang. Serves thousands of active students and faculty members by streamlining course registrations (KRS), academic transcripts (KHS), real-time class timetables, and campus announcements.",
    features: [
      "Interactive mobile Course Registration (KRS) & automatic GPA calculation engine.",
      "Real-time class schedule, room location mapping, and lecture attendance notifications.",
      "Native Android architecture built with Kotlin & Java connecting to robust backend REST APIs.",
      "Integrated Single Sign-On (SSO) authentication for campus-wide security compliance."
    ],
    stack: ["Android (Kotlin/Java)", "PHP Laravel REST API", "MySQL Database", "JSON Web Services", "Gradle"],
    repoName: "AplikasiUsmSima",
    githubUrl: "https://github.com/ferdinurul23/AplikasiUsmSima"
  },
  presensi_doskar: {
    title: "USM Attendance & Faculty Performance App",
    subtitle: "GPS Geofencing Mobile Attendance & Performance Tracking System",
    image: "assets/img/eoffice.jpg",
    category: "Mobile & Enterprise HR",
    description: "Enterprise mobile workforce application designed for lecturers and staff (Doskar) at Universitas Semarang. Features location-aware GPS geofencing, real-time photo verification, and automated daily performance logbook submissions.",
    features: [
      "GPS Geofencing radius validation for automated clock-in/clock-out within campus bounds.",
      "Daily activity logging and automated HR performance report generation.",
      "Real-time leave request, sick leave, and overtime approval workflows.",
      "Push notification integration and HR administrative oversight dashboard."
    ],
    stack: ["Android Studio", "Kotlin", "Google Location Services API", "Laravel API Engine", "MySQL"],
    repoName: "AplikasiUsmPresensiKinerjaDoskar",
    githubUrl: "https://github.com/ferdinurul23/AplikasiUsmPresensiKinerjaDoskar"
  },
  usm_eksekutif: {
    title: "USM Executive Analytics Dashboard",
    subtitle: "Executive Information System (EIS) for University Leadership",
    image: "assets/img/inventory.jpg",
    category: "Mobile & Executive Analytics",
    description: "Executive mobile dashboard empowering university chancellors and board members with real-time key performance indicators (KPIs), student enrollment growth analytics, GPA distributions, and faculty productivity metrics.",
    features: [
      "Real-time visual data analytics for new student enrollment and growth trends.",
      "GPA distribution statistics broken down by faculty and academic departments.",
      "Faculty attendance performance and institutional productivity metrics.",
      "High-security encrypted data transmission designed for executive access."
    ],
    stack: ["Android (Kotlin)", "RESTful API Backend", "Chart Analytics Engine", "JSON Data Engine"],
    repoName: "AplikasiUsmEksekutif",
    githubUrl: "https://github.com/ferdinurul23/AplikasiUsmEksekutif"
  },
  tracer_backend: {
    title: "Tracer Study Backend API Engine",
    subtitle: "High-Performance RESTful API for Alumni Tracking & University Accreditation",
    image: "assets/img/rest_api.jpg",
    category: "Backend & API Architecture",
    description: "Architected and built the backend API system for the Universitas Semarang Alumni Tracer Study platform. Manages graduate survey data collection, employment metrics, and generates institutional accreditation compliance reports.",
    features: [
      "Secure authentication using Laravel Sanctum and token management.",
      "Dynamic questionnaire engine for graduate and employer feedback collection.",
      "Automated statistics aggregation and reporting in JSON and Excel formats.",
      "Optimized database indexing ensuring fast query responses under high loads."
    ],
    stack: ["PHP 8.x", "Laravel Framework", "Laravel Sanctum", "MySQL Database", "Postman Documentation"],
    repoName: "tracer_backend",
    githubUrl: "https://github.com/ferdinurul23/tracer_backend"
  },
  acarain: {
    title: "Acarain Web Event & Ticketing Portal",
    subtitle: "Full-Stack Event Management Platform Built with Laravel",
    image: "assets/img/siakad.jpg",
    category: "Web Application",
    description: "A comprehensive event management web platform enabling event organizers to publish events, manage online attendee registrations, process ticket bookings, and automatically issue digital e-tickets.",
    features: [
      "Interactive event discovery catalog with real-time category filtering and search.",
      "Online participant registration form with payment verification integration.",
      "Automated e-ticket generation and digital certificate issuance.",
      "Admin control panel for attendee tracking and ticket analytics."
    ],
    stack: ["Laravel Framework", "MySQL Database", "Webpack Mix", "Bootstrap", "Blade Engine"],
    repoName: "acarainweb",
    githubUrl: "https://github.com/ferdinurul23/acarainweb"
  },
  ucac_jobs: {
    title: "UCAC Career & Job Placement Portal",
    subtitle: "Campus Recruitment & Alumni Employment Platform",
    image: "assets/img/eoffice.jpg",
    category: "Web Application & Career",
    description: "Official career and job placement web portal for USM Career & Alumni Center (UCAC). Connects corporate hiring partners with university graduates for job vacancies and internship programs.",
    features: [
      "Employer partner portal for publishing job openings and internship listings.",
      "Online job application workflow with automated CV submission for alumni.",
      "Campus hiring event notifications and interview scheduling system.",
      "Applicant tracking dashboard for the UCAC career development team."
    ],
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap UI"],
    repoName: "ucac_jobs",
    githubUrl: "https://github.com/ferdinurul23/ucac_jobs"
  },
  presensi_dpu: {
    title: "DPU & Election Field Attendance System",
    subtitle: "Location-Aware Mobile Attendance App for Field Operations",
    image: "assets/img/inventory.jpg",
    category: "Mobile Operations",
    description: "Mobile attendance tracking solution designed for field workers at the Public Works Department (DPU) and election operational personnel. Utilizes location verification and photo capturing.",
    features: [
      "GPS location tracking paired with camera photo snapshot verification.",
      "Field task assignment logging and daily attendance record history.",
      "Offline data buffer mechanism ensuring seamless operation in low-connectivity areas."
    ],
    stack: ["Android Studio", "Java / Kotlin", "Google Location Services API", "REST API"],
    repoName: "PresensiKerjaDpu",
    githubUrl: "https://github.com/ferdinurul23/PresensiKerjaDpu"
  },
  madeinblora: {
    title: "Made in Blora SME Mobile Showcase",
    subtitle: "Digital Catalog Mobile App for Local Blora MSME Products",
    image: "assets/img/rest_api.jpg",
    category: "Mobile Application",
    description: "Mobile catalog application designed to showcase and promote local MSME products from the Blora region, expanding digital market reach for local artisans and entrepreneurs.",
    features: [
      "Categorized product catalog showcasing local handicrafts, textiles, and culinary items.",
      "Direct WhatsApp integration connecting buyers straight to local business owners.",
      "Fluid, lightweight mobile UI optimized for smooth performance on all Android devices."
    ],
    stack: ["Android (Java/Kotlin)", "REST API", "JSON Data Engine"],
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
      
      showSnackbar(`Thank you, ${name}! Your message has been sent successfully.`);
      form.reset();
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('ferdinurul23@gmail.com').then(() => {
        showSnackbar('Email address ferdinurul23@gmail.com copied to clipboard!');
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