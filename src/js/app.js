// app.js

var year = new Date().getFullYear();

var age = 0;

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