const { Apify } = require('apify');  // Asegúrate de que Apify esté importado correctamente
const playwright = require('playwright');  // Usamos Playwright para interactuar con la página

Apify.main(async () => {
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto('https://www.contratacion.euskadi.eus/webkpe00-kpeperfi/es/ac70cPublicidadWar/busquedaAnuncios?locale=es');
    await page.waitForSelector('#tipoContrato');
    await page.waitForSelector('#estadoTramitacion');

    await page.selectOption('#tipoContrato', '3');
    await page.selectOption('#estadoTramitacion', '3');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.resultados-lista');

    let results = [];
    let pageNumber = 1;

    while (true) {
        const data = await page.evaluate(() => {
            const resultsArray = [];
            const items = document.querySelectorAll('.resultado-item');
            items.forEach(item => {
                const title = item.querySelector('.titulo').innerText;
                const description = item.querySelector('.descripcion').innerText;
                resultsArray.push({ title, description });
            });
            return resultsArray;
        });

        results = results.concat(data);

        const nextPageButton = await page.$('a.pagination-next');
        if (nextPageButton) {
            await nextPageButton.click();
            await page.waitForSelector('.resultado-item');
            pageNumber++;
        } else {
            break;
        }
    }

    console.log(results);

    await browser.close();
});
