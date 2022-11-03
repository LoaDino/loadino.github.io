
let tg = window.Telegram.WebApp;

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let money = params.money;

window.onload = () => {
    let Pmoney = document.getElementById("money");

    if (money != null) {
        Pmoney.innerHTML = "У вас " + money + " монет";
    } else {
        Pmoney.innerHTML = "Ошибка получаения данных. Перезапустите это окно."
    }

    document.querySelector("#submit").onclick = () => {
        let sum = document.querySelector("#sum");

        if (money == null) {
            alert("ошибка данных, перезапустите это окно.")
        } else {
            if (Number(money) >= Number(sum.value)) {
                alert("успешно!");
                tg.sendData(sum.value);
            } else {
                alert("невозможно, у вас не хватает монет.");
            }
        }
    }
}
