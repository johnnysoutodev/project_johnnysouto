// init.js

const language = navigator.language;

function verifiyLang() {
    if (language === 'pt-br') {
        location.replace("/pt/");
    } else {
        location.replace("/en/");
    }
}

verifiyLang();