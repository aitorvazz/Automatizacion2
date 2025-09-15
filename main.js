const { Apify } = require('apify');  // Asegúrate de importar Apify
const playwright = require('playwright'); // Usamos Playwright para interactuar con la página

Apify.main(async () => {
    // Lanza el navegador con Playwright
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Ir a la página de contratación pública en Euskadi
    await page.goto('https://www.contratacion.euskadi.eus/webkpe00-kpeperfi/es/ac70cPublicidadWar/busquedaAnuncios?locale=es');
    
    // Esperar a que los filtros estén disponibles
    await page.waitForSelector('#tipoContrato');  // Selector del filtro "Tipo de contrato"
    await page.waitForSelector('#estadoTramitacion');  // Selector del filtro "Estado de la tramitación"

    // Aplicar el filtro "Tipo de Contrato" (Suministros)
    await page.selectOption('#tipoContrato', '3'); // Seleccionamos "Suministros"
    
    // Aplicar el filtro "Estado de la Tramitación" (Abierto / Plazo de presentación)
    await page.selectOption('#estadoTramitacion', '3'); // Seleccionamos "Abierto / Plazo de presentación"
    
    // Hacer clic en el botón "Buscar" (Asegúrate de que el selector sea correcto)
    await page.click('button[type="submit"]');  // Cambia el selector si es necesario
    await page.waitForSelector('.resultados-lista');  // Asegúrate de que los resultados se carguen
    
    let results = [];
    let pageNumber = 1;

    // Navegar a través de las páginas de resultados
    while (true) {
        const data = await page.evaluate(() => {
            const resultsArray = [];
            const items = document.querySelectorAll('.resultado-item');  // Ajusta este selector según los resultados
            items.forEach(item => {
                const title = item.querySelector('.titulo').innerText;  // Ajusta el selector de título
                const description = item.querySelector('.descripcion').innerText;  // Ajusta el selector de descripción
                resultsArray.push({ title, description });
            });
            return resultsArray;
        });

        results = results.concat(data);
        
        // Verificar si hay siguiente página
        const nextPageButton = await page.$('a.pagination-next');  // Asegúrate de que este selector funcione
        if (nextPageButton) {
            await nextPageButton.click();
            await page.waitForSelector('.resultado-item');  // Asegúrate de que los resultados estén visibles
            pageNumber++;
        } else {
            break;  // Si no hay más páginas, termina el scraping
        }
    }

    // Imprimir los resultados
    console.log(results);

    // Cerrar el navegador
    await browser.close();
});
