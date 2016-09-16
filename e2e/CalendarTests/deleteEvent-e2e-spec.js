describe('Delete event', () => {

    beforeEach(() => {
        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.navigateToCalendarPage();
    });

    describe('All-day event', () => {
        it('should delete event successfully', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');

            event_page.createEvent(subject, true, '', [], '', '', ['MeetingType=1:1 Meeting']);
            //if 'click more' button exists then click
            element(by.css('.fc-more')).isPresent().then(function (isVisible) {
                if (isVisible) {
                    element(by.css('.fc-more')).click();
                    browser.driver.sleep(2000);
                    let event = element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                        .filter(function (elem) {
                            return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null); //resolving promise
                                return text === subject;
                            });
                        })
                        .first()
                        .click();
                } else {
                    let event = element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                        .filter(function (elem) {
                            return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null);//resolving promise
                                return text === subject;
                            });
                        })
                        .first()
                        .click();
                }
            });

            event_page.btn_deleteEvent.click();

            browser.driver.sleep(2000);

            browser.switchTo().alert().then(function (alert) {
                alert.accept();
            });

            browser.driver.sleep(2000);

            //verify that calendar will refresh once deleted and remove event from view
            element(by.css('.fc-more')).isPresent().then(function (isVisible) {
                if (isVisible) {
                    element(by.css('.fc-more')).click();
                    browser.driver.sleep(2000);
                    let event = element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                        .filter(function (elem) {
                            return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null); //resolving promise
                                return text === subject;
                            });
                        });
                    expect(event.count()).toBe(0);
                } else {
                    let event = element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                        .filter(function (elem) {
                            return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null);//resolving promise
                                return text === subject;
                            });
                        });
                    expect(event.count()).toBe(0);
                }
            });
        });

        xit('should not be able to delete event that the user did not create', () => {
            //feature is not ready
        });
    });

    describe('Non All-day event', () => {
        it('should delete event successfully', () => {

            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');

            event_page.createEvent(subject, false, '', [], '', '', ['MeetingType=1:1 Meeting']);

            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().click();

            event_page.btn_deleteEvent.click();

            browser.driver.sleep(2000);

            browser.switchTo().alert().then(function (alert) {
                alert.accept();
            });

            browser.driver.sleep(2000);//give the calendar few seconds to refresh

            //verify that calendar will refresh once deleted and remove event from view
            let event = element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                });
            expect(event.count()).toBe(0);
        });

        xit('should not be able to delete event that the user did not create', () => {
            //feature is not ready
        });
    });
});