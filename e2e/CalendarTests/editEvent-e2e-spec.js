describe('Edit event', () => {

    beforeEach(() => {
        //window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.navigateToCalendarPage();
    });

    it('should disable \'Save\' button if user has not edited anything', () => {
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

            event_page.btn_editEvent.click();

            browser.driver.sleep(3000);

            expect(event_page.btn_save.isEnabled()).toBe(false);

            event_page.btn_close.click();
        });
    });

    it('should not save the Event when user cancel the edit', () => {
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

        event_page.btn_editEvent.click();

        event_page.btn_close.click();

        browser.driver.sleep(2000);

        let today = new Date();

        let calendar_page = require('../PageObjects/calendar_page.js');
        let expectedDateTimeString = calendar_page.monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();

        expect(event_page.lbl_title.getText()).toBe(subject);
        expect(event_page.lbl_dayDisplayLine1.getText()).toBe(expectedDateTimeString);

        event_page.btn_close.click();

        //verify that this event details on the calendar are still unchanged
        element(by.css('.fc-more')).isPresent().then(function (isVisible) {
            let event = [];
            if (isVisible) {
                element(by.css('.fc-more')).click();
                browser.driver.sleep(2000);
                event = element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                    .filter(function (elem) {
                        return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                            expect(text).not.toBe(null); //resolving promise
                            return text === subject;
                        });
                    });
            } else {
                event = element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                    .filter(function (elem) {
                        return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                            expect(text).not.toBe(null);//resolving promise
                            return text === subject;
                        });
                    });
            }
            //verify that this event is still displayed on the calendar.
            expect(event.count()).toBe(1);
        });

    });

    describe('All-day event', () => {
        it('should edit event subject successfully', () => {
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

            event_page.btn_editEvent.click();

            //edit the event
            let newSubject = guid();

            //changing the subject
            event_page.fld_subject.clear();
            event_page.fld_subject.sendKeys(newSubject);

            //save
            event_page.btn_save.click();

            browser.driver.sleep(3000);

            event_page.btn_close.click();

            element(by.css('.fc-more')).isPresent().then(function (isVisible) {
                //verify the event was updated
                let event = [];
                if (isVisible) {
                    element(by.css('.fc-more')).click();
                    browser.driver.sleep(2000);
                    event = element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                        .filter(function (elem) {
                            return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null); //resolving promise
                                return text === newSubject;
                            });
                        });
                } else {
                    event = element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                        .filter(function (elem) {
                            return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null);//resolving promise
                                return text === newSubject;
                            });
                        });
                }
                //verify that this event is still displayed on the calendar.
                expect(event.count()).toBe(1);
            });
        });
        it('should edit event Start/End time successfully', () => {
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

            event_page.btn_editEvent.click();

            //changing the date
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            let tomorrowTimeString = tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + tomorrow.getDate();

            //changing the start date
            event_page.lbl_startDate.click();

            browser.driver.sleep(3000);

            //check if today is the last day of the month
            let today = new Date();
            let lastDay = ((tomorrow.getMonth() - today.getMonth()) == 1) ? true : false;

            if (lastDay) {
                element(by.css('datetime-picker div div.month button.next')).click();
                browser.driver.sleep(1000);
            }

            element.all(by.className('day selectable'))
                .filter(function (elem) {
                    return elem.getAttribute('title').then(function (text) {
                        expect(text).not.toBe(null); //resolving promise
                        return text === tomorrowTimeString;
                    });
                }).first().click();

            browser.driver.sleep(2000);

            event_page.fld_background.click();

            browser.driver.sleep(2000);

            //changing the end date
            event_page.lbl_endDate.click();

            browser.driver.sleep(2000);

            if (lastDay) {
                element(by.css('datetime-picker div div.month button.next')).click();
                browser.driver.sleep(1000);
            }

            element.all(by.className('day selectable'))
                .filter(function (elem) {
                    return elem.getAttribute('title').then(function (text) {
                        expect(text).not.toBe(null); //resolving promise
                        return text === tomorrowTimeString;
                    });
                }).first().click();

            browser.driver.sleep(2000);

            event_page.fld_background.click();

            browser.driver.sleep(2000);

            //start date/end date should display the selected date
            let expectedTimeString = event_page.formatDateTimeString(tomorrow).split(' ')[0];

            expect(event_page.lbl_startDate.getAttribute('value')).toBe(expectedTimeString);
            expect(event_page.lbl_endDate.getAttribute('value')).toBe(expectedTimeString);

            //save
            event_page.btn_save.click();

            browser.driver.sleep(3000);

            event_page.btn_close.click();

            let calendar_page = require('../PageObjects/calendar_page.js');

            calendar_page.btn_dayView.click();

            calendar_page.selectDay(tomorrow.toString());

            browser.driver.sleep(3000);

            element(by.css('.fc-more')).isPresent().then(function (isVisible) {
                //verify the event was updated
                if (isVisible) {
                    element(by.css('.fc-more')).click();
                    browser.driver.sleep(2000);
                    let event = element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                        .filter(function (elem) {
                            return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                                //expect(text).not.toBe(null); //resolving promise
                                return text === subject;
                            });
                        });
                    expect(event.count()).toBe(1);
                } else {
                    let event = element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                        .filter(function (elem) {
                            return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                                //expect(text).not.toBe(null);//resolving promise
                                return text === subject;
                            });
                        });
                    expect(event.count()).toBe(1);
                }
            });

        });

        it('should be able to change \'All Day\' Event to \'Non All Day\' Event', () => {
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
                                //expect(text).not.toBe(null); //resolving promise
                                return text === subject;
                            });
                        })
                        .first()
                        .click();
                } else {
                    let event = element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                        .filter(function (elem) {
                            return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                                //expect(text).not.toBe(null);//resolving promise
                                return text === subject;
                            });
                        })
                        .first()
                        .click();
                }
            });

            event_page.btn_editEvent.click();

            //edit the event
            //change to Non All Day event
            event_page.rad_allDay.click();

            browser.driver.sleep(3000);

            //verify the Start/End time label is displaying the selected date/time
            let start = event_page.roundTime(new Date());
            let end = event_page.roundTime(new Date());
            end.setHours(start.getHours() + 1);

            let startTimeString = event_page.formatDateTimeString(start);
            let endTimeString = event_page.formatDateTimeString(end);

            expect(event_page.lbl_startDate.getAttribute('value')).toBe(startTimeString);
            expect(event_page.lbl_endDate.getAttribute('value')).toBe(endTimeString);

            //save
            event_page.btn_save.click();

            browser.driver.sleep(3000);

            event_page.btn_close.click();

            let calendar_page = require('../PageObjects/calendar_page.js');
            let timeRange = calendar_page.formatDisplayedTimeRange(start, end);

            //verify the event was now displayed as 'Non All Day' event
            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().element(by.css('div.fc-content div.fc-time span')).getText().then((time) => {
                    expect(time).toBe(timeRange);
                });
        });

    });

    describe('Non All-day event', () => {
        it('should edit event subject successfully', () => {

            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, false, '', [], '', '', ['MeetingType=1:1 Meeting']);

            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().click();

            event_page.btn_editEvent.click();

            //edit the event
            let newSubject = guid();

            event_page.fld_subject.clear();
            event_page.fld_subject.sendKeys(newSubject);

            event_page.btn_save.click();

            browser.driver.sleep(3000);

            event_page.btn_close.click();

            //verify the event info was updated
            let event = element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === newSubject;
                    });
                });
            expect(event.count()).toBe(1);
        });

        it('should edit event Start/End time successfully', () => {

            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, false, '', [], '', '', ['MeetingType=1:1 Meeting']);

            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().click();

            event_page.btn_editEvent.click();

            //edit the Start/End time
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            let tomorrowTimeString = tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + tomorrow.getDate();

            //select the Start Date
            event_page.lbl_startDate.click();

            browser.driver.sleep(2000);

            //check if today is the last day of the month
            let today = new Date();
            let lastDay = ((tomorrow.getMonth() - today.getMonth()) == 1) ? true : false;

            if (lastDay) {
                element(by.css('datetime-picker div div.month button.next')).click();
                browser.driver.sleep(1000);
            }

            element.all(by.className('day selectable'))
                .filter(function (elem) {
                    return elem.getAttribute('title').then(function (text) {
                        expect(text).not.toBe(null); //resolving promise
                        return text === tomorrowTimeString;
                    });
                }).first().click();

            browser.driver.sleep(2000);

            event_page.fld_background.click();

            browser.driver.sleep(2000);

            //select the End Date
            event_page.lbl_endDate.click();

            if (lastDay) {
                element(by.css('datetime-picker div div.month button.next')).click();
                browser.driver.sleep(1000);
            }

            element.all(by.className('day selectable'))
                .filter(function (elem) {
                    return elem.getAttribute('title').then(function (text) {
                        expect(text).not.toBe(null); //resolving promise
                        return text === tomorrowTimeString;
                    });
                }).first().click();

            browser.driver.sleep(2000);

            event_page.fld_background.click();

            browser.driver.sleep(1000);

            //verify the Start/End time label is displaying the selected date/time
            let start = event_page.roundTime(tomorrow);
            let end = event_page.roundTime(tomorrow);
            end.setHours(start.getHours() + 1);

            let startTimeString = event_page.formatDateTimeString(start);
            let endTimeString = event_page.formatDateTimeString(end);

            expect(event_page.lbl_startDate.getAttribute('value')).toBe(startTimeString);
            expect(event_page.lbl_endDate.getAttribute('value')).toBe(endTimeString);

            event_page.btn_save.click();

            browser.driver.sleep(2000);

            event_page.btn_close.click();

            let calendar_page = require('../PageObjects/calendar_page.js');
            let timeRange = calendar_page.formatDisplayedTimeRange(start, end);


            //calendar_page.btn_dayView.click();

            calendar_page.selectDay(tomorrow.toString());

            browser.driver.sleep(2000);

            //verify the event info was updated on the calendar
            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().element(by.css('div.fc-content div.fc-time span')).getText().then((time) => {
                    expect(time).toBe(timeRange);
                });
        });

        //BUG PQ-3053
        it('should be able to change \'Non All Day\' Event to \'All Day\' Event', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, false, '', [], '', '', ['MeetingType=1:1 Meeting']);

            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().click();

            event_page.btn_editEvent.click();

            //edit the event
            //change to All Day event
            event_page.rad_allDay.click();

            browser.driver.sleep(2000);

            //save
            event_page.btn_save.click();

            browser.driver.sleep(2000);

            event_page.btn_close.click();

            browser.driver.sleep(2000);

            //if 'click more' button exists then click
            element(by.css('.fc-more')).isPresent().then(function (isVisible) {

                let event = [];
                if (isVisible) {
                    element(by.css('.fc-more')).click();
                    browser.driver.sleep(2000);
                    event = element.all(by.css('div.fc-popover.fc-more-popover div.fc-body.ui-widget-content div.fc-event-container a'))
                        .filter(function (elem) {
                            return elem.element(by.css('div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null); //resolving promise
                                return text === subject;
                            });
                        });
                } else {
                    event = element.all(by.css('div.fc-row.fc-week.ui-widget-content div.fc-content-skeleton table tbody tr'))
                        .filter(function (elem) {
                            return elem.element(by.css('td.fc-event-container a div.fc-content span.fc-title')).getText().then(function (text) {
                                expect(text).not.toBe(null);//resolving promise
                                return text === subject;
                            });
                        });
                }
                expect(event.count()).toBe(1);
            });
        });

    });
});