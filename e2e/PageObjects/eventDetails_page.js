var eventDetails_page = function () {

    this.btn_close = element(by.id('closeBtn'));

    this.lbl_subject = element(by.id('title'));
    this.lbl_eventDate1 = element(by.id('date-display-line1'));
    this.lbl_eventDate2 = element(by.id('date-display-line2'));    

};
module.exports = new eventDetails_page();