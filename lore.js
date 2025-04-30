export function initLorePanel() {
  const sidebarItems = document.querySelectorAll('.lore-sidebar li');
  const loreContent = document.getElementById('lore-content');

  if (!sidebarItems.length || !loreContent) return;

  // Load the default lore section (Prologue)
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

      // 🔥 Trigger animation
      loreContent.style.animation = 'none';
      loreContent.offsetHeight;
      loreContent.style.animation = 'fadeInText 1s ease-out forwards';
    })
    .catch(err => {
      document.getElementById('lore-content').innerHTML = "<p>Failed to load content.</p>";
      console.error(err);
    });
}
  