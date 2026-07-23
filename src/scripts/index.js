document.addEventListener("DOMContentLoaded", async () => {

    // supported languages
    const supportedLangs = ["en", "pt"];

    // user language
    const browserLang = navigator.language.split("-")[0];

    // current url language
    const urlLang = document.querySelector("html").lang;

    // lang suggestions
    const langSuggestions = {
        "en": "SWITCH TO ENGLISH",
        "pt": "MUDAR PARA PORTUGUÊS"
    };

    const langBox = document.getElementById("lang");

    if (langBox) {

        // shows a tooltip suggesting the user to change the language
        function suggestLanguage(lang) {
            langBox.parentElement.dataset.suggestion = langSuggestions[lang];
        }

        // if user is using a supported language
        if (supportedLangs.includes(browserLang)) {

            // if url language is not browser language
            if (urlLang !== browserLang) {
                // suggest user to use their language
                suggestLanguage(browserLang);
            }

        } else {

            // if we don't support user language
            // and user is not using english        
            if (urlLang !== "en") {
                // suggest user to use english
                suggestLanguage("en");
            }

        }

        // set combobox language to current url language
        langBox.value = urlLang;

        // change language combobox event
        langBox.onchange = (e) => {
            const selector = `link[hreflang="${e.target.value}"]`;
            const href = document.querySelector(selector).href
            window.location.href = href;
        };

    }

    // set current navbar link
    const links = Array.from(document.querySelectorAll('div#navbar > a')).slice(1);
    const currentUrl = window.location.href;
    const activeLink = links.find(link => currentUrl.startsWith(link.href));
    if (activeLink) {
        activeLink.classList.add("active"); 
    } else {
        document.querySelector('div#navbar > a').classList.add("active"); 
    }

    // set current menu link
    const activeMenuLink = document.querySelector(`div.menu a[href="${window.location.href.replace(/#.*/g, "")}"]`)
    if (activeMenuLink) {
        activeMenuLink.parentNode.classList.add("active");
    }

    // back to top button
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        backToTop.onclick = e => {
            e.preventDefault(); 
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };
    }

});