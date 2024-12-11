$(document).ready(function () {
	// Retrieve cart data from localStorage
	const cartData = JSON.parse(localStorage.getItem('cart'));
	const cartItemsContainer = $('#shopping-cart');

	// Function to update the Cart UI
	function updateCartUI() {
		cartItemsContainer.empty();
		if (cartData && typeof cartData === 'object') {
			let totalItems = 0;
			Object.entries(cartData).forEach(([productId, item]) => {
				totalItems += item.quantity;
				const cartItemHtml = `
            <div class="py-4 border-b">
                <div class="flex justify-between md:items-center gap-4">
                    <div class="flex items-center gap-4">
                        <img src="${item.image}" alt="${item.image}" class="w-24 h-24 rounded" />
                        <article>
                            <h2 class="text-lg font-semibold cursor-pointer" title="${item.title}">
                              ${item.title.length > 30 ? item.title.slice(0, 30) + '...' : item.title}
                            </h2>
                            <p class="text-sm text-gray-500">Category: ${item.category} 
                              <span class="text-red-500 text-md pl-4">x ${item.quantity}</span>
                            </p> 
                            <div class="flex items-center text-yellow-500 text-sm mt-1">
                              <span><i class="bi bi-star-fill text-yellow-300 text-md"></i> ${item.rating}/5.0</span>
                              <span class="text-gray-500 ml-2">(${item.reviews} ratings)</span>
                            </div>
                            <div class="md:hidden flex gap-3">  
                              <button class="remove-from-cart text-red-500 hover:underline" data-id="${item.id}">Remove</button>
                              <button class="save-for-later text-blue-500 hover:underline" data-id="${item.id}">Save for later</button>
                            </div>
                        </article>
                    </div>
                    <div class="hidden md:block">
                        <div class="flex flex-col">
                          <button class="remove-from-cart text-red-500 hover:underline" data-id="${item.id}">Remove</button>
                          <button class="save-for-latertext-blue-500 hover:underline" data-id="${item.id}">Save for later</button>
                        </div>
                    </div>
                    <div class="text-right">
                      <p class="text-md md:text-xl font-bold text-purple-600">$${item.price}</p>
                      <p class="text-sm md:text-sm line-through text-gray-400">$${(item.price * 1.5).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;
				cartItemsContainer.append(cartItemHtml);
			});

			// Update total count in cart icon
			$('.total-count-shopping-cart').text(totalItems);

			// Update cart summary
			calculateCartTotal();
		} else {
			cartItemsContainer.html('<p class="text-gray-500">No items to display.</p>');
		}
	}

	// Function to calculate and display cart totals
	function calculateCartTotal() {
		let originalPrice = 0;
		let totalDiscount = 0;

		if (cartData && typeof cartData === 'object') {
			Object.values(cartData).forEach((item) => {
				originalPrice += item.price * item.quantity;
				totalDiscount += item.price * 0.15 * item.quantity; // Assuming a 15% discount
			});

			const finalTotal = originalPrice - totalDiscount;

			$('.cart-total-original-price').text(`$${originalPrice.toFixed(2)}`);
			$('.cart-total-discounts').text(`-$${totalDiscount.toFixed(2)}`);
			$('.cart-total-final').text(`$${finalTotal.toFixed(2)}`);
		}
	}

	// Remove item from cart
	$(document).on('click', '.remove-from-cart', function () {
		const productIdToRemove = $(this).data('id');
		if (cartData[productIdToRemove]) {
			delete cartData[productIdToRemove];
			localStorage.setItem('cart', JSON.stringify(cartData));
			updateCartUI();
		}
	});

	// Save item for later
	$(document).on('click', '.save-for-later', function () {
		const productId = $(this).data('id');
		if (cartData[productId]) {
			delete cartData[productId];
			localStorage.setItem('cart', JSON.stringify(cartData));
			updateCartUI();
			alert('Item saved for later!');
		}
	});

	// btn checkout
	$('.checkout-btn').on('click', function () {
		const cartData = localStorage.getItem('cart');
		if (cartData) {
			localStorage.setItem('checkoutCart', cartData);
			window.location.href = 'payment.html';
		} else {
			alert('Your cart is empty. Please add items to proceed.');
		}
	});

	// rendering data to the cart
	$(document).ready(function () {
		const cartData = JSON.parse(localStorage.getItem('checkoutCart'));
		const paymentItemsContainer = $('#payment-items-container');
		paymentItemsContainer.empty();

		if (cartData && typeof cartData === 'object') {
			Object.entries(cartData).forEach(([productId, item]) => {
				const completeItemPayment = `
          <div class="flex items-center mb-4 border-b py-2">
            <img src="${item.image}" alt="${item.title}" class="w-20 h-20 rounded-lg" />
            <div class="ml-4 flex-1">
              <p class="font-medium text-gray-700">${item.title}</p>
              <p class="text-purple-600 font-semibold">$${item.price.toFixed(2)}</p>
            </div>
          </div>
        `;
				paymentItemsContainer.append(completeItemPayment);
			});
		} else {
			paymentItemsContainer.html('<p class="text-gray-500">No items to display.</p>');
		}
	});

	// Initialize cart UI
	updateCartUI();
});
