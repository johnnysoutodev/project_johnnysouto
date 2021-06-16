// init.js

const language = navigator.language;

function verifiyLang(){
    if(language === 'pt-br'){
        // location.replace("https://www.johnnysouto.com.br/pt/");
    } else {
        // location.replace("https://www.johnnysouto.com.br/en/");
    }
}

verifiyLang();