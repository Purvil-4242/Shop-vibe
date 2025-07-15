// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const categoryFilters = document.querySelectorAll('.category-filter');
const sortSelect = document.getElementById('sortSelect');
const applyFiltersBtn = document.getElementById('applyFilters');

// State
let filteredProducts = [...products];

// Update price range display
function updatePriceDisplay() {
    priceValue.textContent = `₹${priceRange.value}`;
}

// Filter products by search term
function filterBySearch(products, searchTerm) {
    return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Filter products by price
function filterByPrice(products, maxPrice) {
    return products.filter(product => product.price <= maxPrice);
}

// Filter products by category
function filterByCategory(products) {
    const selectedCategories = Array.from(categoryFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    return selectedCategories.length === 0 ?
        products :
        products.filter(product => selectedCategories.includes(product.category));
}

// Sort products
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    switch (sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        default:
            return sortedProducts;
    }
}

// Display products
function displayProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <img src="images/no-results.svg" alt="No products found" class="no-results-img">
                <p>No products found matching your criteria</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="quick-view-overlay">
                    <button class="quick-view-btn" onclick="showQuickView(${product.id})">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">${createRatingStars(product.rating)}</div>
                <p class="product-price">₹${product.price}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Quick View Modal
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.classList.add('quick-view-modal');
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-modal" onclick="this.closest('.quick-view-modal').remove()">&times;</button>
            <div class="quick-view-grid">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <div class="product-rating">${createRatingStars(product.rating)}</div>
                    <p class="product-price">₹${product.price}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="quantity-control">
                        <button onclick="updateQuantity(this, -1)">-</button>
                        <input type="number" value="1" min="1" max="10">
                        <button onclick="updateQuantity(this, 1)">+</button>
                    </div>
                    <button onclick="addToCartFromQuickView(${product.id}, this)" class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Update quantity in quick view
function updateQuantity(button, change) {
    const input = button.parentElement.querySelector('input');
    const newValue = Math.max(1, Math.min(10, parseInt(input.value) + change));
    input.value = newValue;
}

// Add to cart from quick view
function addToCartFromQuickView(productId, button) {
    const quantityInput = button.parentElement.querySelector('.quantity-control input');
    const quantity = parseInt(quantityInput.value);
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
    button.closest('.quick-view-modal').remove();
}

// Event Listeners
searchInput.addEventListener('input', () => {
    filteredProducts = filterBySearch(products, searchInput.value);
    displayProducts();
});

priceRange.addEventListener('input', () => {
    updatePriceDisplay();
    filteredProducts = filterByPrice(products, parseInt(priceRange.value));
    displayProducts();
});

categoryFilters.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        filteredProducts = filterByCategory(products);
        displayProducts();
    });
});

sortSelect.addEventListener('change', () => {
    filteredProducts = sortProducts(filteredProducts, sortSelect.value);
    displayProducts();
});

applyFiltersBtn.addEventListener('click', () => {
    filteredProducts = products;
    filteredProducts = filterBySearch(filteredProducts, searchInput.value);
    filteredProducts = filterByPrice(filteredProducts, parseInt(priceRange.value));
    filteredProducts = filterByCategory(filteredProducts);
    filteredProducts = sortProducts(filteredProducts, sortSelect.value);
    displayProducts();
});

// Initial display
displayProducts();