describe('View event', () => {

    beforeEach(() => {
        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.navigateToCalendarPage();
    });

    //PQ-2855
    it('should popluate the Event location if one was selected/entered', () => {
        let subject = guid();

        let event_page = require('../PageObjects/event_page.js');
        let location = 'Beaverton, OR';
        event_page.createEvent(subject, true, location, [], '', '', ['MeetingType=1:1 Meeting']);

        //if 'click more' button exists then click
        element(by.css('.fc-more')).isPresent().then(function (isVisible) {

            if (isVisible) {
                element(by.css('.fc-more')).click();
                browser.driver.sleep(2000);
                element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                    .filter(function (elem) {
                        return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                            expect(text).not.toBe(null); //resolving promise
                            return text === subject;
                        });
                    })
                    .first()
                    .click();
            } else {
                element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                    .filter(function (elem) {
                        return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                            expect(text).not.toBe(null);//resolving promise
                            return text === subject;
                        });
                    })
                    .first()
                    .click();
            };
        });

        browser.driver.sleep(3000);

        expect(element(by.id('location-value')).getText()).toBe(location);
    });

    //PQ-2855
    it('should not display Location section if none was selected/entered', () => {
        let subject = guid();

        let event_page = require('../PageObjects/event_page.js');
        event_page.createEvent(subject, true, '', [], '', '', ['MeetingType=1:1 Meeting']);

        //if 'click more' button exists then click
        element(by.css('.fc-more')).isPresent().then(function (isVisible) {

            if (isVisible) {
                element(by.css('.fc-more')).click();
                browser.driver.sleep(2000);
                element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                    .filter(function (elem) {
                        return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                            expect(text).not.toBe(null); //resolving promise
                            return text === subject;
                        });
                    })
                    .first()
                    .click();
            } else {
                element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                    .filter(function (elem) {
                        return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                            expect(text).not.toBe(null);//resolving promise
                            return text === subject;
                        });
                    })
                    .first()
                    .click();
            };
        });

        browser.driver.sleep(3000);

        expect(element(by.id('location-title')).isPresent()).toBeFalsy();
        expect(element(by.id('location-value')).isPresent()).toBeFalsy();

    });


    describe('All-day event', () => {
        it('should display correct title and Date', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, true, '', [], '', '', ['MeetingType=1:1 Meeting']);

            //if 'click more' button exists then click
            element(by.css('.fc-more')).isPresent().then(function (isVisible) {

                if (isVisible) {
                    element(by.css('.fc-more')).click();
                    browser.driver.sleep(2000);
                    element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                        .filter(function (elem) {
                            return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null); //resolving promise
                                return text === subject;
                            });
                        })
                        .first()
                        .click();
                } else {
                    element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                        .filter(function (elem) {
                            return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null);//resolving promise
                                return text === subject;
                            });
                        })
                        .first()
                        .click();
                };

                browser.driver.sleep(3000);

                var calendar_page = require('../PageObjects/calendar_page.js');

                let today = new Date();
                let expectedDateTimeString = calendar_page.monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear(); new
                    expect(event_page.lbl_title.getText()).toBe(subject);
                expect(event_page.lbl_dayDisplayLine1.getText()).toBe(expectedDateTimeString);
            });
        });

        it('should not display a time', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, true, '', [], '', '', ['MeetingType=1:1 Meeting']);

            //if 'click more' button exists then click
            element(by.css('.fc-more')).isPresent().then(function (isVisible) {

                if (isVisible) {
                    element(by.css('.fc-more')).click();
                    browser.driver.sleep(2000);
                    element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                        .filter(function (elem) {
                            return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null); //resolving promise
                                return text === subject;
                            });
                        })
                        .first()
                        .click();
                } else {
                    element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
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

            //Verify that the time should not display
            expect(event_page.lbl_dayDisplayLine2.isPresent()).toBeFalsy();

            event_page.btn_close.click();
        });

        it('should display correct details for Multi-day event ', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');

            let calendar_page = require('../PageObjects/calendar_page.js');

            calendar_page.navigateToCalendarPage();

            calendar_page.btn_weekView.click();

            let start = new Date();
            let end = new Date();

            calendar_page.lbl_currentDate.getText().then((text) => {
                expect(text).toBeTruthy();

                //start date
                let startMonth = text.split('–')[0].split(' ')[0];
                let startDay = text.split('–')[0].split(' ')[1];

                start.setMonth(calendar_page.monthNamesShort.indexOf(startMonth));
                start.setDate(parseInt(startDay));

                //end date
                let endStr = text.split('–')[1];
                let endMonth = "";
                let endDay = "";
                let endYear = "";

                //if the month is present then get the month
                if (isNaN(endStr.charAt(1))) {
                    endMonth = endStr.split(',')[0].split(' ')[1];
                    endDay = endStr.split(',')[0].split(' ')[2];
                    endYear = endStr.split(',')[1].split(' ')[1];

                    end.setDate(parseInt(endDay));
                    end.setFullYear(parseInt(endYear));

                    end.setMonth(calendar_page.monthNamesShort.indexOf(endMonth));

                }
                else {
                    endDay = endStr.split(',')[0].split(' ')[1];
                    endYear = endStr.split(',')[1].split(' ')[1];

                    end.setDate(parseInt(endDay));
                    end.setFullYear(parseInt(endYear));

                }


            }).then(() => {

                event_page.createEvent(subject, true, '', [], start, end, ['MeetingType=1:1 Meeting']);

                browser.driver.sleep(3000);

                calendar_page.btn_weekView.click();

                element.all(by.css('.fc-title'))
                    .filter(function (elem) {
                        return elem.getText().then(function (text) {
                            return text === subject;
                        });
                    }).first().click();
                browser.driver.sleep(3000);

                expect(event_page.lbl_title.getText()).toBe(subject);

                let expectedDateDisplayLine1 = calendar_page.monthNames[start.getMonth()] + ' ' + start.getDate() + ', ' + start.getFullYear() + ' until';

                expect(event_page.lbl_dayDisplayLine1.getText()).toBe(expectedDateDisplayLine1);

                let expectedDateDisplayLine2 = calendar_page.monthNames[end.getMonth()] + ' ' + end.getDate() + ', ' + end.getFullYear();

                expect(event_page.lbl_dayDisplayLine2.getText()).toBe(expectedDateDisplayLine2);

                event_page.btn_close.click();
            });


        });
    });


    describe('Non All-day event', () => {
        it('should display correct title and date time', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, false, '', [], '', '', ['MeetingType=1:1 Meeting']);

            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().click();

            browser.driver.sleep(4000); //give it a few secs to populate the event's info

            //verify the event subject
            expect(event_page.lbl_title.getText()).toBe(subject);

            let calendar_page = require('../PageObjects/calendar_page.js');
            let now = new Date();
            let expectedDateTimeString = calendar_page.monthNames[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();

            //verify the date 
            expect(event_page.lbl_dayDisplayLine1.getText()).toBe(expectedDateTimeString);

            let start = event_page.roundTime(now);
            let startAmPM = (start.getHours() >= 12) ? 'PM' : 'AM';

            let end = event_page.roundTime(now);
            end.setHours(end.getHours() + 1);
            let endPM = (end.getHours() >= 12) ? 'PM' : 'AM';

            let timeRange = calendar_page.formatDisplayedTimeRange(start, end);
            timeRange = timeRange.split('-')[0] + startAmPM + ' -' + timeRange.split('-')[1] + ' ' + endPM;

            //verify the time
            expect(event_page.lbl_dayDisplayLine2.getText()).toBe(timeRange);
        });

        it('should display correct details for Multi-day event ', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');

            let calendar_page = require('../PageObjects/calendar_page.js');

            calendar_page.navigateToCalendarPage();

            calendar_page.btn_weekView.click();

            let start = new Date();
            let end = new Date();

            calendar_page.lbl_currentDate.getText().then((text) => {
                expect(text).toBeTruthy();

                //start date
                let startMonth = text.split('–')[0].split(' ')[0];
                let startDay = text.split('–')[0].split(' ')[1];

                start.setMonth(calendar_page.monthNamesShort.indexOf(startMonth));
                start.setDate(parseInt(startDay));

                //end date
                let endStr = text.split('–')[1];
                let endMonth = "";
                let endDay = "";
                let endYear = "";
                //if the month is present then get the month
                if (isNaN(endStr.charAt(1))) {
                    endMonth = endStr.split(',')[0].split(' ')[1];
                    endDay = endStr.split(',')[0].split(' ')[2];
                    endYear = endStr.split(',')[1].split(' ')[1];

                    end.setDate(parseInt(endDay));
                    end.setFullYear(parseInt(endYear));

                    end.setMonth(calendar_page.monthNamesShort.indexOf(endMonth));
                }
                else {
                    endDay = endStr.split(',')[0].split(' ')[1];
                    endYear = endStr.split(',')[1].split(' ')[1];

                    end.setDate(parseInt(endDay));
                    end.setFullYear(parseInt(endYear));
                }

            }).then(() => {
                event_page.createEvent(subject, false, '', [], start, end, ['MeetingType=1:1 Meeting']);

                browser.driver.sleep(3000);

                calendar_page.btn_weekView.click();

                element.all(by.css('.fc-title'))
                    .filter(function (elem) {
                        return elem.getText().then(function (text) {
                            return text === subject;
                        });
                    }).first().click();

                browser.driver.sleep(3000);

                expect(event_page.lbl_title.getText()).toBe(subject);

                let expectedDateDisplayLine1 = calendar_page.monthNames[start.getMonth()] + ' ' + start.getDate() + ', ' + start.getFullYear() + ' at ';

                let rTime = event_page.roundTime(start);
                start.setHours(rTime.getHours());
                start.setMinutes(rTime.getMinutes());

                end.setHours(start.getHours() + 1);
                end.setMinutes(start.getMinutes());

                let displayedTime = event_page.formatDisplayedTimeRange(start, end).split('-');
                let expectedDisplayedStartRoundedTime = displayedTime[0];
                expectedDateDisplayLine1 = expectedDateDisplayLine1 + expectedDisplayedStartRoundedTime + 'until';

                expect(event_page.lbl_dayDisplayLine1.getText()).toBe(expectedDateDisplayLine1);

                let expectedDateDisplayLine2 = calendar_page.monthNames[end.getMonth()] + ' ' + end.getDate() + ', ' + end.getFullYear() + ' at';
                let expectedDisplayedEndRoundedTime = displayedTime[1];
                expectedDateDisplayLine2 = expectedDateDisplayLine2 + expectedDisplayedEndRoundedTime;

                expect(event_page.lbl_dayDisplayLine2.getText()).toBe(expectedDateDisplayLine2);

                event_page.btn_close.click();
            });


        });
    });
});