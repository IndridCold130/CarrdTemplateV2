// router.js

const contentDiv = document.getElementById('content');

function initLorePanel() {
  const sidebarItems = document.querySelectorAll('.lore-sidebar li');
  const loreContent = document.getElementById('lore-content');

  if (!sidebarItems.length || !loreContent) return;

  // Load default section
  loadLore('components/lore/chapter1.html');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebarItems.forEach(li => li.classList.remove('active'));
      item.classList.add('active');

      const file = item.getAttribute('data-lore');
      loadLore(`components/lore/${file}`);
    });
  });
}

function loadLore(filePath) {
  fetch(filePath)
    .then(res => res.text())
    .then(data => {
      const loreContent = document.getElementById('lore-content');
      loreContent.innerHTML = data;

      // Re-trigger animation
      loreContent.style.animation = 'none';
      loreContent.offsetHeight;
      loreContent.style.animation = 'fadeInText 1s ease-out forwards';
    })
    .catch(err => {
      document.getElementById('lore-content').innerHTML = "<p>Failed to load content.</p>";
      console.error(err);
    });
}

function loadContent(route) {
  const page = route || 'profile-panel';

  fetch(`pages/${page}.html`)
    .then(res => res.text())
    .then(html => {
      contentDiv.classList.remove('fade-in');
      contentDiv.innerHTML = html;
      void contentDiv.offsetWidth;
      contentDiv.classList.add('fade-in');

      // 🧠 Run lore panel logic if needed
      if (page === 'lore') {
        initLorePanel();
      }
    });
}

function onHashChange() {
  const route = location.hash.replace('#', '');
  loadContent(route);
}

window.addEventListener('hashchange', onHashChange);
window.addEventListener('DOMContentLoaded', () => {
  onHashChange();
});
