// init.js

const language = navigator.language;

function verifiyLang(){
    if(language == 'pt-br'){
        // location.replace("https://www.johnnysouto.com.br/br/");
        location.replace("/pt/");
    } else {
        // location.replace("https://www.johnnysouto.com.br/en/");
        location.replace("/en/");
    }
}

verifiyLang();