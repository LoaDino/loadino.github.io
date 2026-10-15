const tg = window.Telegram?.WebApp;

tg?.ready();
tg?.expand();

const params = new URLSearchParams(window.location.search);

const token = params.get("token");
const productIds = params.getAll("product_id");
const photos = params.getAll("photo");
const sgs = params.getAll("sg");
const etms = params.getAll("etm");
const amounts = params.getAll("amount");

const productsElement = document.getElementById("products");
const statusElement = document.getElementById("status");

const photoCache = new Map();

async function getPhotoUrl(fileId) {
    if (photoCache.has(fileId)) {
        return photoCache.get(fileId);
    }

    const response = await fetch(
        `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`
    );

    if (!response.ok) {
        throw new Error(`Ошибка HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.ok || !data.result?.file_path) {
        throw new Error("Не удалось получить фотографию из Telegram");
    }

    const url =
        `https://api.telegram.org/file/bot${token}/${data.result.file_path}`;

    photoCache.set(fileId, url);

    return url;
}

function createField(label, value) {
    const field = document.createElement("div");
    field.className = "field";

    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;

    const text = document.createElement("span");

    if (label === "Дата" && value) {
        const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
        text.textContent = match
            ? `${match[3]}.${match[2]}.${match[1]}`
            : value;
    } else if (label === "ЭТМ") {
        text.textContent = String(value) === "1" ? "Да" : "Нет";
    } else {
        text.textContent = value ?? "";
    }

    field.append(strong, text);
    return field;
}

function createProduct(product) {
    const card = document.createElement("article");
    card.className = "product";

    const img = document.createElement("img");
    img.alt = "Фото товара";
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const id = document.createElement("div");
    id.className = "product-id";
    id.textContent = `Товар #${product.id}`;

    info.append(
        id,
        createField("SG", product.sg),
        createField("ETM", product.etm),
        createField("Количество", product.amount)
    );

    card.append(img, info);

    if (product.photo) {
        getPhotoUrl(product.photo)
            .then(url => {
                img.src = url;
            })
            .catch(error => {
                console.error(
                    `Ошибка загрузки фото товара ${product.id}:`,
                    error
                );

                img.alt = "Не удалось загрузить фотографию";
                img.classList.add("image-error");
            });
    } else {
        img.alt = "Фото отсутствует";
        img.classList.add("image-error");
    }

    return card;
}

async function loadProducts() {
    if (!token) {
        throw new Error("В URL отсутствует токен бота");
    }

    const lengths = [
        productIds.length,
        photos.length,
        sgs.length,
        etms.length,
        amounts.length
    ];

    if (!lengths.every(length => length === productIds.length)) {
        throw new Error("Количество параметров товаров не совпадает");
    }

    const products = productIds.map((id, index) => ({
        id,
        photo: photos[index],
        sg: sgs[index],
        etm: etms[index],
        amount: amounts[index]
    }));

    if (products.length === 0) {
        statusElement.textContent = "Товаров нет";

        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "Нет товаров для отображения";

        productsElement.appendChild(empty);
        return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        fragment.appendChild(createProduct(product));
    });

    productsElement.appendChild(fragment);

    statusElement.textContent = `Товаров: ${products.length}`;
}

loadProducts().catch(error => {
    console.error(error);

    statusElement.textContent = "Не удалось загрузить каталог";

    const message = document.createElement("div");
    message.className = "error";
    message.textContent = error.message;

    productsElement.appendChild(message);
});