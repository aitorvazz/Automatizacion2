const { Apify } = require('apify');  // Asegúrate de que Apify esté importado correctamente
const playwright = require('playwright');  // Usamos Playwright para interactuar con la página

Apify.main(async () => {
    const browser = await playwright.chromium.launch({ headless: true });  // Lanza el navegador sin interfaz gráfica
    const page = await browser.newPage();
    
    // Ir a la página de contratación pública en Euskadi
    await page.goto('https://www.contratacion.euskadi.eus/webkpe00-kpeperfi/es/ac70cPublicidadWar/busquedaAnuncios?locale=es');
    
    // Esperar a que los filtros estén visibles
    await page.waitForSelector('#tipoContrato');  // Selector del filtro "Tipo de contrato"
    await page.waitForSelector('#estadoTramitacion');  // Selector del filtro "Estado de la tramitación"

    // Aplicar el filtro "Tipo de Contrato" (Suministros)
    await page.selectOption('#tipoContrato', '3'); // Seleccionamos "Suministros"
    
    // Aplicar el filtro "Estado de la Tramitación" (Abierto / Plazo de presentación)
    await page.selectOption('#estadoTramitacion', '3'); // Seleccionamos "Abierto / Plazo de presentación"
    
    // Hacer clic en "Buscar"
    await page.click('button[type="submit"]');  // Cambia el selector si es necesario
    await page.waitForSelector('.resultados-lista');  // Esperamos a que los resultados se carguen
    
    let results = [];
    let pageNumber = 1;

    // Navegar por las páginas de resultados
    while (true) {
        const data = await page.evaluate(() => {
            const resultsArray = [];
            const items = document.querySelectorAll('.resultado-item');  // Asegúrate de que este selector funcione
            items.forEach(item => {
                const title = item.querySelector('.titulo').innerText;  // Ajusta el selector del título
                const description = item.querySelector('.descripcion').innerText;  // Ajusta el selector de descripción
                resultsArray.push({ title, description });
            });
            return resultsArray;
        });

        results = results.concat(data);
        
        // Verificamos si hay siguiente página
        const nextPageButton = await page.$('a.pagination-next');  // Asegúrate de que este selector funcione
        if (nextPageButton) {
            await nextPageButton.click();
            await page.waitForSelector('.resultado-item');  // Asegúrate de que los resultados estén visibles
            pageNumber++;
        } else {
            break;  // Si no hay más páginas, terminamos el scraping
        }
    }

    // Mostrar los resultados en consola
    console.log(results);

    // Cerrar el navegador
    await browser.close();
});
