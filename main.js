/**
 * NexStore Admin Terminal - Master Logic
 * Handles Sidebar, Swiping, Modals, and Drawers
 */

// 1. GLOBAL STATE & TOUCH TRACKING
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Load the sidebar immediately
    loadSidebar();
    
    // Global Swipe Listeners
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        handleSwipe(touchEndX, touchEndY);
    }, { passive: true });
});

// 2. SIDEBAR ENGINE
async function loadSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    try {
        const response = await fetch('sidebar.html');
        if (!response.ok) throw new Error('Sidebar fetch failed');
        container.innerHTML = await response.text();
        
        // Initialize icons and active states
        if (window.lucide) lucide.createIcons();
        setActiveNavLink();
    } catch (err) {
        console.error('Sidebar Error:', err);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtnIcon = document.querySelector('.mobile-menu-btn i');
    
    if (!sidebar) return;

    const isOpening = sidebar.classList.contains('-translate-x-full');
    sidebar.classList.toggle('-translate-x-full');

    if (overlay) {
        if (isOpening) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('opacity-100'), 10);
            if (menuBtnIcon) menuBtnIcon.setAttribute('data-lucide', 'x');
        } else {
            overlay.classList.remove('opacity-100');
            setTimeout(() => overlay.classList.add('hidden'), 300);
            if (menuBtnIcon) menuBtnIcon.setAttribute('data-lucide', 'menu');
        }
        if (window.lucide) lucide.createIcons();
    }
}

function handleSwipe(endX, endY) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
    const deltaX = touchStartX - endX;
    const deltaY = Math.abs(touchStartY - endY);

    // Left swipe to close (Horizontal distance must be greater than vertical)
    if (isSidebarOpen && deltaX > 70 && deltaX > deltaY) {
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

// 3. THE MASTER TOGGLE (For Centered Modals: Products, Categories, Suppliers)
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const isHidden = modal.classList.contains('hidden');
    
    if (isHidden) {
        modal.classList.remove('hidden');
        modal.classList.add('flex'); // Centering via flex
        document.body.classList.add('overflow-hidden'); // Lock scroll
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden'); // Unlock scroll
    }
}

// 4. THE MASTER DRAWER (For Side Panels: Daily Sales, Expenses, Purchases)
function toggleDrawer(drawerId, overlayId) {
    const drawer = document.getElementById(drawerId);
    const overlay = document.getElementById(overlayId);
    if (!drawer) return;

    // We assume 'drawer-hidden' moves the drawer off-screen (e.g., translate-x-full)
    const isOpening = drawer.classList.contains('drawer-hidden');

    if (isOpening) {
        drawer.classList.remove('drawer-hidden');
        overlay?.classList.remove('hidden');
        setTimeout(() => overlay?.classList.add('opacity-100'), 10);
        document.body.classList.add('overflow-hidden');
    } else {
        drawer.classList.add('drawer-hidden');
        overlay?.classList.remove('opacity-100');
        setTimeout(() => overlay?.classList.add('hidden'), 300);
        document.body.classList.remove('overflow-hidden');
    }
}

// 5. GLOBAL CLICK LISTENER (Handle Outside Clicks)
window.onclick = (event) => {
    // Map of overlay IDs that should close their respective elements
    const overlays = [
        'sidebarOverlay', 
        'customerModal', 
        'supplierModal', 
        'productModal', 
        'categoryModal', 
        'saleOverlay', 
        'expenseOverlay', 
        'overlay' // common for purchases
    ];
    
    if (overlays.includes(event.target.id)) {
        if (event.target.id === 'sidebarOverlay') {
            toggleSidebar();
        } else if (event.target.id.includes('Overlay') || event.target.id === 'overlay') {
            // Logic for Side Drawers: Auto-detects drawer name from overlay name
            // Example: saleOverlay -> saleDrawer
            const drawerId = event.target.id.replace('Overlay', 'Drawer').replace('overlay', 'purchaseDrawer');
            toggleDrawer(drawerId, event.target.id);
        } else {
            // Logic for Centered Modals
            toggleModal(event.target.id);
        }
    }
};