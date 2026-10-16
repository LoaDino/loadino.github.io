
const tg = window.Telegram?.WebApp;

tg?.ready();
tg?.expand();

const params = new URLSearchParams(window.location.search);

const token = params.get("token");
const updatedAt = params.get("updated_at");

const productIds = params.getAll("product_id");
const photos = params.getAll("photo");
const sgs = params.getAll("sg");
const etms = params.getAll("etm");
const amounts = params.getAll("amount");

const productsElement = document.getElementById("products");
const statusElement = document.getElementById("status");
const filterElement = document.getElementById("product-filter");
const updatedAtElement = document.getElementById("updated-at");

const photoCache = new Map();
let products = [];

if (updatedAtElement) {
    updatedAtElement.textContent = updatedAt
        ? `⚠️ Данные актуальны на момент: ${updatedAt}`
        : "⚠️ Время актуальности данных неизвестно";
}

function getMoscowToday() {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Moscow",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const values = {};

    for (const part of parts) {
        values[part.type] = part.value;
    }

    return Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day)
    );
}

function getDaysLeft(dateString) {
    const match = String(dateString ?? "").match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const expiryTime = Date.UTC(year, month - 1, day);
    const checkDate = new Date(expiryTime);

    // Не принимаем некорректные даты
    if (
        checkDate.getUTCFullYear() !== year ||
        checkDate.getUTCMonth() !== month - 1 ||
        checkDate.getUTCDate() !== day
    ) {
        return null;
    }

    return Math.round(
        (expiryTime - getMoscowToday()) / 86400000
    );
}

function formatDate(value) {
    const match = String(value ?? "").match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    return match
        ? `${match[3]}.${match[2]}.${match[1]}`
        : String(value ?? "");
}


function getProductStatus(product) {
    const daysLeft = getDaysLeft(product.sg);

    if (daysLeft === null) {
        return {
            type: "unknown",
            label: "Неизвестный срок годности",
            daysLeft: null,
            discountPercent: null
        };
    }

    if (daysLeft <= 0) {
        return {
            type: "expired",
            label: daysLeft === 0
                ? "Срок истёк сегодня"
                : `Просрочен на ${Math.abs(daysLeft)} дн.`,
            daysLeft,
            discountPercent: null
        };
    }

    const isEtm = String(product.etm) === "1";

    if (isEtm) {
        return {
            type: daysLeft <= 180 ? "discount" : "normal",
            label: daysLeft <= 180 ? "Уценённый" : "Не уценённый",
            daysLeft,
            discountPercent: null
        };
    }

    if (daysLeft <= 30) {
        return {
            type: "discount",
            label: "Уценённый",
            daysLeft,
            discountPercent: 50
        };
    }

    if (daysLeft <= 96) {
        return {
            type: "discount",
            label: "Уценённый",
            daysLeft,
            discountPercent: 40
        };
    }

    return {
        type: "normal",
        label: "Не уценённый",
        daysLeft,
        discountPercent: null
    };
}


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

    if (label === "Срок годности") {
        text.textContent = formatDate(value);
    } else if (label === "ЭТМ") {
        const etmValue = String(value ?? "");

        text.textContent = etmValue === "1"
            ? "Да"
            : etmValue === "0"
                ? "Нет"
                : etmValue;
    } else {
        text.textContent = value ?? "";
    }

    field.append(strong, text);
    return field;
}

function createProduct(product) {
    const card = document.createElement("article");
    card.className = `product status-${product.status.type}`;

    const img = document.createElement("img");
    img.alt = "Фото товара";
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const id = document.createElement("div");
    id.className = "product-id";
    id.textContent = `Товар #${product.id}`;

    const status = document.createElement("div");
    status.className = "product-status";
    status.textContent = product.status.label;

    if (product.status.discountPercent !== null) {
        status.textContent += ` · Скидка ${product.status.discountPercent}%`;
    }

    const days = document.createElement("div");
    days.className = "days-left";

    if (product.status.daysLeft === null) {
        days.textContent = "Остаток срока: неизвестен";
    } else if (product.status.daysLeft < 0) {
        days.textContent =
            `Срок истёк ${Math.abs(product.status.daysLeft)} дн. назад`;
    } else if (product.status.daysLeft === 0) {
        days.textContent = "До окончания срока: 0 дней";
    } else {
        days.textContent =
            `До окончания срока: ${product.status.daysLeft} дн.`;
    }

    info.append(
        id,
        status,
        days,
        createField("Срок годности", product.sg),
        createField("ЭТМ", product.etm),
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

function renderProducts() {
    const filter = filterElement?.value ?? "all";

    const filteredProducts = products.filter(product => {
        const type = product.status.type;

        if (filter === "all") {
            return true;
        }

        if (filter === "discount") {
            return type === "discount";
        }

        if (filter === "normal") {
            return type === "normal";
        }

        if (filter === "expired") {
            return type === "expired";
        }

        return true;
    });

    productsElement.replaceChildren();

    if (filteredProducts.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "В этой категории товаров нет";

        productsElement.appendChild(empty);
    } else {
        const fragment = document.createDocumentFragment();

        filteredProducts.forEach(product => {
            fragment.appendChild(createProduct(product));
        });

        productsElement.appendChild(fragment);
    }

    statusElement.textContent =
        `Показано товаров: ${filteredProducts.length} из ${products.length}`;
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

    products = productIds.map((id, index) => {
        const product = {
            id,
            photo: photos[index],
            sg: sgs[index],
            etm: etms[index],
            amount: amounts[index]
        };

        product.status = getProductStatus(product);

        return product;
    });

    if (filterElement) {
        filterElement.addEventListener("change", renderProducts);
    }

    renderProducts();
}

loadProducts().catch(error => {
    console.error(error);

    statusElement.textContent = "Не удалось загрузить каталог";

    const message = document.createElement("div");
    message.className = "error";
    message.textContent = error.message;

    productsElement.appendChild(message);
});
