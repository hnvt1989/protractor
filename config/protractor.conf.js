// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '../e2e/**/*e2e-spec.js'
  ],
  capabilities: {
    'browserName': 'chrome',
	'webStorageEnabled': ' true',
    'chromeOptions': {
            'args': ['disable-extensions']
        }	
  },
  directConnect: true,
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  params: {
    Login: {
      Url: 'login/test/basic',
      UserName: 'TestUser',
      Password: 'test'
    },
    BaseUrl: 'http://localhost:4200/',
    Calendar: {
      Url: 'calendar'
    }
  },
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function () { }
  },

  useAllAngular2AppRoots: true,
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e'
    });
  },

  onPrepare: function () {
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: true,
      savePath: 'testresults',
      filePrefix: 'xmloutput'
    }));

    var SpecReporter = require('jasmine-spec-reporter');

    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: true,
      displayFailureSummary: true,
      displayPendingSummary: true,
      displaySuccessfulSpec: true,
      displayFailedSpec: true,
      displayPendingSpec: true,
      displaySpecDuration: false,
      displaySuiteNumber: false,
      colors: {
        success: 'green',
        failure: 'red',
        pending: 'yellow'
      },
      customProcessors: []
    }));

    global.isAngularSite = function (flag) {
      browser.ignoreSynchronization = !flag;
    };

	global.guid = function(){
	  function s4(){
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  }
	  return s4() + s4() + '-' + s4();
	};
  
	}
}
