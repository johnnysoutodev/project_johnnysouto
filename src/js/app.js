// app.js

var year = new Date().getFullYear();

var age = 0;

const language = navigator.language;
const appVersion = navigator.appVersion;
const browserEngine = navigator.product;
const browserUserAgent = navigator.userAgent;

function calcAge(year) {
    return age = year -1982;
}

const colorSwitch = document.getElementById('input-color-switch');

colorSwitch.addEventListener('click', checkMode);

function checkMode(){
    
    if (colorSwitch.checked) {
        darkModeOn();
    } else {
        darkModeOff();
    }
}

function darkModeOn(){
    document.body.classList.add("dark-mode");
}

function darkModeOff(){
    document.body.classList.remove("dark-mode");
}

calcAge(year);

function verifiyLang(){
    console.log(language);
    console.log(appVersion);
    console.log(browserEngine);
    console.log(browserUserAgent);
}

verifiyLang();
