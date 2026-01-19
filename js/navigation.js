/* ==============================================
   NAVIGATION - Panel Switching, Dropdowns
   ============================================== */

function initNavigation() {
  const menuBtn = document.getElementById('menuBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const panels = document.querySelectorAll('.view-panel');
  const quickLinksBtn = document.getElementById('quickLinksBtn');
  const quickLinksDropdown = document.getElementById('quickLinksDropdown');

  if (!menuBtn || !dropdownMenu) {
    console.warn('Navigation elements not found');
    return;
  }

  // Toggle main dropdown
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBtn.classList.toggle('open');
    dropdownMenu.classList.toggle('open');
    if (quickLinksDropdown) {
      quickLinksDropdown.classList.remove('open');
    }
  });

  // Toggle quick links dropdown
  if (quickLinksBtn && quickLinksDropdown) {
    quickLinksBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      quickLinksDropdown.classList.toggle('open');
      menuBtn.classList.remove('open');
      dropdownMenu.classList.remove('open');
    });
  }

  // Close all dropdowns when clicking outside
  document.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    dropdownMenu.classList.remove('open');
    if (quickLinksDropdown) {
      quickLinksDropdown.classList.remove('open');
    }
  });

  // Handle menu item selection
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Update active states
      dropdownItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Switch panels
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === item.dataset.view) {
          panel.classList.add('active');
        }
      });
      
      // Close dropdown
      menuBtn.classList.remove('open');
      dropdownMenu.classList.remove('open');
    });
  });
}

export { initNavigation };
