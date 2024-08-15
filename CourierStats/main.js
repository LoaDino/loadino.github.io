const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

let hour_amount = params.hour_amount
let day_amount = params.day_amount
let month_amount = params.month_amount
let all_amount = params.all_amount
let order_per_hour = params.order_per_hour
let hour_per_day = params.hour_per_day
let best_day = params.best_day
let best_oph = params.best_oph
let best_hpd = params.best_hpd
let best_day_value = params.best_day_value
let best_oph_value = params.best_oph_value
let best_hpd_value = params.best_hpd_value

function formatDate(input) {
    // Массив с названиями месяцев
    const months = [
        'января', 'февраля', 'марта', 'апреля',
        'мая', 'июня', 'июля', 'августа',
        'сентября', 'октября', 'ноября', 'декабря'
    ];

    // Разделяем входную строку по символу "_"
    const [day, month, year] = input.split('_');

    // Преобразуем месяц в целое число и уменьшаем на 1
    const monthIndex = parseInt(month, 10) - 1;

    // Формируем строку с нужным форматом
    const formattedDate = `${day} ${months[monthIndex]} ${year}`;

    return formattedDate;
}

window.onload = () => {
    let hour_amount_el = document.getElementById('hour_amount');
    let day_amount_el = document.getElementById('day_amount');
    let month_amount_el = document.getElementById('month_amount');
    let all_amount_el = document.getElementById('all_amount');
    let order_per_hour_el = document.getElementById('oph');
    let hour_per_day_el = document.getElementById('hpd');
    let best_day_el = document.getElementById('best_day');
    let best_oph_el = document.getElementById('best_oph');
    let best_hpd_el = document.getElementById('best_hpd');
    let best_day_value_el = document.getElementById('best_day_value');
    let best_oph_value_el = document.getElementById('best_oph_value');
    let best_hpd_value_el = document.getElementById('best_hpd_value');

    hour_amount_el.innerHTML = hour_amount;
    day_amount_el.innerHTML = day_amount;
    month_amount_el.innerHTML = month_amount;
    all_amount_el.innerHTML = all_amount;
    order_per_hour_el.innerHTML = order_per_hour;
    hour_per_day_el.innerHTML = hour_per_day;
    if (best_day != "None") {
        best_day_el.innerHTML = formatDate(best_day);
    }
    if (best_oph != "None") {
        best_oph_el.innerHTML = formatDate(best_oph);
    }
    if (best_hpd != "None") {
        best_hpd_el.innerHTML = formatDate(best_hpd);
    }
    best_day_value_el.innerHTML = best_day_value;
    best_oph_value_el.innerHTML = best_oph_value;
    best_hpd_value_el.innerHTML = best_hpd_value;


    let best_button = document.getElementById('best_btn');
    let today_button = document.getElementById('today_btn');
    let all_button = document.getElementById('all_btn');
    let today_box = document.getElementById('today');
    let best_box = document.getElementById('best');
    let all_box = document.getElementById('all');

    today_box.style.display = "block"

    today_button.addEventListener('click', () => {
        today_button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        all_button.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        best_button.style.backgroundColor = 'rgba(255, 255, 255, 0)';

        today_box.style.display = "block"
        best_box.style.display = "none"
        all_box.style.display = "none"
    });
    
    all_button.addEventListener('click', () => {
        today_button.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        all_button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        best_button.style.backgroundColor = 'rgba(255, 255, 255, 0)';

        today_box.style.display = "none"
        best_box.style.display = "none"
        all_box.style.display = "block"
    });
    
    best_button.addEventListener('click', () => {
        today_button.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        best_button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        all_button.style.backgroundColor = 'rgba(255, 255, 255, 0)';

        today_box.style.display = "none"
        best_box.style.display = "block"
        all_box.style.display = "none"
    });
}