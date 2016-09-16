describe('Calendar Month view', () => {
    beforeEach(() => {
        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.navigateToCalendarPage();
    });

    it('should default to current month', () => {
        var date = new Date();
        var calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.btn_monthView.click();
        expect(calendar_page.lbl_currentDate.getText()).toBe(calendar_page.monthNames[date.getMonth()] + ' ' + date.getFullYear());

        //element(by.buttonText("menu")).click();

        //browser.driver.sleep(5000);
    });

    describe('Date navigation', () => {
        it('should select next month when clicks forward arrow', () => {

            var date = new Date();
            date.setMonth(date.getMonth() + 2);

            var calendar_page = require('../PageObjects/calendar_page.js');
            calendar_page.btn_monthView.click();
            calendar_page.selectMonth(date.toString());

            expect(calendar_page.lbl_currentDate.getText()).toBe(calendar_page.monthNames[date.getMonth()] + ' ' + date.getFullYear());

        });
        it('should select previous month when clicks backward arrow', () => {
            var date = new Date();
            date.setMonth(date.getMonth() - 3);

            var calendar_page = require('../PageObjects/calendar_page.js');
            calendar_page.btn_monthView.click();
            calendar_page.selectMonth(date.toString());

            expect(calendar_page.lbl_currentDate.getText()).toBe(calendar_page.monthNames[date.getMonth()] + ' ' + date.getFullYear());

        });
    }

    );
}
);