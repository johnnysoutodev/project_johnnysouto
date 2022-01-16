// init.js

const language = navigator.language;

function verifyLang() {
    if (language == "pt-br") {
        // location.replace("https://www.johnnysouto.com.br/br/");
        location.replace("/pt/");
        console.log(language);
    } else {
        // location.replace("https://www.johnnysouto.com.br/en/");
        // location.replace("/en/");
        console.log(language);
    }
}

verifyLang();