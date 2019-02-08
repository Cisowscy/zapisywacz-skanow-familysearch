'use strict';

require('core-js');
const fs = require('fs-extra'), path = require("path"), puppeteer = require('puppeteer');
const ZADANIE = ["ZADANIE_", (new Date).getTime()].join("");
const ADR_IMG = path.resolve(__dirname, "..", "Download", ZADANIE);
fs.ensureDirSync(ADR_IMG);  
const Q = (function() {
    let G = [JSON.parse(fs.readFileSync(path.resolve(__dirname, "../Config/UWIERZYTELNIENIE.txt"), "utf8")),JSON.parse(fs.readFileSync(path.resolve(__dirname, "../Config/KONFIGURACJA.txt"), "utf8"))]
    return {
        user: G[0].Twoja_nazwa_uzytkownika_FamilySearch, 
        pass: G[0].Twoje_haslo_uzytkownika_FamilySearch,
        time: G[1].czas_w_sekundach_potrzebny_na_wyostrzenie_widoku < 10 ? 10 : G[1].czas_w_sekundach_potrzebny_na_wyostrzenie_widoku,
        size: {width: G[1].rozdzielczosc_w_jakiej_dokonasz_zdjecia_kliszy.szerokosc_w_pixelach, height: G[1].rozdzielczosc_w_jakiej_dokonasz_zdjecia_kliszy.wysokosc_w_pixelach},
        film: (function() {
            let B = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../Config/ZADANIA.txt"), "utf8"));
            let A = {
                www: B.adres_przegladarki_filmu,
                od: B.zapisz_klisze_od_numeru > B.numer_ostatniej_kliszy_filmu ? B.numer_ostatniej_kliszy_filmu : B.zapisz_klisze_od_numeru,
                ile: B.zapisz_klisze_do_numeru > B.numer_ostatniej_kliszy_filmu ? B.numer_ostatniej_kliszy_filmu - B.zapisz_klisze_od_numeru : B.zapisz_klisze_do_numeru - B.zapisz_klisze_od_numeru
            };
            /*
            let A = [];
            JSON.parse(fs.readFileSync(path.resolve(__dirname, "../Config/ZADANIA2.txt"), "utf8")).forEach(elW => {
                let F = {www:elW.adres_przegladarki_filmu, todo:[]};
                elW.klisze_do_zapisania.forEach(elS => {
                    F.todo.push({
                        od: elS.zapisz_od_numeru > elW.numer_ostatniej_kliszy_filmu ? elW.numer_ostatniej_kliszy_filmu : elS.zapisz_od_numeru,
                        ile: elS.zapisz_do_numeru > elW.numer_ostatniej_kliszy_filmu ? elW.numer_ostatniej_kliszy_filmu - elS.zapisz_od_numeru : elS.zapisz_do_numeru - elS.zapisz_od_numeru
                    })
                });
                A.push(F);
            });*/
            return A;
        }())
    };
}()); 
console.log();
(async() => {
    try {
        
    
    const browser = await puppeteer.launch({headless: 1});    
    const page = await browser.newPage();
    await page.setViewport(Q.size);
    await page.goto(Q.film.www, {waitUntil: 'networkidle2'});    
    await page.waitFor('input[id=userName]');
    await page.click('input[id=userName]');
    await page.type('input[id=userName]', Q.user);
    await page.waitFor('input[id=password]');
    await page.click('input[id=password]');
    await page.type('input[id=password]', Q.pass);
    await page.click('button[id=login]');
    // OCZEKIWANIE NA ZAŁADOWANIE STRONY ABY USUNAC Z NIEJ SMIECI
    await page.waitFor(6000);
    await page.waitFor('div[id="image-index"]');
    await page.click('div[id="image-index"]');
    await page.evaluate(() => {
        [document.querySelectorAll(".notification-popover.popover"),document.querySelectorAll(".attribution-notification"),document.querySelectorAll(".openSDFooter")].forEach(A => {
            A.forEach(B => {
                B.parentNode.removeChild(B);
            });
        });
    });
    await page.waitFor(1000);
    await page.waitFor('input[class="openSDPagerInputText"]');
    for (let i = 1; i <= Q.film.ile; i++, Q.film.od++) { 
        await page.waitFor(1000);
        await page.waitFor('input[class="openSDPagerInputText"]');
        await page.waitFor('label[class="afterInput"]');
        await page.click('label[class="afterInput"]');
        let input = await page.$('input[class="openSDPagerInputText"]');
        await input.click({ clickCount: 3 })            
        await input.type(''+Q.film.od);
        await page.keyboard.press( 'Enter' );
        await page.waitFor('label[class="afterInput"]');
        await page.click('label[class="afterInput"]');
        await page.waitFor(Q.time * 1000);
        await page.screenshot({path: ADR_IMG+"\\"+Q.film.od+".PNG", fullPage: true}) 
    }
    await browser.close();
} catch (error) {
   console.error("cos poszlo nietak");
}
})();