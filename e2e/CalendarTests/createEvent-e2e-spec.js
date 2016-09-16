describe('Create event', () => {

    beforeEach(() => {
        var login_page = require('../PageObjects/login_page.js');
        login_page.login(browser.params.Login.UserName, browser.params.Login.Password);

        let calendar_page = require('../PageObjects/calendar_page.js');
        calendar_page.navigateToCalendarPage();
    });

    it('should display Title, Save btn and Close[X] btn, img icons on the form', () => {
        let calendar_page = require('../PageObjects/calendar_page.js');
        let event_page = require('../PageObjects/event_page.js');
        calendar_page.btn_dayView.click();

        calendar_page.btn_addEvent.click();

        //maximize the windows so all the components can be visible on the create event form.
        browser.driver.manage().window().maximize();

        expect(event_page.lbl_title.isPresent()).toBe(true);
        expect(event_page.lbl_title.getText()).toBe('Create Event');

        expect(event_page.btn_close.isPresent()).toBe(true);
        expect(event_page.btn_save.isPresent()).toBe(true);

        expect(event_page.img_subject.isPresent()).toBe(true);
        expect(event_page.img_time.isPresent()).toBe(true);
    });
    
    it('should validate Attendee\'s email address', () => {

        let calendar_page = require('../PageObjects/calendar_page.js');

        let event_page = require('../PageObjects/event_page.js');

        calendar_page.navigateToCalendarPage();

        calendar_page.btn_dayView.click();

        calendar_page.btn_addEvent.click();

        let locator = 'pq-event-attendees-form pq-autocomplete div p-autocomplete span ul li input';
        element(by.css(locator)).sendKeys('invalid email');
        element(by.css(locator)).sendKeys(protractor.Key.ENTER);
        browser.driver.sleep(2000);

        browser.switchTo().alert().then(function (alert) {
            expect(alert.getText()).toBe('Invalid Email Address');
            alert.accept();
        });
    });

    it('should display error when FreeForm location has more than max length (500) characters.', () => {
        let subject = guid();

        let calendar_page = require('../PageObjects/calendar_page.js');
        let event_page = require('../PageObjects/event_page.js');

        let rndString = guid();

        calendar_page.btn_dayView.click();

        calendar_page.btn_addEvent.click();

        event_page.fld_subject.sendKeys(rndString);

        for (var i = 0; i < 50; i++) event_page.fld_location.sendKeys(rndString);

        //verify the error.       
        expect(element(by.css('#event-form-card div form md-card-content div.error em')).getText()).toBe('Location must be less than 500 letters');

        //verify that 'Save' button is not Enabled.
        expect(event_page.btn_save.isEnabled()).toBe(false);

        browser.driver.sleep(2000);
    });

    it('should not create event when click [X] to dismiss the create event modal', () => {
        let calendar_page = require('../PageObjects/calendar_page.js');

        let event_page = require('../PageObjects/event_page.js');
        calendar_page.btn_dayView.click();

        calendar_page.btn_addEvent.click();

        //maximize the windows so all the components can be visible on the create event form.
        browser.driver.manage().window().maximize();

        let subject = guid();

        event_page.fld_subject.sendKeys(subject);

        event_page.btn_close.click();

        var events = element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
            .filter(function (elem) {
                return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                    return text === subject;
                });
            });
        expect(events.count()).toBe(0);
    });

    it('should able to remove attendees from the list prior to saving', () => {
        let calendar_page = require('../PageObjects/calendar_page.js');

        let event_page = require('../PageObjects/event_page.js');
        calendar_page.btn_dayView.click();

        calendar_page.btn_addEvent.click();

        let locator = 'pq-event-attendees-form pq-autocomplete div p-autocomplete span ul li input';
        element(by.css(locator)).sendKeys('qa@prolifiq.com');
        element(by.css(locator)).sendKeys(protractor.Key.ENTER);
        browser.driver.sleep(2000);

        //the list of attendee input should be 2 now.
        element.all(by.css('pq-event-attendees-form pq-autocomplete div p-autocomplete span ul li')).then((l) => {
            expect(l.length).toBe(2);
        });

        //remove this attendees
        element(by.css('pq-event-attendees-form pq-autocomplete div p-autocomplete span ul li:nth-child(1) span:nth-child(1)')).click();

        //verify the attendee has been removed. the list of input should be 1
        element.all(by.css('pq-event-attendees-form pq-autocomplete div p-autocomplete span ul li')).then((l) => {
            expect(l.length).toBe(1);
        });
    });

    describe('All-Day event', () => {
        it('should create event successfully with no location and 0 attendees', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, true, '', [], '', '', ['MeetingType=1:1 Meeting']);

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

        it('should create event with FreeForm attendees', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, true, '', ['test@test.com', 'hello@test.com', 'qa@prolifiq.com'], '', '', ['MeetingType=1:1 Meeting']);

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

            //waiting for PQ-2854 to be ready.
            //TODO: verify the attendees were added on Event Detail screen.
        });


        it('should create event with Meta Data', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, true, '', [], '', '', ['MeetingType=1:1 Meeting,1:1 Meeting - Access', 'Topic=Head and Neck,Hodgkin\'s Lymphoma']);

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

            //waiting for PQ-2854 to be ready.
            //TODO: verify the attendees were added on Event Detail screen.
        });

        it('should only display Date and should not display the Time portion', () => {

            let calendar_page = require('../PageObjects/calendar_page.js');
            let event_page = require('../PageObjects/event_page.js');
            calendar_page.btn_dayView.click();

            calendar_page.btn_addEvent.click();

            //toggle the all day radio button to set All Day to 'true'
            event_page.rad_allDay.click();

            let start = event_page.roundTime(new Date());
            let end = event_page.roundTime(new Date());
            end.setHours(start.getHours() + 1);

            let startTimeString = event_page.formatDateTimeString(start).split(' ')[0]; //date time stamp should only display 
            let endTimeString = event_page.formatDateTimeString(end).split(' ')[0];

            expect(event_page.lbl_startDate.getAttribute('value')).toBe(startTimeString);
            expect(event_page.lbl_endDate.getAttribute('value')).toBe(endTimeString);

            event_page.btn_close.click();
        });



        it('should save event with FreeForm location successfully and display the created event on calendar.', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, true, 'some location', [], '', '', ['MeetingType=1:1 Meeting']);

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

    describe('Non All-Day event', () => {
        it('should create event successfully with no location and 0 attendees', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, false, '', [], '', '', ['MeetingType=1:1 Meeting']);

            let calendar_page = require('../PageObjects/calendar_page.js');

            let start = event_page.roundTime(new Date());
            let end = event_page.roundTime(new Date());
            end.setHours(start.getHours() + 1);

            let timeRange = calendar_page.formatDisplayedTimeRange(start, end);

            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().element(by.css('div.fc-content div.fc-time span')).getText().then((time) => {
                    expect(time).toBe(timeRange);
                });
        });

        it('should create event with FreeForm attendees', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');

            event_page.createEvent(subject, false, '', ['test@test.com', 'hello@test.com', 'qa@prolifiq.com'], '', '', ['MeetingType=1:1 Meeting']);

            let start = event_page.roundTime(new Date());
            let end = event_page.roundTime(new Date());
            end.setHours(start.getHours() + 1);

            let calendar_page = require('../PageObjects/calendar_page.js');

            let timeRange = calendar_page.formatDisplayedTimeRange(start, end);

            //verify the created event was shown up in the calendar
            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().element(by.css('div.fc-content div.fc-time span')).getText().then((time) => {
                    expect(time).toBe(timeRange);
                });

            //waiting for PQ-2854 to be ready.
            //TODO: verify the attendees were added on Event Detail screen.
        });

        it('should create event with FreeForm location successfully and display the created event on calendar.', () => {
            let subject = guid();

            let event_page = require('../PageObjects/event_page.js');
            event_page.createEvent(subject, false, 'some location', [], '', '', ['MeetingType=1:1 Meeting']);

            let calendar_page = require('../PageObjects/calendar_page.js');

            let start = event_page.roundTime(new Date());
            let end = event_page.roundTime(new Date());
            end.setHours(start.getHours() + 1);

            let timeRange = calendar_page.formatDisplayedTimeRange(start, end);

            element.all(by.css('div.fc-event-container a.fc-time-grid-event'))
                .filter(function (elem) {
                    return elem.element(by.css('div.fc-content div.fc-title')).getText().then(function (text) {
                        return text === subject;
                    });
                }).first().element(by.css('div.fc-content div.fc-time span')).getText().then((time) => {
                    expect(time).toBe(timeRange);
                });
        });



        it('should display error and do not allow to save event when selected start date is greater than end date', () => {
            let calendar_page = require('../PageObjects/calendar_page.js');

            let event_page = require('../PageObjects/event_page.js');
            calendar_page.btn_dayView.click();

            calendar_page.btn_addEvent.click();

            event_page.lbl_startDate.click();

            browser.driver.sleep(2000);

            let slider = element(by.css('.hourInput'));

            browser.actions().dragAndDrop(
                slider,
                { x: 100, y: 0 }
            ).perform();

            event_page.fld_background.click();

            browser.driver.sleep(2000);

            let error = element(by.css('md-card-content md-list em'));

            expect(error.getText()).toBe('Start date must be before end date.');
            expect(event_page.btn_save.isEnabled()).toBe(false);
        });

        it('should default Start Time to be the next half hour and End Time should be an hour later than Start Time', () => {
            let calendar_page = require('../PageObjects/calendar_page.js');

            let event_page = require('../PageObjects/event_page.js');
            calendar_page.btn_dayView.click();

            calendar_page.btn_addEvent.click();

            let start = event_page.roundTime(new Date());
            let end = event_page.roundTime(new Date());
            end.setHours(start.getHours() + 1);

            let startTimeString = event_page.formatDateTimeString(start);
            let endTimeString = event_page.formatDateTimeString(end);

            expect(event_page.lbl_startDate.getAttribute('value')).toBe(startTimeString);
            expect(event_page.lbl_endDate.getAttribute('value')).toBe(endTimeString);

            event_page.btn_close.click();
        });
    });
});