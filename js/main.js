function initializeTabs(tabListId, contentId) {
	document.querySelectorAll(`#${tabListId} [role='tab']`).forEach((tab) => {
		tab.addEventListener('click', function () {
			// Remove active class from all tabs
			document.querySelectorAll(`#${tabListId} [role='tab']`).forEach((t) => t.classList.remove('active-tab'));

			// Add active class to current tab
			this.classList.add('active-tab');

			// Hide all tab panels
			document.querySelectorAll(`#${contentId} [role='tabpanel']`).forEach((content) => content.classList.add('hidden'));

			// Show target panel
			const target = this.getAttribute('data-tabs-target');
			document.querySelector(target).classList.remove('hidden');

			// Store active tab in local storage
			localStorage.setItem(`${tabListId}-activeTab`, target);
		});
	});

	// Restore active tab on page load
	window.addEventListener('DOMContentLoaded', function () {
		const activeTab = localStorage.getItem(`${tabListId}-activeTab`);
		if (activeTab) {
			const activeButton = document.querySelector(`[data-tabs-target="${activeTab}"]`);
			if (activeButton) {
				activeButton.click();
			}
		}
	});
}

// Initialize both sets of tabs
initializeTabs('default-tab', 'default-tab-content');
initializeTabs('featured-tab', 'featured-tab-content');
