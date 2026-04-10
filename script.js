// Product Data
const products = [
    {
        id: 1,
        name: "Mango Achar",
        price500g: 200,
        price1kg: 380,
        image: "Images/Mango Achar.jpg",
        desc: "Hand-cut raw mangoes sun-dried and matured in a rich blend of mustard oil, fenugreek, and fennel seeds. A timeless classic."
    },
    {
        id: 2,
        name: "Mirchi Achar",
        price500g: 170,
        price1kg: 300,
        image: "Images/Mirchi Achar.jpg",
        desc: "Fresh green chillies slit and stuffed with a tangy, spicy masala mix. A fiery companion to your parathas."
    },
    {
        id: 3,
        name: "Adrak Achar",
        price500g: 300,
        price1kg: 580,
        image: "Images/Adrak Achar.jpg",
        desc: "Tender ginger strips pickled in lemon juice and spices. A zesty, digestive aid that warms the soul."
    },
    {
        id: 4,
        name: "Amla Achar",
        price500g: 180,
        price1kg: 350,
        image: "Images/Amla Achar.jpg",
        desc: "Whole Indian gooseberries steeped in spices. A perfect balance of sour and spicy, packed with tradition and health."
    },
    {
        id: 5,
        name: "Haldi Achar",
        price500g: 220,
        price1kg: 400,
        image: "Images/Haldi Achar.jpg",
        desc: "Fresh turmeric roots pickled to perfection. An earthy, immunity-boosting delight with a golden hue."
    },
    {
        id: 6,
        name: "Lasson Achar",
        price500g: 250,
        price1kg: 480,
        image: "Images/Lasson Achar.jpg",
        desc: "Whole garlic cloves slow-matured in mustard oil and red chilli powder. A robust, pungent flavor for the bold palate."
    }
];


// State
let cart = {};

// Elements
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountEl = document.getElementById('total-amount');
const orderForm = document.getElementById('order-form');

// Initialize
function init() {
    renderProducts();
    updateCartDisplay();
    setupAnimations();
}

// Scroll Animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Observe hero elements immediately
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroContent) heroContent.classList.add('reveal-visible');
    if (heroVisual) heroVisual.classList.add('reveal-visible');
}

// Notification Logic
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.innerText = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Render Products
function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                
                <div class="price-options">
                    <div class="price-row">
                        <span>500g - <span class="price-tag">₹${product.price500g}</span></span>
                        <button class="btn-sm" onclick="addToCart(${product.id}, '500g')">Add</button>
                    </div>
                    <div class="price-row">
                        <span>1kg - <span class="price-tag">₹${product.price1kg}</span></span>
                        <button class="btn-sm" onclick="addToCart(${product.id}, '1kg')">Add</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to Cart
window.addToCart = function (id, size) {
    const key = `${id}_${size}`;
    if (cart[key]) {
        cart[key]++;
    } else {
        cart[key] = 1;
    }
    updateCartDisplay();
    showNotification(`Added ${size} to cart! 🛒`);

    // Scroll to order section if it's the first item
    if (Object.keys(cart).length === 1 && cart[key] === 1) {
        const orderSection = document.getElementById('order');
        if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// Remove/Decrease from Cart
window.changeQty = function (key, change) {
    if (cart[key]) {
        cart[key] += change;
        if (cart[key] <= 0) {
            delete cart[key];
        }
    }
    updateCartDisplay();
};

// Update Cart UI
function updateCartDisplay() {
    if (!cartItemsContainer || !totalAmountEl) return;

    const cartKeys = Object.keys(cart);

    if (cartKeys.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your basket is empty. Add some delicious achaar!</p>';
        totalAmountEl.innerText = '0';
        return;
    }

    let total = 0;

    cartItemsContainer.innerHTML = cartKeys.map(key => {
        const [id, size] = key.split('_');
        const product = products.find(p => p.id == id);
        const qty = cart[key];
        const price = size === '500g' ? product.price500g : product.price1kg;
        const itemTotal = price * qty;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div>
                    <strong>${product.name}</strong> <span style="font-size: 0.8rem; background: #eee; padding: 2px 6px; border-radius: 4px;">${size}</span>
                    <div style="font-size: 0.85rem; color: #666;">₹${price} x ${qty}</div>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="changeQty('${key}', -1)">-</button>
                    <span>${qty}</span>
                    <button class="qty-btn" onclick="changeQty('${key}', 1)">+</button>
                </div>
            </div>
        `;
    }).join('');

    totalAmountEl.innerText = total;
}

// Handle Form Submission
window.addEventListener('load', () => {
    init(); // Initialize the app
});

window.closeModal = function () {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

window.showSampleInfo = function () {
    const modal = document.getElementById('sample-modal');
    if (modal) {
        modal.classList.add('active');
    }
};

window.closeSampleModal = function () {
    const modal = document.getElementById('sample-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

window.openPolicyModal = function () {
    const modal = document.getElementById('policy-modal');
    if (modal) modal.classList.add('active');
};

window.closePolicyModal = function () {
    const modal = document.getElementById('policy-modal');
    if (modal) modal.classList.remove('active');
};

window.shareScreenshot = function () {
    const total = document.getElementById('inv-total').innerText;
    const phone = "919785054474"; // Your WhatsApp number
    const message = `Hi, I have just paid ${total} for my order! Here is my payment screenshot for verification.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

window.previewInvoice = function () {
    if (Object.keys(cart).length === 0) {
        showNotification("Add some items to your cart first!");
        return;
    }

    let total = 0;
    const items = Object.keys(cart).map(key => {
        const [id, size] = key.split('_');
        const product = products.find(p => p.id == id);
        const price = size === '500g' ? product.price500g : product.price1kg;
        const itemTotal = price * cart[key];
        total += itemTotal;
        return { name: product.name, size: size, qty: cart[key], price: price };
    });

    const orderData = {
        name: document.getElementById('name').value || "Preview Customer",
        phone: document.getElementById('phone').value || "N/A",
        address: document.getElementById('address').value || "Draft Address",
        payment: (document.querySelector('input[name="payment"]:checked') || {}).value || "Not Selected",
        items: items,
        total: total,
        isPreview: true
    };
    
    openInvoice(orderData);
};

window.openInvoice = function (data) {
    const modal = document.getElementById('invoice-modal');
    if (!modal) return;

    // Set Watermark
    const watermark = document.getElementById('invoice-watermark');
    if (watermark) watermark.style.display = data.isPreview ? 'block' : 'none';

    // Set Metadata
    document.getElementById('inv-id').innerText = '#INV-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('inv-date').innerText = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    // Set Customer info
    document.getElementById('inv-name').innerText = data.name;
    document.getElementById('inv-phone').innerText = data.phone;
    document.getElementById('inv-address').innerText = data.address;
    document.getElementById('inv-payment').innerText = data.payment;
    document.getElementById('inv-status').innerText = data.isPreview ? 'DRAFT' : 'CONFIRMED';

    // Load Items
    const itemsContainer = document.getElementById('inv-items');
    itemsContainer.innerHTML = data.items.map(item => `
        <tr style="border-bottom: 1px solid #f5f5f5;">
            <td style="padding: 10px;">
                <div style="font-weight: 600;">${item.name}</div>
                <div style="font-size: 0.75rem; color: #777;">Size: ${item.size}</div>
            </td>
            <td style="text-align: center; padding: 10px;">${item.qty}</td>
            <td style="text-align: right; padding: 10px;">₹${item.price * item.qty}</td>
        </tr>
    `).join('');

    document.getElementById('inv-subtotal').innerText = '₹' + data.total;
    document.getElementById('inv-total').innerText = '₹' + data.total;

    // Handle Payment Section (QR & Button)
    const paymentOptions = document.getElementById('payment-options');
    const upiPayLink = document.getElementById('upi-pay-link');
    
    if (data.payment === 'Online Banking') {
        paymentOptions.style.display = 'block';
        // Generate UPI URL: upi://pay?pa=7597901057@upi&pn=MomsAchaar&am=AMOUNT&cu=INR
        const upiID = "7597901057@upi";
        const upiUrl = `upi://pay?pa=${upiID}&pn=MomsAchaar&am=${data.total}&cu=INR`;
        upiPayLink.href = upiUrl;
    } else {
        paymentOptions.style.display = 'none';
    }

    modal.classList.add('active');
};

window.closeInvoiceModal = function () {
    const modal = document.getElementById('invoice-modal');
    if (modal) modal.classList.remove('active');
};

// Handle Form Submission
if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const instructions = document.getElementById('instructions').value;
        const payment = document.querySelector('input[name="payment"]:checked').value;

        if (Object.keys(cart).length === 0) {
            showNotification("Your cart is empty! Add some items first.");
            return;
        }

        let total = 0;
        const items = Object.keys(cart).map(key => {
            const [id, size] = key.split('_');
            const product = products.find(p => p.id == id);
            const price = size === '500g' ? product.price500g : product.price1kg;
            const itemTotal = price * cart[key];
            total += itemTotal;
            return { name: product.name, size: size, qty: cart[key], price: price };
        });

        const orderData = { name, phone, address, payment, items, total, isPreview: false };

        // Construct Message
        let message = `NAMASTE! I want to order Mom's Special Achaar!\n\n`;
        message += `CUSTOMER DETAILS:\n`;
        message += `Name: ${name}\n`;
        message += `Phone: ${phone}\n`;
        message += `Address: ${address}\n`;
        message += `Payment: ${payment}\n`;
        if (instructions) message += `Note: ${instructions}\n`;
        
        message += `\nORDER SUMMARY:\n`;
        orderData.items.forEach(item => {
            message += `- ${item.name} (${item.size}) x ${item.qty} = Rs. ${item.price * item.qty}\n`;
        });
        
        message += `\nTOTAL AMOUNT: Rs. ${total}\n`;
        message += `\nPlease confirm my order!`;

        const phoneNumber = "919785054474";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        showNotification("Order sent! Opening your invoice...");
        openInvoice(orderData);
    });
}


// Handle Sample Form Submission
const sampleForm = document.getElementById('sample-form');
if (sampleForm) {
    sampleForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const phone = document.getElementById('sample-phone').value;
        const address = document.getElementById('sample-address').value;
        const acharType = document.getElementById('sample-type').value;

        let message = `NAMASTE! I would like to request a FREE SAMPLE!\n\n`;
        message += `CUSTOMER DETAILS:\n`;
        message += `Phone: ${phone}\n`;
        message += `Address: ${address}\n\n`;
        message += `SAMPLE REQUESTED:\n`;
        message += `Achar Type: ${acharType}\n\n`;
        message += `Please confirm my sample request!`;

        // WhatsApp URL
        const phoneNumber = "919785054474";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(url, '_blank');
        
        // Notification
        showNotification("Sample request sent! The owner will provide the delivery date on WhatsApp.");
        closeSampleModal();
    });
}