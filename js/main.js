document.querySelectorAll('[role="tab"]').forEach(tab => {
  tab.addEventListener('click', function () {
    
      document.querySelectorAll('[role="tab"]').forEach(t => t.classList.remove('active-tab'));
      
      this.classList.add('active-tab');
      
      document.querySelectorAll('[role="tabpanel"]').forEach(content => content.classList.add('hidden'));
      
      const target = this.getAttribute('data-tabs-target');
      document.querySelector(target).classList.remove('hidden');
  });
});