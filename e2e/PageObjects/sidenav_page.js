var sidenav_page = function(){

    this.btn_accountPlan = element(by.id('nav-accounts'));
    this.btn_callPlanning = element(by.id('nav-callPlanning'));
    this.btn_calendar = element(by.id('nav-calendar'));
    this.btn_logout = element(by.id('nav-logout'));
    this.btn_retrunToProlifiq = element(by.id('nav-retrunToProlifiq'));
    this.btn_downArrow = element(by.css('.down-arrow'));
    this.btn_upArrow = element(by.css('.up-arrow'));
    this.btn_appbar = element(by.css('.appbar-left-button'));

    this.lbl_userName = element(by.css('.user-name'));
};
module.exports = new sidenav_page();