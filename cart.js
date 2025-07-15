// DOM Elements
const cartContent = document.getElementById('cartContent');
const subtotalElement = document.getElementById('subtotal');
const discountRow = document.getElementById('discountRow');
const discountElement = document.getElementById('discount');
const gstElement = document.getElementById('gst');
const totalElement = document.getElementById('total');
const promoCodeInput = document.getElementById('promoCode');
const applyPromoBtn = document.getElementById('applyPromo');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');

// Variables
let discount = 0;
const PROMO_CODE = 'WELCOME10';
const DISCOUNT_PERCENTAGE = 10;

// Display cart items
function displayCart() {
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="cta-button">Start Shopping</a>
            </div>
        `;
        return;
    }

    cartContent.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">₹${item.price}</p>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                <input type="number" value="${item.quantity}" min="1" max="10" 
                    onchange="updateQuantityInput(${item.id}, this.value)">
                <button class="qty-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>
                </svg>
            </button>
        </div>
    `).join('');

    updateCartSummary();
}

// Update quantity from input
function updateQuantityInput(productId, value) {
    const quantity = parseInt(value);
    if (quantity >= 1 && quantity <= 10) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartSummary();
        }
    }
}

// Update quantity with buttons
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCart();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
    showToast('Item removed from cart');
}

// Apply promo code
applyPromoBtn.addEventListener('click', () => {
    const promoCode = promoCodeInput.value.trim().toUpperCase();
    if (promoCode === PROMO_CODE) {
        discount = DISCOUNT_PERCENTAGE;
        discountRow.style.display = 'flex';
        updateCartSummary();
        showToast('Promo code applied successfully!');
        promoCodeInput.disabled = true;
        applyPromoBtn.disabled = true;
    } else {
        showToast('Invalid promo code');
    }
});

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const discountedSubtotal = subtotal - discountAmount;
    const gstAmount = discountedSubtotal * 0.18;
    const total = discountedSubtotal + gstAmount;

    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    discountElement.textContent = `-₹${discountAmount.toFixed(2)}`;
    gstElement.textContent = `₹${gstAmount.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
}

// Handle checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }
    checkoutModal.style.display = 'block';
});

// Close modal when clicking outside
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
});

// Handle form submission
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate order processing
    checkoutModal.style.display = 'none';
    showProcessingAnimation();

    setTimeout(() => {
        // Clear cart
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();

        // Redirect to thank you page
        window.location.href = 'thank-you.html';
    }, 2000);
});

// Show processing animation
function showProcessingAnimation() {
    const processing = document.createElement('div');
    processing.classList.add('processing-overlay');
    processing.innerHTML = `
        <div class="processing-content">
            <div class="spinner"></div>
            <p>Processing your order...</p>
        </div>
    `;
    document.body.appendChild(processing);
}

// Initial display
displayCart();