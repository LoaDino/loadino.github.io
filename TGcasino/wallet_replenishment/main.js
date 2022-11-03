
let tg = window.Telegram.WebApp;

window.onload = () => {
    document.querySelector("#submit").onclick = () => {
        let currency = document.querySelector("#choice");
        let sum = document.querySelector("#sum");

        tg.sendData(sum.value + " " + currency.value);
    }
}