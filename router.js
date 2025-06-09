// router.js

const contentDiv = document.getElementById('content');

function initLorePanel() {
    const sidebarItems = document.querySelectorAll('.lore-sidebar li');
    const loreContent = document.getElementById('lore-content');

    if (!sidebarItems.length || !loreContent) return;

    // Load the default lore section (first item)
    const defaultLore = sidebarItems[0].getAttribute('data-lore');
    loadLore(`components/lore/${defaultLore}`);
    sidebarItems[0].classList.add('active');

    // Sidebar click logic
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Reset active state
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Load the corresponding lore section
            const file = item.getAttribute('data-lore');
            loadLore(`components/lore/${file}`);
        });
    });
}

function initGalleryPanel() {
    const sidebarItems = document.querySelectorAll('.gallery-sidebar li');
    const thumbnails = document.querySelectorAll('.diablo-frame.thumbnail');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const closeButton = document.querySelector('.lightbox-close');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentIndex = 0;
    let imageList = [];

    // 🛠️ Proper initial active category detection
    const initialActiveItem = document.querySelector('.gallery-sidebar li.active') || sidebarItems[0];
    const initialCategory = initialActiveItem.dataset.category || "portraits";
    initialActiveItem.classList.add('active');
    showThumbnails(initialCategory);

    // Helper to reset all thumbnails
    function resetThumbnails() {
        thumbnails.forEach(thumbnail => {
            thumbnail.style.display = "none";
            thumbnail.classList.remove('show');
        });
    }

    // Helper to show thumbnails based on category
    function showThumbnails(category) {
        imageList = []; // Clear image list for each filter
        thumbnails.forEach((thumbnail, index) => {
            const img = thumbnail.querySelector('.gallery-thumbnail');
            const fileName = img.src.split('/').pop().toLowerCase();

            if (category === "all" || fileName.includes(category)) {
                thumbnail.style.display = "block";
                imageList.push(img.src); // Add to the lightbox image list

                // Delay the "show" class to trigger the animation
                setTimeout(() => {
                    thumbnail.classList.add('show');
                }, index * 100); // Stagger effect
            }
        });
    }

    // Sidebar click logic
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Reset active state
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Get the clicked category
            const category = item.dataset.category;
            
            // Reset and show relevant thumbnails
            resetThumbnails();
            showThumbnails(category);
        });
    });

    // Thumbnail click event
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = thumbnail.querySelector('.gallery-thumbnail').src;
            const imgIndex = imageList.indexOf(imgSrc);
            if (imgIndex !== -1) {
                openLightbox(imgIndex);
            }
        });
    });

    // Open the lightbox
    function openLightbox(index) {
        currentIndex = index;
        lightboxImage.src = imageList[currentIndex];
        lightbox.style.display = 'flex';
    }

    // Close the lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    // Move to the previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
        lightboxImage.src = imageList[currentIndex];
    }

    // Move to the next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % imageList.length;
        lightboxImage.src = imageList[currentIndex];
    }

    // Close button
    closeButton.addEventListener('click', closeLightbox);

    // Arrow navigation
    leftArrow.addEventListener('click', prevImage);
    rightArrow.addEventListener('click', nextImage);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}






document.addEventListener("DOMContentLoaded", initGalleryPanel);

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

      // 🖼️ Run gallery panel logic if needed
      if (page === 'gallery') {
        console.log("🖼️ Gallery panel initialized");
        initGalleryPanel(); // THIS LINE IS KEY
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
