// init.js

const language = navigator.language;

function verifyLang() {
    if (language == "pt-BR") {
        // location.replace("https://www.johnnysouto.com.br/br/");
        location.replace("/pt/");
    } else {
        // location.replace("https://www.johnnysouto.com.br/en/");
        location.replace("/en/");
    }
}

verifyLang();