// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1999,
        image: "images/headphones.svg",
        description: "Noise-cancelling, high-quality wireless headphones.",
        category: "Electronics",
        rating: 4.5
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 2999,
        image: "images/smartwatch.svg",
        description: "Feature-rich smartwatch with health tracking.",
        category: "Electronics",
        rating: 4.3
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 599,
        image: "images/tshirt.svg",
        description: "Comfortable cotton t-shirt for daily wear.",
        category: "Fashion",
        rating: 4.0
    },
    {
        id: 4,
        name: "Table Lamp",
        price: 899,
        image: "images/lamp.svg",
        description: "Modern LED table lamp with adjustable brightness.",
        category: "Home",
        rating: 4.2
    },
    {
        id: 5,
        name: "Wireless Earbuds",
        price: 1499,
        image: "images/wireless-earbuds.svg",
        description: "True wireless earbuds with premium sound quality.",
        category: "Electronics",
        rating: 4.4
    },
    {
        id: 6,
        name: "Travel Backpack",
        price: 1299,
        image: "images/backpack.svg",
        description: "Spacious and durable backpack for all your travel needs.",
        category: "Fashion",
        rating: 4.6
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count badge
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Show notification toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Item added to cart');
}

// Calculate GST and total
function calculateTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const gstRate = 0.18;
    const gstAmount = subtotal * gstRate;
    const total = subtotal + gstAmount;

    return {
        subtotal,
        gstAmount,
        total
    };
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="quick-view-overlay">
                    <button class="quick-view-btn" onclick="showQuickView(${product.id})">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    ${createRatingStars(product.rating)}
                </div>
                <p class="product-price">₹${product.price}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `;
}

// Create rating stars HTML
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<span class="star full">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<span class="star half">★</span>';
        } else {
            starsHTML += '<span class="star empty">☆</span>';
        }
    }

    return starsHTML;
}

// Load new arrivals
function loadNewArrivals() {
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    if (newArrivalsGrid) {
        const newArrivals = products.slice(0, 4); // Show first 4 products
        newArrivalsGrid.innerHTML = newArrivals.map(createProductCard).join('');
    }
}

// Mobile menu toggle
function setupMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }
}

// Back to top button functionality
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Page load animation
function handlePageLoad() {
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

// Initialize all functionality
function init() {
    updateCartCount();
    loadNewArrivals();
    setupMobileMenu();
    setupBackToTop();
    handlePageLoad();
}

// Run initialization
init();