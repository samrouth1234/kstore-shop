document.querySelectorAll('[role="tab"]').forEach(tab => {
  tab.addEventListener('click', function () {
      // Remove active class from all tabs
      document.querySelectorAll('[role="tab"]').forEach(t => t.classList.remove('active-tab'));
      
      // Add active class to current tab
      this.classList.add('active-tab');
      
      // Hide all tab panels
      document.querySelectorAll('[role="tabpanel"]').forEach(content => content.classList.add('hidden'));
      
      // Show target panel
      const target = this.getAttribute('data-tabs-target');
      document.querySelector(target).classList.remove('hidden');
      
      // Store active tab in local storage
      localStorage.setItem('activeTab', target);
  });
});

// Restore active tab on page load
window.addEventListener('DOMContentLoaded', function() {
  const activeTab = localStorage.getItem('activeTab');
  if (activeTab) {
      document.querySelector(`[data-tabs-target="${activeTab}"]`).click();
  }
});