var login_page = function () {

    this.navigateToLoginPage = function () {
        isAngularSite(false);

        browser.get(browser.params.BaseUrl + browser.params.Login.Url);

        //wait for the log in button to be visible
        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.id('login-btn'));
        }, 20000);
    }

    this.fld_userName =  element(by.id('UserName'));

    this.fld_password =  element(by.id('Password'));

    this.btn_login =  element(by.id('login-btn'))

    this.login = function(userName, password){
        this.navigateToLoginPage();
        this.fld_userName.sendKeys(userName);
        this.fld_password.sendKeys(password);
        this.btn_login.click();

        //wait for the log out link to be visible after logged in.
        // browser.driver.wait(function () {
        //     return browser.driver.isElementPresent(by.css('.logout-link'));
        // }, 20000);
        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('.appbar-left-button'));
        }, 20000);

    }

};
module.exports = new login_page();