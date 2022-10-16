var progressbar = null;
var projects = Array();
var index = 0;

/*

RylaBot VK - фото в текст из точек, бэн, балда
RylaBot Telegram - балда
RPSBot VK - камень, ножницы, бумага, ящерица, спок (онлайн + бот)
WotForce Referal Bot Telegram - оплата киви, реферальные ссылки, рассылки, логи, модерация чатов
Shop TG Bot Telegram - добавление товаров, перенаправление покупателей на админов
RRun.Bot01 Discord- сборка персонажа со своими характеристиками, именем, чертами характера и так далее, а также генератов n-граневых костей
Squid Game Disord - игры кальмара: написать 30-значное число на скорость, 
    кликер на скорость по командам, четное/нечетное с 10-ю шариками, игра "возьми деньги, атакуй или защищайся"(кнб)
RepBot Discord - респект-система со звездами на определенное количество "реп"-ов,
    карточками пользователей, остановкой бота для тех. работой, логами, топом по реп и анонимными сообщениями от имени сервера
RepBot RoleSHOP Discord - создание ролей в магазин, создание эксклюзивных ролей, покупка ролей из магазина
BannerBot Discord - баннер для дискорд сервера, автообновляемый с количеством людей и количеством войс-онлайна

позже: RandMaster Telegram - бот-игра с пвп, рейдами на боссов, домами, которые можно изменять, вещами и предметами, а также с собиранием ресурсов в казике, шахтах и т.п.
*/

window.onload = function () {
    let height = window.screen.height;

    let empty = document.getElementById("empty-space");

    empty.style = "width: 100%;height: " + height + "px";
}

window.onscroll = function () {
    if (progressbar == null) {
        progressbar = document.getElementsByClassName("loading");

        progressbar[1].style.display = "inline-block";
        progressbar[2].style.display = "inline-block";
    }

    progressbar[2].value = scrollY

    if (progressbar[2].value >= progressbar[2].max) {
        var projectspace = document.getElementsByClassName("loading");

        let child = document.createElement("p");

        child.appendChild(document.createTextNode("okay i pull up"));

        projectspace[0].appendChild(child);
    }
}