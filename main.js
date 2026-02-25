// /**
//  * NexStore Admin Terminal - Central Logic
//  */

// // 1. Initialize Global Components on Page Load
// document.addEventListener('DOMContentLoaded', () => {
//     loadSidebar();
// });

// // 2. Sidebar Injection Logic
// function loadSidebar() {
//     const container = document.getElementById('sidebar-container');
//     if (!container) return;

//     fetch('sidebar.html')
//         .then(response => response.text())
//         .then(data => {
//             container.innerHTML = data;
//             // Initialize Lucide icons after sidebar is injected
//             lucide.createIcons();
//             setActiveNavLink();
//         })
//         .catch(err => console.error('Error loading sidebar:', err));
// }

// // 3.--- PRODUCT MODAL LOGIC ---
// function toggleProductModal() {
//     const modal = document.getElementById('productModal');
//     if (modal) {
//         modal.classList.toggle('modal-active');
        
//         // Reset scrolling on the main page
//         if (modal.classList.contains('modal-active')) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'auto';
//         }
//     }
// }


// // 3. Highlight Active Sidebar Link
// function setActiveNavLink() {
//     const currentPath = window.location.pathname.split("/").pop();
//     const navLinks = document.querySelectorAll('#sidebar nav a');
//     navLinks.forEach(link => {
//         if (link.getAttribute('href') === currentPath) {
//             link.classList.add('bg-indigo-600/10', 'text-indigo-400', 'border', 'border-indigo-600/20');
//         }
//     });
// }

// // 4.// category model 
// function toggleGenericModal(id) {
//     const modal = document.getElementById(id);
//     if (modal) {
//         modal.classList.toggle('hidden');
//         // Prevent body from scrolling when modal is open
//         if (!modal.classList.contains('hidden')) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'auto';
//         }
//     }
// }

// // 5. Purchase Drawer & Overlay Logic
// function toggleDrawer() {
//     const drawer = document.getElementById('purchaseDrawer');
//     const overlay = document.getElementById('overlay');
    
//     if (!drawer || !overlay) return;

//     if (drawer.classList.contains('drawer-hidden')) {
//         drawer.classList.remove('drawer-hidden');
//         overlay.classList.remove('hidden');
//         setTimeout(() => overlay.classList.add('opacity-100'), 10);
//         document.body.style.overflow = 'hidden'; // Prevent scroll
//     } else {
//         drawer.classList.add('drawer-hidden');
//         overlay.classList.remove('opacity-100');
//         setTimeout(() => overlay.classList.add('hidden'), 400);
//         document.body.style.overflow = 'auto';
//     }
// }

// // --- 6. SUPPLIER MODAL (Toggle Logic) ---
// function toggleModal() {
//     // This specifically targets the ID in your suppliers.html
//     const modal = document.getElementById('supplierModal');
//     if (modal) {
//         modal.classList.toggle('modal-active');
//     }
// }

// // --- 7. Sale Model
// function toggleSaleDrawer() {
//     const drawer = document.getElementById('saleDrawer');
//     const overlay = document.getElementById('saleOverlay');
    
//     if (!drawer) return;

//     if (drawer.classList.contains('drawer-hidden')) {
//         // OPEN
//         drawer.classList.remove('drawer-hidden');
//         overlay.classList.remove('hidden');
//         setTimeout(() => overlay.classList.add('opacity-100'), 10);
//         document.body.style.overflow = 'hidden';
//     } else {
//         // CLOSE
//         drawer.classList.add('drawer-hidden');
//         overlay.classList.remove('opacity-100');
//         setTimeout(() => {
//             overlay.classList.add('hidden');
//         }, 300);
//         document.body.style.overflow = 'auto';
//     }
// }
// // --- 8. Customer Modal
// // Specifically for Customer Modal (matches your previous custom code)
// function openCustomerModal() {
//     const modal = document.getElementById('customerModal');
//     if (modal) {
//         modal.classList.remove('hidden-modal');
//         document.body.style.overflow = 'hidden';
//     }
// }
// function closeCustomerModal() {
//     const modal = document.getElementById('customerModal');
//     if (modal) {
//         modal.classList.add('hidden-modal');
//         document.body.style.overflow = 'auto';
//     }
// }


// // 9. Global Event Listeners (Close modals on outside click)
// window.onclick = function(event) {
//     const customerModal = document.getElementById('customerModal');
//     const supplierModal = document.getElementById('supplierModal');
//     if (event.target == customerModal) closeCustomerModal();
//     if (event.target == supplierModal) toggleModal('supplierModal');
// }




// // 4. Modal & Drawer Toggles
// function toggleModal(modalId) {
//     const modal = document.getElementById(modalId);
//     if (modal) {
//         // Support both 'hidden' class and 'modal-active' (used in your products/suppliers)
//         if (modal.classList.contains('hidden')) {
//             modal.classList.remove('hidden');
//         } else if (modal.classList.contains('hidden-modal')) {
//              modal.classList.remove('hidden-modal');
//         } else {
//             modal.classList.toggle('modal-active');
//             modal.classList.toggle('hidden');
//         }
//     }
// }


/**
 * NexStore Admin Terminal - Central Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();
    initClock();
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
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('bg-indigo-600/10', 'text-indigo-400', 'border', 'border-indigo-600/20');
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

// 4. Global Utilities (Clock)
function initClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    
    const update = () => {
        const now = new Date();
        clockEl.innerText = now.toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).replace(',', ' |');
    };
    update();
    setInterval(update, 1000);
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