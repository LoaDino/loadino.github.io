MenuOpen = false;

window.onload = function () {
    let btn = document.getElementById("BtnMenu");

    btn.onclick = function () {
        if (!MenuOpen) {
            let line1 = document.getElementById("lineCenter");
            let line2 = document.getElementById("lineDown");
            let line3 = document.getElementById("lineUp");

            let menu = document.getElementById("Menu");

            line1.beginElement();
            line2.beginElement();
            line3.beginElement();
            menu.classList.add("MenuAnimation");
            menu.classList.remove("MenuAnimationBack");

            MenuOpen = true;
        } else {
            let line1 = document.getElementById("lineCenterBack");
            let line2 = document.getElementById("lineDownBack");
            let line3 = document.getElementById("lineUpBack");

            let menu = document.getElementById("Menu");

            line1.beginElement();
            line2.beginElement()
            line3.beginElement();
            menu.classList.add("MenuAnimationBack");
            menu.classList.remove("MenuAnimation");

            MenuOpen = false;
        }
    }

    let scheme = document.getElementById("scheme")
    let backgrounds = document.getElementById("backgrounds")
    let geography = document.getElementById("geography")
    let economy = document.getElementById("economy")
    let features = document.getElementById("features")
    let base = document.getElementById("base")
    let swot = document.getElementById("swot")
    let expected = document.getElementById("expected")

    scheme.onclick = function () {
        window.scrollTo(0, 25);
    }
    backgrounds.onclick = function () {
        window.scrollTo(0, 822);
    }

    geography.onclick = function () {
        window.scrollTo(0, 1461);
    }

    economy.onclick = function () {
        window.scrollTo(0, 2061);
    }

    features.onclick = function () {
        window.scrollTo(0, 2598);
    }

    base.onclick = function () {
        window.scrollTo(0, 3208);
    }

    swot.onclick = function () {
        window.scrollTo(0, 3922);
    }

    expected.onclick = function () {
        window.scrollTo(0, 4375);
    }
}
