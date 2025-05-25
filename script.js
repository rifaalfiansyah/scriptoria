function changeLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('language', lang);
    applyTranslations(lang);
  } else {
    console.warn(`Language "${lang}" not supported.`);
  }
}

function applyTranslations(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'H2' && key === 'quotes') {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Update chapter list if present
  const chapterList = document.getElementById('chapter-list');
  if (chapterList) {
    const items = chapterList.querySelectorAll('li');
    items.forEach((item, index) => {
      item.textContent = `${translations[lang].chapterPrefix} ${index + 1}`;
      item.setAttribute('aria-label', `Select ${translations[lang].chapterPrefix} ${index + 1}`);
    });
  }
}

function toggleTheme() {
  const icon = document.querySelector('.theme-toggle i');
  const isDark = document.body.classList.toggle('dark-theme');
  if (isDark) {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    localStorage.setItem('theme', 'light');
  }
}

function toggleMenu() {
  const navMenu = document.querySelector('.nav-menu');
  const menuIconI = document.querySelector('.menu-icon i');
  const isActive = navMenu.classList.toggle('active');
  menuIconI.classList.toggle('fa-bars', !isActive);
  menuIconI.classList.toggle('fa-times', isActive);
  document.body.style.overflow = isActive ? 'hidden' : '';
  navMenu.setAttribute('aria-hidden', !isActive);
}

function throttle(fn, wait) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < wait) return;
    lastCall = now;
    return fn(...args);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('language') || 'en';
  document.getElementById('lang-select').value = lang;
  applyTranslations(lang);

  const savedTheme = localStorage.getItem('theme');
  const icon = document.querySelector('.theme-toggle i');
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    document.body.classList.add('dark-theme');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }

  document.querySelector('.menu-icon').addEventListener('click', toggleMenu);
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-menu').classList.remove('active');
      document.querySelector('.menu-icon i').classList.remove('fa-times');
      document.querySelector('.menu-icon i').classList.add('fa-bars');
      document.body.style.overflow = '';
      document.querySelector('.nav-menu').setAttribute('aria-hidden', 'true');
    });
  });

  document.addEventListener('click', (event) => {
    const navMenu = document.querySelector('.nav-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const themeToggle = document.querySelector('.theme-toggle');
    const isNavMenuActive = navMenu.classList.contains('active');
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnMenuIcon = menuIcon.contains(event.target);
    const isClickOnThemeToggle = themeToggle.contains(event.target);

    if (isNavMenuActive && !isClickInsideNav && !isClickOnMenuIcon && !isClickOnThemeToggle) {
      toggleMenu();
    }
  });

  window.addEventListener(
    'scroll',
    throttle(() => {
      const header = document.querySelector('header');
      if (window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, 100)
  );

  if (!window.FontAwesome) {
    console.warn('Font Awesome failed to load.');
    document.querySelectorAll('.fa, .fas').forEach(icon => {
      icon.textContent = ' ';
    });
  }
});