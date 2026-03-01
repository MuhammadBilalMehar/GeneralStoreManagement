// /**
//  * NexStore Admin Terminal - Central Logic
//  */

// let touchStartX = 0;
// let touchStartY = 0;

// document.addEventListener('DOMContentLoaded', () => {
//     loadSidebar();
    
//     // 1. TOUCH GESTURE LISTENERS
//     // Tracks where the finger first touches the screen
//     document.addEventListener('touchstart', e => {
//         touchStartX = e.changedTouches[0].screenX;
//         touchStartY = e.changedTouches[0].screenY;
//     }, { passive: true });

//     // Tracks where the finger leaves the screen
//     document.addEventListener('touchend', e => {
//         const touchEndX = e.changedTouches[0].screenX;
//         const touchEndY = e.changedTouches[0].screenY;
//         handleSwipeGesture(touchEndX, touchEndY);
//     }, { passive: true });
// });

// // 2. SIDEBAR CORE ENGINE
// async function loadSidebar() {
//     const container = document.getElementById('sidebar-container');
//     if (!container) return;

//     try {
//         const response = await fetch('sidebar.html');
//         if (!response.ok) throw new Error('Sidebar fetch failed');
//         container.innerHTML = await response.text();
        
//         if (window.lucide) lucide.createIcons();
//         setActiveNavLink();
//     } catch (err) {
//         console.error('Sidebar Error:', err);
//     }
// }

// // 3. THE TOGGLE FUNCTION (Triggered by Hamburger Button)
// function toggleSidebar() {
//     const sidebar = document.getElementById('sidebar');
//     const overlay = document.getElementById('sidebarOverlay');
//     const menuBtnIcon = document.querySelector('.mobile-menu-btn i');
    
//     if (!sidebar) return;

//     const isOpening = sidebar.classList.contains('-translate-x-full');

//     // Toggle the sidebar position
//     sidebar.classList.toggle('-translate-x-full');

//     // Manage the Overlay and the Button Icon
//     if (overlay) {
//         if (isOpening) {
//             overlay.classList.remove('hidden');
//             setTimeout(() => overlay.classList.add('opacity-100'), 10);
//             // Change Hamburger to X
//             if (menuBtnIcon) menuBtnIcon.setAttribute('data-lucide', 'x');
//         } else {
//             overlay.classList.remove('opacity-100');
//             setTimeout(() => overlay.classList.add('hidden'), 300);
//             // Change X back to Hamburger
//             if (menuBtnIcon) menuBtnIcon.setAttribute('data-lucide', 'menu');
//         }
//         // Re-render Lucide icons to show change
//         if (window.lucide) lucide.createIcons();
//     }
// }

// // 4. SWIPE LOGIC (Touch Interaction)
// function handleSwipeGesture(endX, endY) {
//     const sidebar = document.getElementById('sidebar');
//     if (!sidebar) return;

//     const isSidebarOpen = !sidebar.classList.contains('-translate-x-full');
//     const deltaX = touchStartX - endX; // Positive = Swipe Left, Negative = Swipe Right
//     const deltaY = Math.abs(touchStartY - endY);

//     // CLOSE SIDEBAR: Swipe left (minimum 70px) when menu is open
//     if (isSidebarOpen && deltaX > 70 && deltaX > deltaY) {
//         toggleSidebar();
//     }

//     // OPEN SIDEBAR: Swipe right from the left edge (start position < 50px)
//     if (!isSidebarOpen && deltaX < -70 && touchStartX < 50 && deltaX < -deltaY) {
//         toggleSidebar();
//     }
// }

// // 5. ACTIVE LINK STYLING
// function setActiveNavLink() {
//     const currentPath = window.location.pathname.split("/").pop() || 'index.html';
//     document.querySelectorAll('#sidebar nav a').forEach(link => {
//         if (link.getAttribute('href') === currentPath) {
//             link.classList.add('bg-indigo-600/10', 'text-indigo-400', 'border', 'border-indigo-500/20');
//         }
//     });
// }

// // 6. GLOBAL CLICK LISTENER (Clicking outside sidebar to close)
// window.onclick = (event) => {
//     if (event.target.id === 'sidebarOverlay') {
//         toggleSidebar();
//     }
    
//     // Master Modal/Drawer logic for other components
//     const modalOverlays = ['customerModal', 'supplierModal', 'productModal', 'categoryModal', 'saleOverlay', 'expenseOverlay'];
//     if (modalOverlays.includes(event.target.id)) {
//         const target = document.getElementById(event.target.id);
//         if (target) {
//             target.classList.add('hidden');
//             document.body.classList.remove('overflow-hidden');
//         }
//     }
// };


let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();

    // Touch Listeners
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
});

async function loadSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;
    try {
        const response = await fetch('sidebar.html');
        container.innerHTML = await response.text();
        if (window.lucide) lucide.createIcons();
    } catch (err) { console.error(err); }
}

// THE MASTER TOGGLE
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const icon = document.querySelector('.mobile-menu-btn i');

    if (!sidebar) return;

    // Toggle the 'open' class
    const isOpen = sidebar.classList.toggle('open');

    // Handle Overlay and Icon
    if (overlay) {
        if (isOpen) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('active'), 10);
            if (icon) icon.setAttribute('data-lucide', 'x');
        } else {
            overlay.classList.remove('active');
            setTimeout(() => overlay.classList.add('hidden'), 300);
            if (icon) icon.setAttribute('data-lucide', 'menu');
        }
    }
    if (window.lucide) lucide.createIcons();
}

// SWIPE LOGIC
function handleSwipe() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    const isOpen = sidebar.classList.contains('open');
    const distance = touchStartX - touchEndX;

    // Swipe left to close
    if (isOpen && distance > 70) {
        toggleSidebar();
    }
    // Swipe right from edge to open
    if (!isOpen && distance < -70 && touchStartX < 40) {
        toggleSidebar();
    }
}

// Global click to close
window.onclick = (e) => {
    if (e.target.id === 'sidebarOverlay') toggleSidebar();
};