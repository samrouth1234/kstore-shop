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

		// Show alert message
		showAlertMessage();
	}

	// Function to show alert message
	function showAlertMessage() {
		const alertMessage = $('#alert-message');
		alertMessage.removeClass('hidden'); // Show the alert
		setTimeout(() => {
			alertMessage.addClass('hidden'); // Hide after 3 seconds
		}, 3000);
  }
	
	// Update the cart UI
	function updateCartUI() {
		const cartItemsContainer = $('.cart-items');
		const cartCount = $('.cart-count');
		cartItemsContainer.empty();

		let totalItems = 0;
		let hasItems = false;

		$.each(cart, function (key, item) {
			hasItems = true;
			totalItems += item.quantity;

			// Add item to the cart dropdown
			cartItemsContainer.append(`
				<div class="flex items-center gap-3 p-2 border-b">
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

		// Toggle visibility of the cart dropdown
		if (hasItems) {
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
		localStorage.setItem('cart', JSON.stringify(cart));
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
			image: $(this).data('image'),
			rating: $(this).data('rating'),
			reviews: $(this).data('reviews'),
			category: $(this).data('category'),
			description: $(this).data('description'),
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
														data-rating='${product.rating}'
														data-reviews='${product.reviews}'
														data-category='${product.category}'
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

		// Render "Might Also Like" products
		function renderMightAlsoLike(products) {
			const mightAlsoLikeContainer = $('.items-might-like');
			mightAlsoLikeContainer.empty();

			const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 5); // Select 4 random products

			randomProducts.forEach((product) => {
					const mightAlsoLikeHtml = `
						<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
							<div class="flex justify-center ">
								<img class="rounded-t-lg w-44 h-44 " src="${product.image}" alt="${product.title}" />		
							</div>
							<div class="px-4 py-5">
								<h5 class="text-xl font-semibold tracking-tight text-gray-900 cursor-pointer" title="${product.description}">
								${product.description.length > 30 ? product.description.slice(0, 30) + '...' : product.description}
								</h5>
								<div class="flex items-center mt-2.5 mb-3">
									<div class="flex items-center space-x-2 rtl:space-x-reverse">
										${renderStars(product.rating)} 
										<span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ms-3">${product.rating}.0</span>
									</div>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-2xl font-bold text-gray-900">$ ${product.price}</span>
									<button 
										class="add-to-cart text-white background-primary-color font-medium rounded-lg text-md px-3 py-2 text-center" 
										data-id='${product.id}'
										data-title='${product.title}'
										data-price='${product.price}'
										data-image='${product.image}'
										data-rating='${product.rating}'
										data-reviews='${product.reviews}'
										data-category='${product.category}'
										data-description='${product.description}'
									>
										Add to cart
									</button>
								</div>
            </div>`;
					mightAlsoLikeContainer.append(mightAlsoLikeHtml);
			});
		}

		// Render "Might Also Like" section
		renderMightAlsoLike(allProducts);

		// Render Shopping Cart
		function renderShoppingPage(products) {
			const shoppingPageContainer = $('#shopping-container');
			shoppingPageContainer.empty();

			const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 9);

			randomProducts.forEach((product) => {
					const shoppingItemHtml = `
						<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
							<div class="flex justify-center ">
								<img class="rounded-t-lg w-44 h-44" src="${product.image}" alt="${product.title}" />		
							</div>
							<div class="px-4 py-5">
								<h5 class="text-xl font-semibold tracking-tight text-gray-900 cursor-pointer" title="${product.description}">
									${product.description.length > 40 ? product.description.slice(0, 35) + '...' : product.description}
								</h5>
								<div class="flex items-center mt-2.5 mb-4">
									<div class="flex items-center space-x-2 rtl:space-x-reverse">
										${renderStars(product.rating)} 
										<span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ms-3">${product.rating}.0</span>
									</div>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-2xl font-bold text-gray-900">$ ${product.price}</span>
									<button 
										class="add-to-cart text-white background-primary-color font-medium rounded-lg text-md px-3 py-2 text-center hover:bg-[#ffd050] hover:text-[#232536]" 
										data-id='${product.id}'
										data-title='${product.title}'
										data-price='${product.price}'
										data-image='${product.image}'
										data-rating='${product.rating}'
										data-reviews='${product.reviews}'
										data-category='${product.category}'
										data-description='${product.description}'
									>
										Add to cart
									</button>
								</div>
            </div>`;
					shoppingPageContainer.append(shoppingItemHtml);
			});
		}

		// Render Shopping Page
		renderShoppingPage(allProducts);

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
									<div>
										<div class="image-container">
											<img class="pb-4 image-card w-full md:h-44 object-fill" src="${computer_accessries.image}" alt="product image" />
											<div class="icon-overlay">
												<p class="background-heart-icon"><i class="bi bi-heart text-xl"></i></p>
												<button 
													data-id='${computer_accessries.id}'
													data-title='${computer_accessries.title}'
													data-price='${computer_accessries.price}'
													data-image='${computer_accessries.image}'
													data-rating='${computer_accessries.rating}'
													data-reviews='${computer_accessries.reviews}'
													data-category='${computer_accessries.category}'
													class='add-to-cart background-cart-icon'>
													<i class='bi bi-cart-plus text-xl'></i>
												</button>
											</div>
										</div>
									</div>
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
