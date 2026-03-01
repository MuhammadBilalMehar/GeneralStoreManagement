/**
 * Swipe to Close Logic for Mobile Sidebar
 */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const sidebar = document.getElementById('sidebar');
    const isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
    
    // Calculate the distance of the swipe
    const swipeDistance = touchStartX - touchEndX;

    // If sidebar is open and user swipes left (more than 70px)
    if (isSidebarOpen && swipeDistance > 70) {
        toggleSidebar(); // Closes the sidebar
    }
}


/**
 * NexStore Admin Terminal - Central Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();
});

// 1. Sidebar Management
async function loadSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    try {
        const response = await fetch('sidebar.html');
        container.innerHTML = await response.text();
        // Re-initialize icons after loading
        if (window.lucide) {
            lucide.createIcons();
        }
        
        setActiveNavLink();
    } catch (err) {
        console.error('Sidebar load failed:', err);
    }
}

// --- NEW: MOBILE SIDEBAR TOGGLE ---
// function toggleSidebar() {
//     const sidebar = document.getElementById('sidebar');
//     const overlay = document.getElementById('sidebarOverlay');
    
//     if (!sidebar) return;

//     // Toggle the off-screen class
//     sidebar.classList.toggle('-translate-x-full');

//     // Handle Overlay for Mobile
//     if (overlay) {
//         const isHidden = overlay.classList.contains('hidden');
//         if (isHidden) {
//             overlay.classList.remove('hidden');
//             setTimeout(() => overlay.classList.add('opacity-100'), 10);
//         } else {
//             overlay.classList.remove('opacity-100');
//             setTimeout(() => overlay.classList.add('hidden'), 300);
//         }
//     }
// }

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.querySelector('.mobile-menu-btn i'); // Target the icon
    
    if (!sidebar) return;

    sidebar.classList.toggle('-translate-x-full');

    // Toggle Overlay
    if (overlay) {
        const isHidden = overlay.classList.contains('hidden');
        if (isHidden) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('opacity-100'), 10);
            if(menuBtn) menuBtn.setAttribute('data-lucide', 'x'); // Change to X
        } else {
            overlay.classList.remove('opacity-100');
            setTimeout(() => overlay.classList.add('hidden'), 300);
            if(menuBtn) menuBtn.setAttribute('data-lucide', 'menu'); // Change back to Menu
        }
        lucide.createIcons(); // Refresh icons
    }
}


function setActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('#sidebar nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {add
            link.classList.add('bg-indigo-600/10', 'text-indigo-400', 'border', 'border-white-600/20');
        }
    });
}

// 2. THE MASTER TOGGLE (Handles ALL Centered Modals)
// Works for: Product, Supplier, Category, Customer
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Standardizing: Using 'hidden' for everything is cleaner
    // If your CSS uses .modal-active, we handle that here too
    const isHidden = modal.classList.contains('hidden') || modal.classList.contains('hidden-modal');
    
    if (isHidden) {
        modal.classList.remove('hidden', 'hidden-modal');
        modal.classList.add('flex'); // Ensure it shows if using flex layout
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// 3. THE MASTER DRAWER (Handles ALL Side Panels)
// Works for: Sale, Purchase, Expense
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


// 5. Global Click Listener (Updated to include sidebarOverlay)
window.onclick = (event) => {
    const overlays = [
        'customerModal', 'supplierModal', 'productModal', 'categoryModal', 
        'saleOverlay', 'overlay', 'expenseOverlay', 'sidebarOverlay' // Added sidebarOverlay
    ];
    
    if (overlays.includes(event.target.id)) {
        if (event.target.id === 'sidebarOverlay') {
            toggleSidebar();
        } else if (event.target.id.includes('Overlay') || event.target.id === 'overlay') {
            const drawerId = event.target.id.replace('Overlay', 'Drawer').replace('overlay', 'purchaseDrawer');
            toggleDrawer(drawerId, event.target.id);
        } else {
            toggleModal(event.target.id);
        }
    }
};


// // 5. Global Click Listener (Outside clicks to close)
// window.onclick = (event) => {
//     // List all IDs that act as backgrounds/overlays
//     const overlays = ['customerModal', 'supplierModal', 'productModal', 'categoryModal', 'saleOverlay', 'overlay', 'expenseOverlay'];
    
//     if (overlays.includes(event.target.id)) {
//         // If it's a drawer overlay
//         if (event.target.id.includes('Overlay') || event.target.id === 'overlay') {
//             const drawerId = event.target.id.replace('Overlay', 'Drawer').replace('overlay', 'purchaseDrawer');
//             toggleDrawer(drawerId, event.target.id);
//         } else {
//             // If it's a centered modal
//             toggleModal(event.target.id);
//         }
//     }
// };