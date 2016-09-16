describe('Calendar Day view', () => {

    beforeEach(() => {
        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.navigateToCalendarPage();
    });

    it('should default to today', () => {
        let date = new Date();
        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.btn_dayView.click();

        let expectedDateString = calendar_page.monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        expect(calendar_page.lbl_currentDate.getText()).toBe(expectedDateString);
    });

    it('should navigate to Today when clicks on Today button', () => {
        let date = new Date();

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.btn_dayView.click();

        calendar_page.btn_next.click();
        calendar_page.btn_today.click();

        let expectedDateString = calendar_page.monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        expect(calendar_page.lbl_currentDate.getText()).toBe(expectedDateString);
    });

    describe('Date navigation', () => {
        it('should select next day when clicks on next button', () => {
            let calendar_page = require('../PageObjects/calendar_page.js');
            let date = new Date();
            date.setDate(date.getDate() + 2);

            calendar_page.btn_dayView.click();
            calendar_page.selectDay(date.toString());

            let expectedDateString = calendar_page.monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            expect(calendar_page.lbl_currentDate.getText()).toBe(expectedDateString);

        });

        it('should select previous day when clicks on previous button', () => {
            let calendar_page = require('../PageObjects/calendar_page.js');
            let date = new Date();
            date.setDate(date.getDate() - 3);

            calendar_page.btn_dayView.click();
            calendar_page.selectDay(date.toString());

            let expectedDateString = calendar_page.monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            expect(calendar_page.lbl_currentDate.getText()).toBe(expectedDateString);

        });
    });
});