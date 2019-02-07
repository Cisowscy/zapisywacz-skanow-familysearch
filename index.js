require('core-js');
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require("path");
const AUTH = fs.readFileSync(path.resolve(__dirname,"UWIERZYTELNIENIE.TXT"), "utf8").split("\n").map((q) => {return q.trim(); });
const ZADANIE = ["ZADANIE_"(new Date).getTime()].join("");
const ADR_IMG = path.resolve(__dirname, "IMG", ZADANIE);
fs.ensureDirSync(ADR_IMG);   

inquirer.prompt([{
        name: 'SKAN',
        type: 'input',
        message: 'WPISZ LUB WKLEJ ADRES URL SKANU z FamilySearch i PUKNIJ ENTER \n (aby wkleić kliknij poprostu prawym klawiszem myszy w czarną konsolę) \n'
    }, {
        type: 'list',
        name: 'ILES',
        message: 'Wybierz ilosc stron do zapisania i puknij enter',
        choices: [{value: 1,name: '1'}, {value: 2,name: '2'}, {value: 3,name: '3'}, {value: 5,name: '5'}, {value: 10,name: '10'}, {value: 15,name: '15'}, {value: 20,name: '20'}, {value: 25,name: '25'}]
    }, {
        type: 'list',
        name: 'IMG1',
        message: 'Wybierz 1 cyfre numeru strony i puknij enter',
        choices: [{value: 1,name: '1'}, {value: 2,name: '2'}, {value: 3,name: '3'}, {value: 4,name: '4'}, {value: 5,name: '5'}, {value: 6,name: '6'}, {value: 7,name: '7'}, {value: 8,name: '8'}, {value: 9,name: '9'}]
    }, {
        type: 'list',
        name: 'IMG2',
        message: 'Wybierz 2 cyfre numeru strony i puknij enter',
        choices: [{value: '',name: '∅ - brak'}, {value: 0,name: '0'}, {value: 1,name: '1'}, {value: 2,name: '2'}, {value: 3,name: '3'}, {value: 4,name: '4'}, {value: 5,name: '5'}, {value: 6,name: '6'}, {value: 7,name: '7'}, {value: 8,name: '8'}, {value: 9,name: '9'}]
    }, {
        type: 'list',
        name: 'IMG3',
        message: 'Wybierz 3 cyfre numeru strony i puknij enter',
        choices: [{value: '',name: '∅ - brak'}, {value: 0,name: '0'}, {value: 1,name: '1'}, {value: 2,name: '2'}, {value: 3,name: '3'}, {value: 4,name: '4'}, {value: 5,name: '5'}, {value: 6,name: '6'}, {value: 7,name: '7'}, {value: 8,name: '8'}, {value: 9,name: '9'}]
    }, {
        type: 'list',
        name: 'IMG4',
        message: 'Wybierz 4 cyfre numeru strony i puknij enter',
        choices: [{value: '',name: '∅ - brak'}, {value: 0,name: '0'}, {value: 1,name: '1'}, {value: 2,name: '2'}, {value: 3,name: '3'}, {value: 4,name: '4'}, {value: 5,name: '5'}, {value: 6,name: '6'}, {value: 7,name: '7'}, {value: 8,name: '8'}, {value: 9,name: '9'}]
    }, {
        name: 'ROZM',
        type: 'list',
        message: 'WYBIERZ ROZDZIELCZOSC (użyj strzałek) (PROPONUJE: (2400 x 1800)px ) i PUKNIJ ENTER \n',
        choices: [{value: {width: 3200,height: 2400},name: '~5MB (3200 x 2400)px'}, {value: {width: 2400,height: 1800},name: '~4MB (2400 x 1800)px'}, {value: {width: 1600,height: 1200},name: '~2MB (1600 x 1200)px'}],
        default: 1
    }, {
        name: 'CZAS',
        type: 'list',
        message: 'WYBIERZ CZAS POTRZEBNY NA WYOSTRZENIE SIĘ SKANU \n JEST ON ZALEŻNY OD PRĘDKOŚCI TWOJEGO INTERNETU \n  (PROPONUJE: 30 SEKUND) i PUKNIJ ENTER \n',
        choices: [{value: 25,name: '25 sekund'}, {value: 25,name: '25 sekund'}, {value: 30,name: '30 sekund'}, {value: 35,name: '35 sekund'}, {value: 40,name: '40 sekund'}, {value: 45,name: '45 sekund'}, {value: 50,name: '50 sekund'}, {value: 60,name: '60 sekund'}, {value: 70,name: '70 sekund'}, {value: 80,name: '80 sekund'}, {value: 90,name: '90 sekund'}],
        default: 2
    }]).then((TWOJE) => {
    let IMG = (function (W) { let M = []; W.forEach(V => { if (Number.isInteger(V)){ M.push(V); } }); return parseInt(M.join("")); }([TWOJE.IMG1, TWOJE.IMG2, TWOJE.IMG3, TWOJE.IMG4]));  
    console.log("PODSUMOWANIE ISTOTNYCH ELEMENTÓW \nADRES FILMU:", TWOJE.SKAN, "\nNUMER PIERWSZEJ KLISZY:", IMG, "\nILOŚĆ KLISZ DO ZAPISANIA:", TWOJE.ILES);        
    console.log("\n\nPOCZEKAJ TERAZ CIERPLIWIE AŻ DO MOMENTU GDY NA EKRANIE UJŻSZ NAPIS 'NUMER ROLKI' \n PÓŹNIEJ BĘDZIESZ MÓGŁ ZMINIMALIZOWAĆ TO OKNO, I O NIM ZAPOMNIEĆ\n GDY SKOŃCZY DZIAŁAĆ POPROSTU SAMO SIĘ ZAMKNIE \n \n POBRANE PLIKI BEDA W FOLDERZE O NAJWYŻSZYM NUMERZE \n (JEST TO DATA UTWORZENIA FOLDERU W MILISEKUNDACH) \n O NAZWIE np.'ZADANIE_1549506948335' WEWNĄTRZ FOLDERU IMG \n\n NAZWA PLIKU SKANU, ODPOWIADA NUMEROWI STRONY SKANU NA FamilySearch");
    (async () => {
        try {
            const browser = await puppeteer.launch({headless: 1});
            const page = await browser.newPage();
            await page.setViewport(TWOJE.ROZM)
            await page.authenticate({username: AUTH[0],password: AUTH[1]});
            await page.goto(TWOJE.SKAN, {waitUntil: 'networkidle2'});
            await page.waitFor('input[id=userName]');
            await page.click('input[id=userName]');
            await page.type('input[id=userName]', AUTH[0]);
            await page.waitFor('input[id=password]');
            await page.click('input[id=password]');
            await page.type('input[id=password]', AUTH[1]);
            await page.click('button[id=login]');
            await page.waitFor(5000);
            await page.waitFor('div[id="image-index"]');
            await page.click('div[id="image-index"]');
            await page.evaluate(() => {
                [document.querySelectorAll(".notification-popover.popover"),document.querySelectorAll(".attribution-notification"),document.querySelectorAll(".openSDFooter")].forEach(A => {
                    A.forEach(B => {
                        B.parentNode.removeChild(B);
                    });
                });
            })
            await page.waitFor(1000);
            await page.waitFor('input[class="openSDPagerInputText"]');
            const nrF = await page.evaluate(() => {
                return [document.querySelector(".film-number").innerText.trim().replace("Film # ", ""), parseInt(document.querySelector(".afterInput").innerText.trim().replace("of ", ""))];
            });
            console.log("NUMER ROLKI", nrF[0]);
            console.log("\nJEZELI POWYZEJ WIDZISZ NUMER ROLKI, OZNACZA TO ZE PROCES POSTEPUJE BEZ ZASTRZEZEŃ\n MOZESZ ZMINIMALIZOWAC TO OKNO, JAK SKOŃCZY PRACE SIĘ ZAMKNIE\n")
            const ILE = await (IMG + TWOJE.ILES) > nrF[1] ? (nrF[1] - IMG) : TWOJE.ILES;            
            for (let i = 1; i <= ILE; i++, IMG++) { 
                await page.waitFor(1000);
                await page.waitFor('input[class="openSDPagerInputText"]');
                let input = await page.$('input[class="openSDPagerInputText"]');
                await input.click({ clickCount: 3 })            
                await input.type(''+IMG);
                await page.keyboard.press( 'Enter' );
                await page.waitFor('label[class="afterInput"]');
                await page.click('label[class="afterInput"]');
                await page.waitFor(TWOJE.CZAS * 1000);
                // await page.screenshot({path: PLIK, fullPage: true})             
                await page.screenshot({path: ADR_IMG+"\\"+IMG+".PNG"});
            }
            await browser.close();
        } catch (error) {
            //console.log(error);        
        }
    })();
});