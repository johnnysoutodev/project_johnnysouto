// analytics

function refuseGA(){
    window['ga-disable-G-YYR4SND80L'] = true;
}

function acceptGA() {
    var exdays = 90;
    window['ga-disable-G-YYR4SND80L'] = false;
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-YYR4SND80L', {
        'cookie_domain': 'johnnysouto.com.br',
        'cookie_expires': exdays * 24 * 60 * 60,
        'cookie_update': false
    });

}