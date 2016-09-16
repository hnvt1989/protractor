describe('Login', function () {

    beforeEach(function () {
    });

    it('should log in with valid credentials', function () {
        var login_page = require('../PageObjects/login_page.js');
        var home_page = login_page.login(browser.params.Login.UserName, browser.params.Login.Password);
    });

    it('should display error for invalid credentials', function () {
        var login_page = require('../PageObjects/login_page.js');
        login_page.navigateToLoginPage();
        login_page.fld_userName.sendKeys('invalid username');
        login_page.fld_password.sendKeys('invalid password');
        login_page.btn_login.click();

        //wait for the validation error
        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('.field-validation-error label'));
        }, 5000);

        expect(element(by.css('.field-validation-error label')).getText()).toBe('Invalid Credentials.');
    });
});