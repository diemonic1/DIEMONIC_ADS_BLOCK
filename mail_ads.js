// взято отсюда
// https://chromewebstore.google.com/detail/yandex-mail-adblock/nokpbllanpdhbfknappjiplkajndngeh

async function loadCSSDataURI() {
    try {
        const response = await fetch('https://sanmx.ru/api/yadblock/');
        const cssContent = await response.text();

        // Создаем data URI
        const dataURI = `data:text/css;base64,${btoa(unescape(encodeURIComponent(cssContent)))}`;

        // Создаем link элемент
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = dataURI;

        document.head.appendChild(linkElement);

    } catch (error) {
        console.error('Ошибка mail_ads.js | https://sanmx.ru/api/yadblock/:', error);
    }
}

loadCSSDataURI();