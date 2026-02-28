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
        lucide.createIcons();
        setActiveNavLink();
    } catch (err) {
        console.error('Sidebar load failed:', err);
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

// 5. Global Click Listener (Outside clicks to close)
window.onclick = (event) => {
    // List all IDs that act as backgrounds/overlays
    const overlays = ['customerModal', 'supplierModal', 'productModal', 'categoryModal', 'saleOverlay', 'overlay', 'expenseOverlay'];
    
    if (overlays.includes(event.target.id)) {
        // If it's a drawer overlay
        if (event.target.id.includes('Overlay') || event.target.id === 'overlay') {
            const drawerId = event.target.id.replace('Overlay', 'Drawer').replace('overlay', 'purchaseDrawer');
            toggleDrawer(drawerId, event.target.id);
        } else {
            // If it's a centered modal
            toggleModal(event.target.id);
        }
    }
};