let fs = require("fs");
let puppeteer = require("puppeteer");
let cFile = process.argv[2];
let url = "https://www.facebook.com";

(async function (){
    let browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximized","--disable-notifications"],
    });
    let data = await fs.promises.readFile(cFile);
    let {user,pwd} = JSON.parse(data);
    let pages = await browser.pages();
    let page = pages[0];
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url,{waitUntil:"networkidle2"});
    /*******************************Login *************************************** */
    await page.waitForSelector("#email",{visible:true,timeout:0});
    await page.type("#email",user);
    await page.type("#pass",pwd);
    await page.waitForSelector("#loginbutton",{visible:true,timeout:0});
    await Promise.all([
        page.click("#loginbutton"), page.waitForNavigation({waitUntil:"networkidle2"})
    ]);
    /********************click on events **************************************** */
    await page.waitForSelector("a[title=Events]",{visible:true,timeout:0});
    await Promise.all([
        page.click("a[title=Events]"),
        page.waitForNavigation({waitUntil:"networkidle2"})
    ]);
    // await page.waitForNavigation({waitUntil:"networkidle2"});
    /***********************click on Birthdays *************************************** */
    await page.waitForSelector("div[data-key=birthdays]",{visible:true,timeout:0});
    await Promise.all([
        page.click("div[data-key=birthdays]"),
        page.waitForNavigation({waitUntil:"networkidle2"})
    ]);
   /****************************mark birthdays********************************************** */
    await page.waitForSelector("._4-u2._tzh._4-u8",{visible:true,timeout:0});
    let cards = await page.$$("._4-u2._tzh._4-u8");
    /***********************search for today's cards only*********************************** */
    let persons = await cards[0].$$("._tzm");
    for(let i=0;i<persons.length;i++){
        if(await persons[i].$("._tzo.fsm.fwn.fcg")){
            console.log("Birthday already wished.");
        } else {
            let titleParentClass = await persons[i].$("._tzn.lfloat._ohe a");
            let personName = await page.evaluate(function(el){
                                return el.getAttribute("title")
                            },titleParentClass);
            let textArea = await persons[i].$(".enter_submit.uiTextareaNoResize");
            await textArea.type("Happy Birthday "+ personName +"!!🔥💖 ");
            await page.keyboard.press("Enter");
        }
    }
    console.log("wished birthdays successfully.")
})()
