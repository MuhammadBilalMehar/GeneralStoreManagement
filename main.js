/**
 * NexStore Admin Terminal - Central Logic
 */

let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;

document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
    }, { passive: false });

    document.addEventListener('touchmove', e => {
        if (!isSwiping) return;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        isSwiping = false;
        handleSwipe(touchEndX, touchEndY);
    }, { passive: true });
});

async function loadSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;
    try {
        const response = await fetch('sidebar.html');
        container.innerHTML = await response.text();
        if (window.lucide) lucide.createIcons();
        setActiveNavLink();
    } catch (err) { console.error(err); }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const icon = document.querySelector('.mobile-menu-btn i');

    if (!sidebar) return;

    const isOpen = sidebar.classList.toggle('open');

    if (overlay) {
        if (isOpen) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('opacity-100'), 10);
            if (icon) icon.setAttribute('data-lucide', 'x');
        } else {
            overlay.classList.remove('opacity-100');
            setTimeout(() => overlay.classList.add('hidden'), 300);
            if (icon) icon.setAttribute('data-lucide', 'menu');
        }
    }
    if (window.lucide) lucide.createIcons();
}

/**
 * NEW: Master Modal Toggle
 * Handles "Add Product", "Edit Category", etc.
 */
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        modal.classList.add('flex'); // Centering logic
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}

function handleSwipe(endX, endY) {
    const sidebar = document.getElementById('sidebar');
    // NEW: Disable swipe logic on Desktop (Laptops)
    if (!sidebar || window.innerWidth >= 768) return; 
    
    const isOpen = sidebar.classList.contains('open');
    const deltaX = touchStartX - endX;
    const deltaY = Math.abs(touchStartY - endY);

    if (isOpen && deltaX > 80 && deltaX > deltaY) {
        toggleSidebar();
    }
    
    if (!isOpen && deltaX < -80 && touchStartX < 50 && Math.abs(deltaX) > deltaY) {
        toggleSidebar();
    }
}

function setActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('#sidebar nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('bg-indigo-600/10', 'text-indigo-400', 'border', 'border-indigo-500/20');
        }
    });
}

/**
 * UPDATED: Global Click Listener
 */
window.onclick = (e) => {
    // If user clicks the sidebar overlay
    if (e.target.id === 'sidebarOverlay') {
        toggleSidebar();
    }
    
    // NEW: If user clicks the background of the Product Modal
    if (e.target.id === 'productModal') {
        toggleModal('productModal');
    }
};


function toggleDrawer(drawerId, overlayId) {
    const drawer = document.getElementById(drawerId);
    const overlay = document.getElementById(overlayId);
    
    if (!drawer || !overlay) return;

    if (drawer.classList.contains('drawer-hidden')) {
        drawer.classList.remove('drawer-hidden');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('opacity-100'), 10);
    } else {
        drawer.classList.add('drawer-hidden');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}