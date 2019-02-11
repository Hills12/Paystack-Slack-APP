const puppeteer = require("puppeteer");

exports.login = async (email = String, password = String, getWhat = String, teamID, submittedAmount, submittedEmail, submittedInstruction) => {
    try {
        const browser = await puppeteer.launch({headless: false,  args : [
            '--window-size=1920,1080'
        ]});
        const page = await browser.newPage();

        page.setViewport({ width: 1366, height: 768})
        await page.goto('https://dashboard.paystack.com/#/login?next=app.home.dashboard', {timeout: 0});
        await page.waitFor(3000);
        await page.type("#app > div > div.ng-scope > div.access-wrap.animated.fadeIn.ng-scope > form > div:nth-child(2) > input", email);
        await page.type("#app > div > div.ng-scope > div.access-wrap.animated.fadeIn.ng-scope > form > div:nth-child(3) > input", password)
        await page.click("#app > div > div.ng-scope > div.access-wrap.animated.fadeIn.ng-scope > form > div:nth-child(4) > button"),        

        await page.waitForNavigation({waitUntil: 'load', timeout: 0}); 
        await page.waitFor(5000);

        if(getWhat == "getRevenue") return await getRevenue(page, browser)
        else if(getWhat == "transactions") return await getTransactions(page, browser)
        else if(getWhat == "payout") return await getPayout(page, browser)
        else if(getWhat == "customers") return await getCustomers(page, browser)
        else if(getWhat == "insight") return await getInsight(page, browser, teamID)
        else if(getWhat == "dialog_submission") return await sendInvoice(page, browser, submittedAmount, submittedEmail, submittedInstruction)


    } catch (error) {
        console.log("There is an error", error)
    }
}

let getRevenue = async (page, browser) => {
    try {
        const result = await page.evaluate(() => {
            let revenue = document.querySelector("#app > div.content-wrap.ng-scope > div:nth-child(5) > ui-view > div.full-height.ng-scope > div.col-lg-9.col-md-12.content-sidebar.no-padder > div.wrapper-md > div:nth-child(1) > div.metrics > div > div > h3 > span").innerText;
            let payout = document.querySelector("#app > div.content-wrap.ng-scope > div:nth-child(5) > ui-view > div.full-height.ng-scope > div.col-lg-3.no-padder.text-center > div:nth-child(2) > div:nth-child(2) > div > div > h3").innerText;

            return { revenue, payout }
        });
        
        await browser.close();
        return result;
    } catch (error) { 
        console.log(`There is an error`, error)
    }  
}

let getTransactions = async (page, browser) => {
    try {
        await page.click("#nav-transactions > a")

        await page.waitForNavigation({waitUntil: 'load', timeout: 0}); 
        await page.waitFor(5000);

        await page.click("#app > div.content-wrap.ng-scope > div:nth-child(5) > ui-view > div.view-header.view-header-filters.ng-scope > div.pull-right > button")
        
        await page.waitFor(5000);

        await page.focus("div.modal-footer > button.btn.btn-success.pull-right.loading-button.ng-scope")
        await page.keyboard.type('\n');

        await page.waitFor(2000);

        await browser.close();
        
    } catch (error) {
        console.log(error)
    }
}

let getPayout = async (page, browser) => {
    try {
        await page.click("#nav-income > a")

        await page.waitForNavigation({waitUntil: 'load', timeout: 0}); 
        await page.waitFor(5000);
        
        await page.click("#app > div.content-wrap.ng-scope > div:nth-child(5) > ui-view > div:nth-child(2) > div.pull-right.ng-scope > button")

        await page.waitFor(5000);

        await browser.close();
    } catch (error) {
        console.log(error)
    }
}

let getCustomers = async (page, browser) => {
    try {
        await page.click("#nav-customers > a")

        await page.waitForNavigation({waitUntil: 'load', timeout: 0}); 
        await page.waitFor(5000);

        await page.click("#app > div.content-wrap.ng-scope > div:nth-child(5) > ui-view > div:nth-child(2) > div.pull-right > button:nth-child(2)")
        await page.waitFor(5000);

        await browser.close();
    } catch (error) {
        console.log(error)
    }
}

let getInsight = async (page, browser, teamID) => {
    try {
        await page.click("#nav-customer-insights > a")

        await page.waitForNavigation({waitUntil: 'load', timeout: 0}); 
        await page.waitFor(5000);

        await page.screenshot({
            path: `paystack/insight/insight${teamID}.png`, fullPage: true
        })

        await browser.close();
    } catch (error) {
        console.log(error)
    }
}

let sendInvoice = async (page, browser, submittedAmount, submittedEmail, submittedInstruction) => {
    try {
        await page.click("#nav-invoices > a")

        await page.waitForNavigation({waitUntil: 'load', timeout: 0}); 
        await page.waitFor(5000);

        await page.click("#requests > div.content-sidebar.no-padder.col-xs-9 > div.view-header.view-header-filters > div.pull-right > button")

        await page.waitFor(5000);

        await page.click("div.modal-body.no-padder > div > div:nth-child(1) > div > div:nth-child(2) > div > label > i")

        await page.waitFor(3000);

        await page.type("div.modal-body.no-padder > div > div:nth-child(2) > div:nth-child(2) > autocomplete > div > input", submittedEmail)
        await page.type("div.modal-body.no-padder > div > div:nth-child(6) > div:nth-child(1) > div > div.input-group > input", submittedAmount)
        await page.type("div.modal-body.no-padder > div > div:nth-child(6) > div:nth-child(2) > div > textarea", submittedInstruction)

        await page.waitFor(5000);

        await page.click("div.modal-footer > button:nth-child(1)")

        await page.waitFor(5000);

        await page.click("div.animated.fadeIn > div.modal-footer > button.btn.btn-success.pull-right.loading-button.ng-scope")

        await page.waitFor(5000);

        await browser.close();
    } catch (error) {
        console.log(error)
    }
}