describe('Sidenav', function () {

    beforeEach(function () {
        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        isAngularSite(true);

        browser.get(browser.params.BaseUrl + browser.params.Calendar.Url);

        // //wait for the calendar grid to be visible
        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('body mc-app pq-calendar p-schedule div div.fc-view-container div'));
        }, 20000);
    });

    it('should open and close', function () {
        var sidenav_page = require('../PageObjects/sidenav_page.js');

        sidenav_page.btn_appbar.click();
        sidenav_page.btn_downArrow.click();

        browser.driver.sleep(2000);

        expect(browser.isElementPresent(sidenav_page.btn_accountPlan)).toBeFalsy();
        expect(browser.isElementPresent(sidenav_page.btn_callPlanning)).toBeFalsy();
        expect(browser.isElementPresent(sidenav_page.btn_retrunToProlifiq)).toBeTruthy();
        expect(browser.isElementPresent(sidenav_page.btn_logout)).toBeTruthy();

        sidenav_page.btn_upArrow.click();

        expect(browser.isElementPresent(sidenav_page.btn_accountPlan)).toBeTruthy();
        expect(browser.isElementPresent(sidenav_page.btn_callPlanning)).toBeTruthy();
        expect(browser.isElementPresent(sidenav_page.btn_retrunToProlifiq)).toBeFalsy();
        expect(browser.isElementPresent(sidenav_page.btn_logout)).toBeFalsy();

        browser.driver.sleep(2000);
    });

    it('should display Full Name of the logged in user on the side navigation bar ', function () {
        var sidenav_page = require('../PageObjects/sidenav_page.js');

        sidenav_page.btn_appbar.click();
        expect(sidenav_page.lbl_userName.getText()).toBe(browser.params.Login.FullName);
        browser.driver.sleep(2000);
    });

    describe('Navigation', function () {
        it('should navigate to Call Planning', function () {
            var sidenav_page = require('../PageObjects/sidenav_page.js');

            sidenav_page.btn_appbar.click();
            sidenav_page.btn_callPlanning.click();

        });

        it('should navigate to Account Planning', function () {
            var sidenav_page = require('../PageObjects/sidenav_page.js');

            sidenav_page.btn_appbar.click();
            sidenav_page.btn_accountPlan.click();

        });

        xit('should navigate to Calendar', function () {
            var sidenav_page = require('../PageObjects/sidenav_page.js');

            sidenav_page.btn_appbar.click();
            sidenav_page.btn_calendar.click();

        });

        //feature not ready
        xit('should navigate to Luna', function () {
            var sidenav_page = require('../PageObjects/sidenav_page.js');

            sidenav_page.btn_appbar.click();
            sidenav_page.btn_downArrow.click();
            sidenav_page.btn_retrunToProlifiq.click();

        });

        it('should Log Out', function () {
            var sidenav_page = require('../PageObjects/sidenav_page.js');
            sidenav_page.btn_appbar.click();
            sidenav_page.btn_downArrow.click();
            sidenav_page.btn_logout.click();

            expect(element(by.css('#logout > div:nth-child(3)')).getText()).toBe('You have been logged out of your session.');
            
            browser.driver.sleep(3000);
        });

    });

});