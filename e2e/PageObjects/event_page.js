var event_page = function () {

    this.lbl_title = element(by.id('title'));

    this.lbl_dayDisplayLine1 = element(by.id('date-display-line1'));

    this.lbl_dayDisplayLine2 = element(by.id('date-display-line2'));

    this.fld_subject = element(by.id('subject'));

    this.fld_location = element(by.id('location'));

    this.fld_background = element(by.css('.event-form-toolbar'));

    this.fld_attendees = element(by.css('pq-event-attendees-form pq-autocomplete div p-autocomplete span ul'));

    this.lbl_startDate = element(by.id('startDate'));

    this.lbl_endDate = element(by.id('endDate'));

    this.btn_save = element(by.id('saveBtn'));

    this.btn_close = element(by.id('closeBtn'));

    this.btn_editEvent = element(by.id('editEventBtn'));

    this.btn_deleteEvent = element(by.id('deleteBtn'));

    this.rad_allDay = element(by.css('#allDay label div div.md-slide-toggle-thumb-container div.md-slide-toggle-thumb'));

    this.img_time = element(by.css('form md-card-content md-list md-list-item:nth-child(3) div md-icon'));

    this.img_subject = element(by.css('form md-card-content md-list md-list-item:nth-child(1) div md-icon'));

    //format the date to string i.e : 2016-08-08 11:28
    this.formatDateTimeString = function (d) {
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let date = d.getDate();

        let hour = d.getHours();
        let min = d.getMinutes();

        let monthString = (month < 10) ? '0' + month : month;

        let dateString = (date < 10) ? '0' + date : date;

        let minString = (min < 10) ? '0' + min : min;

        let hourString = (hour < 10) ? '0' + hour : hour;

        return year + '-' + monthString + '-' + dateString + ' ' + hourString + ':' + minString;

    }

    this.roundTime = function (t1) {
        let t = new Date(t1.toString());

        min = t.getMinutes();
        hour = t.getHours();

        if (min < 30 && min > 0) {
            t.setMinutes(30);
        }
        else if (min >= 30 && min < 60) {
            t.setMinutes(0);
            t.setHours(hour + 1);
        }

        t.setSeconds(0);

        return t;
    }

    this.createEvent = function (subject, isAllDay, location, attendees, start, end, metaData) {
        let calendar_page = require('../PageObjects/calendar_page.js');

        let event_page = require('../PageObjects/event_page.js');


        calendar_page.navigateToCalendarPage();

        calendar_page.btn_dayView.click();

        //maximize the windows so all the components can be visible on the create event form.
        browser.driver.manage().window().maximize();

        calendar_page.btn_addEvent.click();

        event_page.fld_subject.sendKeys(subject);

        if (isAllDay)
            event_page.rad_allDay.click();

        if (location != '')
            event_page.fld_location.sendKeys(location);

        if (attendees.length > 0) {
            for (i = 1; i <= attendees.length; i++) {
                let locator = 'pq-event-attendees-form pq-autocomplete div p-autocomplete span ul li:nth-child(' + i + ') input';
                element(by.css(locator)).sendKeys(attendees[i - 1]);
                element(by.css(locator)).sendKeys(protractor.Key.ENTER);
                browser.driver.sleep(2000);
            }
        }

        if (start != '' && end != '') {

            let startMonthYear = calendar_page.monthNamesShort[start.getMonth()] + ' ' + start.getFullYear();
            let endMonthYear = calendar_page.monthNamesShort[end.getMonth()] + ' ' + start.getFullYear();

            let startDay = start.getDate();
            let endDay = end.getDate();

            //start date
            browser.driver.sleep(1000);
            event_page.lbl_startDate.click();

            //selectin the correct month
            element(by.css('datetime-picker > div > div.month')).getText().then(function (text) {
                expect(text).toBe(text); //added this line so the promise can be resolved here before parsing the date
                var currentSelectedDate = new Date(text.split('\n')[1]);

                //gap between the currently selected month and the start month
                let diff = (currentSelectedDate - start) / (1000 * 60 * 60 * 24 * 30);

                return Math.ceil(diff);
            }).then(function (i) {

                var btn = null;
                if (i > 0)
                    btn = element(by.css('datetime-picker > div > div.month > button.prev')); //prev arrow
                else if (i < 0)
                    btn = element(by.css('datetime-picker > div > div.month > button.next')); //forward arrow

                for (j = 0; j < Math.abs(i); j++) {
                    btn.click();
                    browser.driver.sleep(1000);
                }
            });

            browser.driver.sleep(1000);
            //select the correct day
            let startTimeString = start.getFullYear() + '-' + (start.getMonth()+1) + '-' + start.getDate();

            element.all(by.className('day selectable'))
                .filter(function (elem) {
                    return elem.getAttribute('title').then(function (text) {
                        expect(text).not.toBe(null); //resolving promise
                        return text === startTimeString;
                    });
                }).first().click();


            browser.driver.sleep(2000);

            this.fld_background.click();

            browser.driver.sleep(2000);

            //end date
            event_page.lbl_endDate.click();

            //select the correct month
            element(by.css('datetime-picker > div > div.month')).getText().then(function (text) {
                expect(text).toBe(text); //added this line so the promise can be resolved here before parsing the date
                var currentSelectedDate = new Date(text.split('\n')[1]);

                //gap between the currently selected month and the start month
                let diff = (currentSelectedDate - end) / (1000 * 60 * 60 * 24 * 30);
                return Math.ceil(diff);
            }).then(function (i) {
                var btn = null;
                if (i > 0)
                    btn = element(by.css('datetime-picker > div > div.month > button.prev')); //prev arrow
                else if (i < 0)
                    btn = element(by.css('datetime-picker > div > div.month > button.next')); //forward arrow

                for (j = 0; j < Math.abs(i); j++) {
                    btn.click();
                    browser.driver.sleep(1000);
                }
            });

            //select the correct day
            let endTimeString = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();

            element.all(by.className('day selectable'))
                .filter(function (elem) {
                    return elem.getAttribute('title').then(function (text) {
                        expect(text).not.toBe(null); //resolving promise
                        //console.log(text);
                        return text === endTimeString;
                    });
                }).first().click();

            browser.driver.sleep(3000);

            this.fld_background.click();

            browser.driver.sleep(2000);
        }

        if (metaData.length > 0) {
            let meetingTypesList = [];
            let topicsList = [];

            //let metaDataList = metaData.split('|');

            for (i = 0; i < metaData.length; i++) {
                let meta = metaData[i];
                if (meta.includes('MeetingType')) {
                    meetingTypesList = meta.split('=')[1].split(',');
                }
                if (meta.includes('Topic')) {
                    topicsList = meta.split('=')[1].split(',');
                }
            }

            if (meetingTypesList.length > 0) {
                let meetingTypesDropDownArrow = element.all(by.css('#event-form-card div div form md-card-content form div:nth-child(1) div.form-row-content pq-multi-select div md-icon')).first();
                browser.executeScript("arguments[0].scrollIntoView();", meetingTypesDropDownArrow.getWebElement());
                meetingTypesDropDownArrow.click();
                browser.driver.sleep(2000);
            }


            for (i = 0; i < meetingTypesList.length; i++) {

                let type = meetingTypesList[i];

                let options = element.all(by.css('#event-form-card div div form md-card-content form div:nth-child(1) div.form-row-content pq-multi-select div md-card div md-list md-list-item'))
                    .filter(function (item) {
                        return item.element(by.css('div.md-list-item div.md-list-text')).getText().then(function (text) {
                            expect(text).not.toBe(null); //resolving promise
                            return text.trim() === type;
                        });
                    });

                expect(options.count()).toBe(1);

                let check = options.first().element(by.css('div.md-list-item md-icon'));

                browser.executeScript("arguments[0].scrollIntoView();", check.getWebElement());
                browser.driver.sleep(2000);
                check.click();

                browser.driver.sleep(2000);
            }

            //click on the background to make the dropdown disappeared
            this.fld_background.click();


            if (topicsList.length > 0) {
                let topicsDropDownArrow = element.all(by.css('#event-form-card div div form md-card-content form div:nth-child(2) div.form-row-content pq-multi-select div md-icon')).first();
                browser.executeScript("arguments[0].scrollIntoView();", topicsDropDownArrow.getWebElement());
                topicsDropDownArrow.click();
                browser.driver.sleep(2000);
            }


            for (i = 0; i < topicsList.length; i++) {

                let topic = topicsList[i];

                let options = element.all(by.css('#event-form-card div div form md-card-content form div:nth-child(2) div.form-row-content pq-multi-select div md-card div md-list md-list-item'))
                    .filter(function (item) {
                        return item.element(by.css('div.md-list-item div.md-list-text')).getText().then(function (text) {
                            expect(text).not.toBe(null); //resolving promise
                            return text.trim() === topic;
                        });
                    });

                expect(options.count()).toBe(1);

                let check = options.first().element(by.css('div.md-list-item md-icon'));

                browser.executeScript("arguments[0].scrollIntoView();", check.getWebElement());
                browser.driver.sleep(2000);
                check.click();

                browser.driver.sleep(2000);
            }

            //click on the background to make the dropdown disappeared
            this.fld_background.click();

        }

        browser.driver.sleep(2000);

        //temporary solution to click on the Save button because it is currently hiden
        //browser.executeScript('document.getElementById(\'saveBtn\').click()');

        event_page.btn_save.click();

        browser.driver.sleep(1000);

    }

    //creating event with specified start/end day , ALL DAY event only
    // this.addEvent = function (subject, isAllDay, start, end) {
    //     let calendar_page = require('../PageObjects/calendar_page.js');


    //     let startMonthYear = calendar_page.monthNamesShort[start.getMonth()] + ' ' + start.getFullYear();
    //     let endMonthYear = calendar_page.monthNamesShort[end.getMonth()] + ' ' + start.getFullYear();

    //     let startDay = start.getDate();
    //     let endDay = end.getDate();

    //     let event_page = require('../PageObjects/event_page.js');

    //     //calendar_page.navigateToCalendarPage();

    //     calendar_page.btn_dayView.click();

    //     calendar_page.btn_addEvent.click();

    //     event_page.fld_subject.sendKeys(subject);

    //     if (isAllDay)
    //         event_page.rad_allDay.click();

    //     //start date
    //     browser.driver.sleep(1000);
    //     event_page.lbl_startDate.click();

    //     //selectin the correct month
    //     element(by.css('datetime-picker > div > div.month')).getText().then(function (text) {
    //         expect(text).toBe(text); //added this line so the promise can be resolved here before parsing the date
    //         var currentSelectedDate = new Date(text.split('\n')[1]);

    //         //gap between the currently selected month and the start month
    //         let diff = (currentSelectedDate - start) / (1000 * 60 * 60 * 24 * 30);
    //         return Math.round(diff);
    //     }).then(function (i) {

    //         var btn = null;
    //         if (i > 0)
    //             btn = element(by.css('datetime-picker > div > div.month > button.prev')); //prev arrow
    //         else if (i < 0)
    //             btn = element(by.css('datetime-picker > div > div.month > button.next')); //forward arrow

    //         for (j = 0; j < Math.abs(i) - 1; j++) {
    //             btn.click();
    //             browser.driver.sleep(1000);
    //         }
    //     });

    //     browser.driver.sleep(1000);
    //     //select the correct day
    //     let startTimeString = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();

    //     element.all(by.className('day selectable'))
    //         .filter(function (elem) {
    //             return elem.getAttribute('title').then(function (text) {
    //                 expect(text).not.toBe(null); //resolving promise
    //                 return text === startTimeString;
    //             });
    //         }).first().click();


    //     browser.driver.sleep(2000);

    //     element(by.css('.md-card')).click();

    //     browser.driver.sleep(2000);

    //     //end date
    //     event_page.lbl_endDate.click();

    //     //selectin the correct month
    //     element(by.css('datetime-picker > div > div.month')).getText().then(function (text) {
    //         expect(text).toBe(text); //added this line so the promise can be resolved here before parsing the date
    //         var currentSelectedDate = new Date(text.split('\n')[1]);

    //         //gap between the currently selected month and the start month
    //         let diff = (currentSelectedDate - end) / (1000 * 60 * 60 * 24 * 30);
    //         return Math.round(diff);
    //     }).then(function (i) {

    //         var btn = null;
    //         if (i > 0)
    //             btn = element(by.css('datetime-picker > div > div.month > button.prev')); //prev arrow
    //         else if (i < 0)
    //             btn = element(by.css('datetime-picker > div > div.month > button.next')); //forward arrow

    //         for (j = 0; j < Math.abs(i) - 1; j++) {
    //             btn.click();
    //             browser.driver.sleep(1000);
    //         }
    //     });

    //     //select the correct day
    //     let endTimeString = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();

    //     element.all(by.className('day selectable'))
    //         .filter(function (elem) {
    //             return elem.getAttribute('title').then(function (text) {
    //                 expect(text).not.toBe(null); //resolving promise
    //                 return text === endTimeString;
    //             });
    //         }).first().click();

    //     browser.driver.sleep(3000);

    //     element(by.css('.md-card')).click();

    //     browser.driver.sleep(2000);

    //     event_page.btn_save.click();
    // }

    //time format : 3:11 AM - 4:11 AM
    this.formatDisplayedTimeRange = function (start, end) {
        let startPmAm = (start.getHours() >= 12) ? 'PM' : 'AM';
        let startHour = (start.getHours() > 12) ? (start.getHours() - 12) : (start.getHours());
        let startMin = (start.getMinutes() < 10) ? '0' + (start.getMinutes()) : (start.getMinutes());

        let endHour = (end.getHours() > 12) ? (end.getHours() - 12) : (end.getHours());
        let endMin = (end.getMinutes() < 10) ? '0' + (end.getMinutes()) : (end.getMinutes());
        let endPmAm = (end.getHours() >= 12) ? 'PM' : 'AM';

        return startHour + ':' + startMin + ' ' + startPmAm + ' - ' + endHour + ':' + endMin + ' ' + endPmAm;
    }
}
module.exports = new event_page();