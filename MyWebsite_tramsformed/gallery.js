// Initialize and render gallery
function initGallery() {
    const gallery = document.getElementById('gallery');
    const images = GALLERY_IMAGES;
    
    images.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'gallery-item';
        itemEl.style.setProperty('--transition-name', `item-${item.id}`);
        
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.title;
        img.dataset.itemId = item.id;
        
        itemEl.appendChild(img);
        gallery.appendChild(itemEl);
        
        // Bind click event
        itemEl.addEventListener('click', () => openLightbox(item.url, item.id));
    });
}

// Open lightbox
function openLightbox(imageUrl, itemId) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    // Use View Transitions API to implement smooth animation
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            lightbox.classList.add('active');
            lightboxImage.src = imageUrl;
            lightboxImage.style.viewTransitionName = `item-${itemId}`;
        });
    } else {
        // Fallback solution
        lightbox.classList.add('active');
        lightboxImage.src = imageUrl;
    }
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            lightbox.classList.remove('active');
        });
    } else {
        lightbox.classList.remove('active');
    }
}

// Event binding
function setupEventListeners() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    
    // Close button
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Click background to close
    lightboxOverlay.addEventListener('click', closeLightbox);
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Prevent background scrolling
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.id === 'lightboxOverlay') {
            closeLightbox();
        }
    });
}

// Initialize after page load
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    setupEventListeners();
});
