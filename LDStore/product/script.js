document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 1; 

    fetch('../products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (product) {
                displayProduct(product);
                loadRelatedProducts(products, product);
            } else {
                document.querySelector('.product-page').innerHTML = `
                    <div class="error-message">
                        <h2>Товар не найден</h2>
                        <a href="../mainpage/index.html#catalog" class="btn-primary">Вернуться в каталог</a>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки товара:', error);
        });

    function addSpecRow(table, name, value) {
        const row = table.insertRow();
        const cellName = row.insertCell(0);
        const cellValue = row.insertCell(1);
        
        cellName.textContent = name;
        cellValue.textContent = value;
        
        cellName.style.padding = '8px 16px 8px 0';
        cellName.style.fontWeight = 'bold';
        cellValue.style.padding = '8px 0';
    }

    function displayProduct(product) {
        document.title = `${product.name} | Lost Dimension Store`;
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-sku').textContent = product.sku;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('description').innerHTML = product.description_full.replace(/\n/g, '<br>');;
        const specsTab = document.getElementById('specs')

        specsTab.innerHTML = '<h3>Характеристики</h3>';
    
        const specsTable = document.createElement('table');
        
        if (product.material) {
            addSpecRow(specsTable, 'Материал', product.material);
        }
        if (product.tracklist) {
            addSpecRow(specsTable, 'Размеры', product.tracklist.join(', '));
        }
        if (product.year) {
            addSpecRow(specsTable, 'Год выпуска альбома:', product.year);
        }
        if (product.weight) {
            addSpecRow(specsTable, 'Вес', product.weight);
        }
        if (product.country) {
            addSpecRow(specsTable, 'Страна производства', product.country);
        }
        
        if (product.specs) {
            for (const [key, value] of Object.entries(product.specs)) {
                addSpecRow(specsTable, key, value);
            }
        }
        
        specsTab.appendChild(specsTable);

        
        document.getElementById('current-price').textContent = 
            `${product.price.toLocaleString()} руб.`;
        
        if (product.oldPrice) {
            document.getElementById('old-price').textContent = 
                `${product.oldPrice.toLocaleString()} руб.`;
            
            const discount = Math.round((1 - product.price / product.oldPrice) * 100);
            document.querySelector('.discount').textContent = `-${discount}%`;
        } else {
            document.getElementById('old-price').style.display = 'none';
            document.querySelector('.discount').style.display = 'none';
        }
        
        if (product.images && product.images.length > 0) {
            const mainImg = document.getElementById('main-image');
            mainImg.src = `../${product.images[0]}`;
            mainImg.alt = product.name;
            
            const thumbnails = document.querySelector('.thumbnails');
            thumbnails.innerHTML = '';
            
            product.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = `../${img}`;
                thumb.alt = `Миниатюра ${index + 1}`;
                thumb.addEventListener('click', () => {
                    mainImg.src = thumb.src;
                });
                thumbnails.appendChild(thumb);
            });
        }
        
        document.getElementById('add-to-cart').addEventListener('click', function() {
            addToCart(product);
        });
        
        document.getElementById('buy-now').addEventListener('click', function() {
            addToCart(product, true);
        });
        
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = document.getElementById('product-qty');
                let value = parseInt(input.value);
                
                if (this.classList.contains('minus')) {
                    if (value > 1) input.value = value - 1;
                } else {
                    input.value = value + 1;
                }
            });
        });
    }
    
    function loadRelatedProducts(products, currentProduct) {
        const related = products.filter(p => 
            p.category === currentProduct.category && p.id != currentProduct.id
        ).slice(0, 4);
        
        const container = document.getElementById('related-products');
        
        if (related.length > 0) {
            container.innerHTML = related.map(product => `
                <div class="product-card">
                    <a href="index.html?id=${product.id}">
                        <img src="../${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.price.toLocaleString()} руб.</p>
                    </a>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>Нет похожих товаров</p>';
        }
    }
    
    function addToCart(product, redirect = false) {
        const quantity = parseInt(document.getElementById('product-qty').value);
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        for (let i = 0; i < quantity; i++) {
            cart.push(productId);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        if (redirect) {
            window.location.href = '../cart/index.html';
        } else {
            showCartNotification(product.name, quantity);
        }
    }

    function showCartNotification(productName, quantity) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${quantity > 1 ? `${quantity} × ` : ''}${productName} добавлен${quantity > 1 ? 'ы' : ''} в корзину</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => 
                b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-panel').forEach(p => 
                p.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
});