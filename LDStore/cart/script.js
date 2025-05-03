document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Ваша корзина пуста</p>
                <a href="../mainpage/index.html#catalog" class="btn-primary">Перейти в каталог</a>
            </div>
        `;
        updateSummary(0, 0);
        return;
}

fetch('../products.json')
    .then(response => response.json())
    .then(products => {
        displayCartItems(products, cart);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
        cartItemsContainer.innerHTML = '<p>Ошибка загрузки корзины</p>';
    });

function displayCartItems(products, cartItems) {
    let total = 0;
    let html = '';
    
    const itemCounts = {};
    cartItems.forEach(id => {
        itemCounts[id] = (itemCounts[id] || 0) + 1;
    });
    
    Object.keys(itemCounts).forEach(id => {
        const product = products.find(p => p.id == id);
        if (product) {
            const quantity = itemCounts[id];
            const itemTotal = product.price * quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item" data-id="${id}">
                    <img src="../${product.image}" alt="${product.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${product.name}</div>
                        <div class="cart-item-price">${product.price.toLocaleString()} руб.</div>
                        <div class="quantity-control">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity-value">${quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove"><i class="fas fa-times"></i></button>
                </div>
            `;
        }
    });
    
    cartItemsContainer.innerHTML = html;
    updateSummary(total, cartItems.length);
    setupEventListeners();
}

function updateSummary(total, itemsCount) {
    const delivery = itemsCount > 0 ? 500 : 0;
    const totalWithDelivery = total + delivery;
    
    document.querySelector('.summary-row:nth-child(1) span:first-child').textContent = 
        `Товары (${itemsCount})`;
    document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = 
        `${total.toLocaleString()} руб.`;
    document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = 
        itemsCount > 0 ? `${delivery.toLocaleString()} руб.` : '0 руб.';
    document.querySelector('.summary-row.total span:last-child').textContent = 
        `${totalWithDelivery.toLocaleString()} руб.`;
}

function setupEventListeners() {
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').dataset.id;
            removeFromCart(itemId);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').dataset.id;
            updateQuantity(itemId, 1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').dataset.id;
            updateQuantity(itemId, -1);
        });
    });
    
    document.querySelector('.btn-checkout').addEventListener('click', function() {
        alert('Заказ оформлен! Спасибо за покупку!');
        localStorage.removeItem('cart');
        location.reload();
    });
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(itemId => itemId != id);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}

function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (change > 0) {
        cart.push(id);
    } else {
        const index = cart.indexOf(id);
        if (index > -1) {
            cart.splice(index, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}
});