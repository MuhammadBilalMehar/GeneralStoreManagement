/**
 * NexStore Admin Terminal - Central Logic
 */

// 1. GLOBAL STATE & INITIALIZATION
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();
    
    // Initialize Swipe Listeners for Mobile
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
});

// 2. SIDEBAR MANAGEMENT
async function loadSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    try {
        const response = await fetch('sidebar.html');
        if (!response.ok) throw new Error('Sidebar file not found');
        
        container.innerHTML = await response.text();
        
        // Re-initialize icons after loading dynamic HTML
        if (window.lucide) {
            lucide.createIcons();
        }
        
        setActiveNavLink();
    } catch (err) {
        console.error('Sidebar load failed:', err);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtnIcon = document.querySelector('.mobile-menu-btn i');
    
    if (!sidebar) return;

    const isOpening = sidebar.classList.contains('-translate-x-full');

    // Toggle Sidebar Position
    sidebar.classList.toggle('-translate-x-full');

    // Handle Overlay & Icon State
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
        
        // Refresh Lucide to show the changed icon (Menu <=> X)
        if (window.lucide) {
            lucide.createIcons();
        }
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

// 3. SWIPE TO CLOSE LOGIC
function handleSwipe() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
    const swipeDistance = touchStartX - touchEndX;

    // Detect left swipe (minimum 70px) when sidebar is open
    if (isSidebarOpen && swipeDistance > 70) {
        toggleSidebar();
    }
}

// 4. MASTER MODAL TOGGLE (Product, Customer, Category)
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const isHidden = modal.classList.contains('hidden');
    
    if (isHidden) {
        modal.classList.remove('hidden');
        modal.classList.add('flex'); // Center content using flex
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// 5. MASTER DRAWER TOGGLE (Sales, Purchases, Expenses)
function toggleDrawer(drawerId, overlayId) {
    const drawer = document.getElementById(drawerId);
    const overlay = document.getElementById(overlayId);
    if (!drawer) return;

    const isOpening = drawer.classList.contains('drawer-hidden');

    if (isOpening) {
        drawer.classList.remove('drawer-hidden');
        overlay?.classList.remove('hidden');
        setTimeout(() => overlay?.classList.add('opacity-100'), 10);
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.add('drawer-hidden');
        overlay?.classList.remove('opacity-100');
        setTimeout(() => overlay?.classList.add('hidden'), 300);
        document.body.style.overflow = 'auto';
    }
}

// 6. GLOBAL CLICK LISTENER (Outside clicks to close)
window.onclick = (event) => {
    const overlays = [
        'sidebarOverlay', 
        'customerModal', 
        'supplierModal', 
        'productModal', 
        'categoryModal', 
        'saleOverlay', 
        'expenseOverlay', 
        'overlay'
    ];
    
    if (overlays.includes(event.target.id)) {
        if (event.target.id === 'sidebarOverlay') {
            toggleSidebar();
        } else if (event.target.id.includes('Overlay') || event.target.id === 'overlay') {
            // Handle Side Drawers
            const drawerId = event.target.id.replace('Overlay', 'Drawer').replace('overlay', 'purchaseDrawer');
            toggleDrawer(drawerId, event.target.id);
        } else {
            // Handle Centered Modals
            toggleModal(event.target.id);
        }
    }
};