
let tg = window.Telegram.WebApp;

console.log(tg)

window.onload = () => {
    document.querySelector("#submit").onclick = () => {
        let currency = document.querySelector("#choice");
        let sum = document.querySelector("#sum");

        alert("успешно!")
        tg.sendData(sum.value + " " + currency.value);
    }
}