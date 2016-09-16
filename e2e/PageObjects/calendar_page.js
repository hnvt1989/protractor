var calendar_page = function () {

    this.defaultMonth = function () {
        return $('body  mc-app  pq-calendar  p-schedule  div  div.fc-toolbar  div.fc-center  h2').getText();
    }

    this.monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    this.monthNamesShort = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    this.lbl_header = element(by.css('md-toolbar div md-toolbar-row h1'));

    this.lbl_currentDate = element(by.css('body  mc-app  pq-calendar  p-schedule  div  div.fc-toolbar  div.fc-center  h2'));

    this.btn_next = element(by.css('.fc-next-button'));

    this.btn_prev = element(by.css('.fc-prev-button'));

    this.btn_monthView = element(by.css('.fc-month-button'));

    this.btn_weekView = element(by.css('.fc-agendaWeek-button'));

    this.btn_dayView = element(by.css('.fc-agendaDay-button'));

    this.btn_today = element(by.css('.fc-today-button'));

    this.btn_addEvent = element(by.id('addEventBtn'));

    this.navigateToCalendarPage = function () {
        isAngularSite(true);
        browser.get(browser.params.BaseUrl + browser.params.Calendar.Url);

        // //wait for the calendar grid to be visible
        browser.driver.wait(function () {
            return browser.driver.isElementPresent(by.css('body mc-app pq-calendar p-schedule div div.fc-view-container div'));
        }, 20000);
    };

    this.selectMonth = function (date) {
        this.lbl_currentDate.getText().then(function (text) {

            var selectDate = new Date(date);
            expect(text).toBe(text); //added this line so the promise can be resolved here before parsing the date
            var currentSelectedDate = new Date(text);

            return selectDate.getMonth() - currentSelectedDate.getMonth();
        }).then(function (i) {
            var btn = null;
            if (i < 0)
                btn = element(by.css('.fc-prev-button')); //prev arrow
            else if (i > 0)
                btn = element(by.css('.fc-next-button')); //forward arrow

            for (j = 0; j < Math.abs(i); j++) {
                btn.click();
                browser.driver.sleep(1000);
            }
        });

        browser.driver.sleep(2000);
    };

    this.selectWeek = function (date) {
        var dateOfWeek = new Date(date).getDay();

        var start = new Date(date);
        start.setDate(start.getDate() - dateOfWeek);

        var end = new Date(date);
        end.setDate(end.getDate() + (6 - dateOfWeek));

        var startToString = this.monthNamesShort[start.getMonth()] + " " + start.getDate();
        var endToString = this.monthNamesShort[end.getMonth()] + " " + end.getDate() + ", " + end.getFullYear();

        var expectedString = startToString + " – " + endToString;


        this.lbl_currentDate.getText().then(function (text) {
            expect(text).toBe(text); //added this line so the promise can be resolved here before parsing the date
            var currentSelectedStartDate = new Date(text.split("–")[0] + text.split(",")[1]);

            var diff = (currentSelectedStartDate - start) / (1000 * 60 * 60 * 24 * 7);

            return Math.round(diff);


        }).then(function (i) {
            var btn = null;
            if (i > 0)
                btn = element(by.css('.fc-prev-button')); //prev arrow
            else if (i < 0)
                btn = element(by.css('.fc-next-button')); //forward arrow

            for (j = 0; j < Math.abs(i); j++) {
                btn.click();
                browser.driver.sleep(1000);
            }
        });
    };

    this.selectDay = function (date) {
        this.lbl_currentDate.getText().then(function (text) {
            expect(text).toBe(text); //added this line so the promise can be resolved here before parsing the date

            let selectDate = new Date(date);
            var currentSelectedStartDate = new Date(text);

            selectDate.setHours(1);
            currentSelectedStartDate.setHours(1);

            var diff = (currentSelectedStartDate - selectDate) / (1000 * 60 * 60 * 24);

            return Math.round(diff);


        }).then(function (i) {
            var btn = null;
            if (i > 0)
                btn = element(by.css('.fc-prev-button')); //prev arrow
            else if (i < 0)
                btn = element(by.css('.fc-next-button')); //forward arrow

            for (j = 0; j < Math.abs(i); j++) {
                btn.click();
                browser.driver.sleep(1000);
            }
        });
    };

    //time format : 3:11 - 4:11
    this.formatDisplayedTimeRange = function (start, end) {
        let startHour = (start.getHours() > 12) ? (start.getHours() - 12) : (start.getHours());
        let startMin = (start.getMinutes() < 10) ? '0' + (start.getMinutes()) : (start.getMinutes());

        let endHour = (end.getHours() > 12) ? (end.getHours() - 12) : (end.getHours());
        let endMin = (end.getMinutes() < 10) ? '0' + (end.getMinutes()) : (end.getMinutes());

        return startHour + ':' + startMin + ' - ' + endHour + ':' + endMin;
    }
};
module.exports = new calendar_page();