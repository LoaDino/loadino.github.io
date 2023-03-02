MenuOpen = false;

window.onload = function () {
    if (window.screen.height > window.screen.width) {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            "<link rel=\"stylesheet\" href=\"stylemini.css\" />");
    } else {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            "<link rel=\"stylesheet\" href=\"style.css\" />");

    }

    let btn = document.getElementById("BtnMenu");

    btn.onclick = function () {
        if (!MenuOpen) {
            let line1 = document.getElementById("Line1");
            let line2 = document.getElementById("Line2");
            let line3 = document.getElementById("Line3");

            let menu = document.getElementById("Menu");

            line1.classList.add("LineAnimation1");
            line1.classList.remove("LineAnimationBack1");
            line2.classList.add("LineAnimation2");
            line2.classList.remove("LineAnimationBack2");
            line3.classList.add("LineAnimation3");
            line3.classList.remove("LineAnimationBack3");

            menu.classList.add("MenuAnimation");
            menu.classList.remove("MenuAnimationBack");

            MenuOpen = true;
        } else {
            let line1 = document.getElementById("Line1");
            let line2 = document.getElementById("Line2");
            let line3 = document.getElementById("Line3");

            let menu = document.getElementById("Menu");

            line1.classList.remove("LineAnimation1");
            line1.classList.add("LinAnimationBack1");
            line2.classList.remove("LineAnimation2");
            line2.classList.add("LineAnimationBack2");
            line3.classList.remove("LineAnimation3");
            line3.classList.add("LineAnimationBack3");

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

    function getOffset(el) {
        const bodyRect = document.body.getBoundingClientRect();
        const rect = el.getBoundingClientRect();

        const header = document.getElementsByTagName("header")[0]

        const headerRect = header.getBoundingClientRect();

        return bodyRect.top + rect.top - headerRect.height - window.screen.height * 0.03;
    }

    scheme.onclick = function () {
        const element = document.getElementById("scheme_info")
        window.scrollTo(0, 0)
        window.scrollTo(0, getOffset(element));
    }

    backgrounds.onclick = function () {
        const element = document.getElementById("backgrounds_info")
        window.scrollTo(0, 0)
        window.scrollTo(0, getOffset(element));
    }

    geography.onclick = function () {
        const element = document.getElementById("geography_info")
        window.scrollTo(0, 0)
        window.scrollTo(0, getOffset(element));
    }

    economy.onclick = function () {
        const element = document.getElementById("economy_info")
        window.scrollTo(0, 0)
        window.scrollTo(0, getOffset(element));
    }

    features.onclick = function () {
        const element = document.getElementById("features_info")
        window.scrollTo(0, 0)
        window.scrollTo(0, getOffset(element));
    }

    base.onclick = function () {
        const element = document.getElementById("base_info")
        window.scrollTo(0, 0)
        window.scrollTo(0, getOffset(element));
    }

    swot.onclick = function () {
        const element = document.getElementById("swot_info")
        window.scrollTo(0, 0)
        window.scrollTo(0, getOffset(element));
    }

    expected.onclick = function () {
        const element = document.getElementById("expected_info")
        window.scrollTo(0, 0)
        window.scrollTo(0, getOffset(element));
    }
}
