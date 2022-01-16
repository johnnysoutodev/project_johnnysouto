// init.js

const language = navigator.language;

function verifyLang() {
    if (language == "pt-br") {
        location.replace("/pt/");
        console.log(language);
    } else {
        location.replace("/en/");
        console.log(language);
    }
}

verifyLang();