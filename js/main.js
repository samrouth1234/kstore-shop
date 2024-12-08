function initializeTabs(tabListId, contentId) {
	document.querySelectorAll(`#${tabListId} [role='tab']`).forEach((tab) => {
		tab.addEventListener('click', function () {
			document.querySelectorAll(`#${tabListId} [role='tab']`).forEach((t) => t.classList.remove('active-tab'));

			this.classList.add('active-tab');
			document.querySelectorAll(`#${contentId} [role='tabpanel']`).forEach((content) => content.classList.add('hidden'));

			const target = this.getAttribute('data-tabs-target');
			document.querySelector(target).classList.remove('hidden');

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

initializeTabs('default-tab', 'default-tab-content');
initializeTabs('featured-tab', 'featured-tab-content');

// Add to cart
$(document).ready(function () {
	let cart = {};

	// Function to add an item to the cart
	function addToCart(productId, productDetails) {
		if (cart[productId]) {
			cart[productId].quantity += 1;
		} else {
			cart[productId] = { ...productDetails, quantity: 1 };
		}
		localStorage.setItem('cart', JSON.stringify(cart));
		updateCartUI();
	}

	// Update the cart UI
	function updateCartUI() {
		const cartItemsContainer = $('.cart-items');
		const cartCount = $('.cart-count');
		cartItemsContainer.empty();

		let totalItems = 0;
		$.each(cart, function (key, item) {
			totalItems += item.quantity;

			// Add item to the cart dropdown
			cartItemsContainer.append(`
							<div class="cart-item flex items-center gap-3 p-2 border-b">
									<img src="${item.image}" alt="${item.title}" class="w-20 h-20 rounded" />
									<div class="flex-1">
											<h2 class="text-md font-medium">${item.title}</h2>
											<p class="text-xs text-gray-600">$${item.price}</p>
									</div>
									<span class="font-medium">x${item.quantity}</span>
									<button class="remove-from-cart text-red-500 hover:text-red-700" data-id="${item.id}">
											<i class="bi bi-trash"></i>
									</button>
							</div>
					`);
		});

		// Update cart count
		cartCount.text(totalItems);

		// Show or hide the cart dropdown
		if (totalItems > 0) {
			$('.cart-dropdown').hide();
		} else {
			$('.cart-dropdown').hide();
		}
	}

	// Remove item from the cart
	$(document).on('click', '.remove-from-cart', function () {
		const productId = $(this).data('id');
		if (cart[productId]) {
			if (cart[productId].quantity > 1) {
				cart[productId].quantity -= 1;
			} else {
				delete cart[productId];
			}
		}
		updateCartUI();
	});

	// Redirect to shopping cart page
	$('#view-cart-btn').on('click', function () {
		localStorage.setItem('cart', JSON.stringify(cart));
		window.location.href = '/shopping-cart.html';
	});

	// Add item to cart button click handler
	$(document).on('click', '.add-to-cart', function () {
		const productDetails = {
			id: $(this).data('id'),
			title: $(this).data('title'),
			price: $(this).data('price'),
			image: $(this).data('image')
		};
		addToCart(productDetails.id, productDetails);
	});

	// Toggle cart dropdown visibility
	$('.cart-icon').on('click', function (e) {
		e.preventDefault();
		$('.cart-dropdown').toggle();
	});

	// Initialize cart from localStorage
	if (localStorage.getItem('cart')) {
		cart = JSON.parse(localStorage.getItem('cart'));
		updateCartUI();
	}
});

// fetch product
$(document).ready(function () {
	// Fetch JSON data
	$.getJSON('/lib/products.json', function (data) {
		let allProducts = data;

		// Function to render products in a specific container
		function renderProducts(products, containerId, limit = 8) {
			const productContainer = $(containerId);
			productContainer.empty();
			const displayedProducts = products.slice(0, limit);

			displayedProducts.forEach((product) => {
				const productCard = `
									<div class='card-featured-product bg-white border border-gray-200 rounded-lg shadow relative'>
											<div>
													<div class='image-container'>
															<img class='pb-4 image-card w-full md:h-44 object-contain' src='${product.image}' alt='${product.title}' />
															<div class='icon-overlay'>
																	<p class='background-heart-icon'><i class='bi bi-heart text-xl'></i></p>
																	<button 
																			data-id='${product.id}'
																			data-title='${product.title}'
																			data-price='${product.price}'
																			data-image='${product.image}'
																			class='add-to-cart background-cart-icon'>
																			<i class='bi bi-cart-plus text-xl'></i>
																	</button>
															</div>
													</div>
											</div>
											<div>
													<div class='flex items-center mt-2'>
															<div class='flex items-center space-x-1 rtl:space-x-reverse'>
																	${renderStars(product.rating)}
															</div>
															<span class='text-xs font-normal px-1 py-0.5 rounded ms-1'>(${product.reviews})</span>
													</div>
													<p class='description-card-featured hover:underline'>${product.description}</p>
													<p class='price-card mt-2'>$ ${product.price}</p>
											</div>
									</div>`;
				productContainer.append(productCard);
			});
		}

		// Render all products initially
		renderProducts(allProducts, '#product-container-all');

		// Filter products based on category when a button is clicked
		$('.filter-btn').on('click', function () {
			const category = $(this).data('category');
			let filteredProducts;

			if (category === 'Computer') {
				filteredProducts = allProducts;
				$('.filter-btn').attr('aria-selected', false);
				$(this).attr('aria-selected', true);
			} else {
				filteredProducts = allProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase());
				$('.filter-btn').attr('aria-selected', false);
				$(this).attr('aria-selected', true);
			}

			renderProducts(filteredProducts, `#product-container-${category.toLowerCase()}`);

			$('#default-tab-content > div').addClass('hidden');
			$(`#${category.toLowerCase()}`).removeClass('hidden');
		});

		// Helper function to render stars
		function renderStars(rating) {
			let stars = '';
			for (let i = 1; i <= 5; i++) {
				stars += `<i class='bi ${i <= rating ? 'bi-star-fill text-[#f3de6d]' : 'bi-star text-gray-300'}'></i>`;
			}
			return stars;
		}
	});
});

// Computer Accessories
$(document).ready(function () {
	// Fetch JSON data
	$.getJSON('/lib/computer-accessories.json', function (data) {
		let allProducts = data;

		// Function to render products in a specific container
		function renderProducts(products, containerId, limit = 10) {
			const productContainer = $(containerId);
			productContainer.empty();
			const displayedProducts = products.slice(0, limit);

			displayedProducts.forEach((computer_accessries) => {
				const productCard = `
								<div class="card-featured-product bg-white border border-gray-200 rounded-lg shadow relative">
								<a href="#">
									<div class="image-container">
										<img class="pb-4 image-card w-full md:h-44 object-fill" src="${computer_accessries.image}" alt="product image" />
										<div class="icon-overlay">
											<p class="background-heart-icon"><i class="bi bi-heart text-xl"></i></p>
											<button 
												data-id='${computer_accessries.id}'
												data-title='${computer_accessries.title}'
												data-price='${computer_accessries.price}'
												data-image='${computer_accessries.image}'
												class='add-to-cart background-cart-icon'>
												<i class='bi bi-cart-plus text-xl'></i>
											</button>
										</div>
									</div>
								</a>
								<div>
									<div class='flex items-center mt-2'>
										<div class='flex items-center space-x-1 rtl:space-x-reverse'>
											${renderStars(computer_accessries.rating)}
										</div>
										<span class='text-xs font-normal px-1 py-0.5 rounded ms-1'>(${computer_accessries.reviews})</span>
									</div>
									<p class='description-card-featured hover:underline'>${computer_accessries.description}</p>
									<p class='price-card mt-2'>$ ${computer_accessries.price}</p>
								</div>
							</div>`;
				productContainer.append(productCard);
			});
		}

		// Render all products initially
		renderProducts(allProducts, '#product-container-computeraccessories');

		// Filter products based on category when a button is clicked
		$('.filter-computer').on('click', function () {
			const category = $(this).data('category');
			let filteredProducts;

			if (category === 'All') {
				filteredProducts = allProducts;
				$('.filter-computer').attr('aria-selected', false);
				$(this).attr('aria-selected', true);
			} else {
				filteredProducts = allProducts.filter((computer_accessries) => computer_accessries.category.toLowerCase() === category.toLowerCase());
				$('.filter-computer').attr('aria-selected', false);
				$(this).attr('aria-selected', true);
			}

			renderProducts(filteredProducts, `#product-container-${category.toLowerCase()}`);

			$('#featured-tab-content > div').addClass('hidden');
			$(`#${category.toLowerCase()}`).removeClass('hidden');
		});

		// Helper function to render stars
		function renderStars(rating) {
			let stars = '';
			for (let i = 1; i <= 5; i++) {
				stars += `<i class='bi ${i <= rating ? 'bi-star-fill text-[#f3de6d]' : 'bi-star text-gray-300'}'></i>`;
			}
			return stars;
		}
	});
});
