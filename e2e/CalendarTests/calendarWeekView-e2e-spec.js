describe('Calendar Week view', () => {
    beforeEach(() => {
        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.navigateToCalendarPage();
    });

    it('should default to current week', () => {
        var date = new Date();
        var calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.btn_weekView.click();
        var dateOfWeek = date.getDay();

        var start = new Date();
        start.setDate(start.getDate() - dateOfWeek);

        var end = new Date();
        end.setDate(end.getDate() + (6 - dateOfWeek));

        var startToString = calendar_page.monthNamesShort[start.getMonth()] + " " + start.getDate();
        var endToString = end.getDate() + ", " + end.getFullYear();

        if ((end.getMonth() - start.getMonth()) == 1) {
            endToString = calendar_page.monthNamesShort[end.getMonth()] + ' ' + endToString;
        }

        var expectedString = startToString + " – " + endToString;
        expect(calendar_page.lbl_currentDate.getText()).toBe(expectedString);
    });

    describe('Date navigation', () => {
        it('should select next week when clicks forward arrow', () => {

            let date = new Date();
            date.setDate(date.getDate() + 8);

            let calendar_page = require('../PageObjects/calendar_page.js');
            calendar_page.btn_weekView.click();
            calendar_page.selectWeek(date.toString());

            let dateOfWeek = date.getDay();

            let start = new Date(date.toString());
            start.setDate(start.getDate() - dateOfWeek);

            let end = new Date(date.toString());
            end.setDate(end.getDate() + (6 - dateOfWeek));

            let startToString = calendar_page.monthNamesShort[start.getMonth()] + " " + start.getDate();

            let endToString = end.getDate() + ", " + end.getFullYear();
            if ((end.getMonth() - start.getMonth()) > 0) {
                endToString = calendar_page.monthNamesShort[end.getMonth()] + " " + endToString;
            }

            let expectedString = startToString + " – " + endToString;
            expect(calendar_page.lbl_currentDate.getText()).toBe(expectedString);
        });
        it('should select previous week when clicks backward arrow', () => {
            let date = new Date();
            date.setDate(date.getDate() - 12);

            var calendar_page = require('../PageObjects/calendar_page.js');
            calendar_page.btn_weekView.click();
            calendar_page.selectWeek(date.toString());

            let dateOfWeek = date.getDay();

            let start = new Date(date.toString());
            start.setDate(start.getDate() - dateOfWeek);

            let end = new Date(date.toString());
            end.setDate(end.getDate() + (6 - dateOfWeek));

            let startToString = calendar_page.monthNamesShort[start.getMonth()] + " " + start.getDate();
            let endToString = end.getDate() + ", " + end.getFullYear();
            if ((end.getMonth() - start.getMonth()) > 0) {
                endToString = calendar_page.monthNamesShort[end.getMonth()] + " " + endToString;
            }

            let expectedString = startToString + " – " + endToString;
            expect(calendar_page.lbl_currentDate.getText()).toBe(expectedString);
        });
    }

    );
});