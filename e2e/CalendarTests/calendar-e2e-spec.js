describe('Calendar', () => {
    beforeEach(() => {
        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.navigateToCalendarPage();
    });

    it('Month View should be the default view', () => {

        //check if month view button is selected
        let monthViewBtn = element(by.css('.fc-month-button'));
        monthViewBtn.getAttribute('class').then((s) => {
            expect(s.toString().indexOf('ui-state-active') !== -1).toBe(true);
        });

        //check that it should default to current month
        var date = new Date();
        var calendar_page = require('../PageObjects/calendar_page.js');
        expect(calendar_page.lbl_currentDate.getText()).toBe(calendar_page.monthNames[date.getMonth()] + ' ' + date.getFullYear());
    });

    it('Calendar header should be visible', () => {
        var calendar_page = require('../PageObjects/calendar_page.js');
        expect(calendar_page.lbl_header.isPresent()).toBe(true);
        expect(calendar_page.lbl_header.getText()).toBe('Calendar');
    });

    it('Add event button should be visible', () => {
        var calendar_page = require('../PageObjects/calendar_page.js');
        expect(calendar_page.btn_addEvent.isPresent()).toBe(true);
    });

});