document.addEventListener('DOMContentLoaded', function() {
    fetch('../products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
            setupFilters(products);
            loadCartState(products);
        })
        .catch(error => console.error('Ошибка загрузки товаров:', error));

    function displayProducts(products) {
        const container = document.getElementById('products-container');
        container.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <a href="../product/index.html?id=${product.id}" class="product-link">
                    <img src="../${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price.toLocaleString()} руб.</p>
                </a>
                <button class="add-to-cart" data-id="${product.id}">
                    В корзину
                </button>
            </div>
        `).join('');
    }

    function setupFilters(products) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                const productCards = document.querySelectorAll('.product-card');
                
                productCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    function loadCartState(products) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.forEach(productId => {
            const btn = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check"></i> В корзине';
                btn.classList.add('in-cart');
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (e.target.classList.contains('in-cart')) {
                cart = cart.filter(id => id !== productId);
                e.target.innerHTML = 'В корзину';
                e.target.classList.remove('in-cart');
            } else {
                cart.push(productId);
                e.target.innerHTML = '<i class="fas fa-check"></i> В корзине';
                e.target.classList.add('in-cart');
            }

            localStorage.setItem('cart', JSON.stringify(cart));
        }
    });
});