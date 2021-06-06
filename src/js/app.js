// app.js

var year = new Date().getFullYear();

var age = 0;

function calcAge(year) {
    return age = year -1982;
}

const colorSwitch = document.getElementById('input-color-switch');

colorSwitch.addEventListener('click', checkMode);

function checkMode(){
    console.log('checking....');
}

calcAge(year);