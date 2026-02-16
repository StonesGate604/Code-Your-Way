const root = document.documentElement;
const toggleButton = document.querySelector('.theme-toggle');
const toggleText = document.querySelector('.theme-toggle__text');
const toggleIcon = document.querySelector('.theme-toggle__icon');

const setTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  toggleText.textContent = isDark ? '浅色' : '深色';
  toggleIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
};

const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  setTheme(storedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}

toggleButton?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId.length <= 1) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const form = document.querySelector('.contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('感谢留言！该表单目前仅用于演示。');
  form.reset();
});
