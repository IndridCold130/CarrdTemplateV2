window.addEventListener('DOMContentLoaded', () => {
    // Load the lore panel structure
    fetch('components/profile-panel.html')
      .then(res => res.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        initLorePanel(); // initialize interactivity
      });
  
    function initLorePanel() {
      const sidebarItems = document.querySelectorAll('.lore-sidebar li');
      const loreContent = document.getElementById('lore-content');
  
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
          document.getElementById('lore-content').innerHTML = data;
        })
        .catch(err => {
          document.getElementById('lore-content').innerHTML = "<p>Failed to load content.</p>";
          console.error(err);
        });
    }
  });