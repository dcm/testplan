if(process.env.NODE_ENV !== 'production') {
  module.exports = {
    TESTPLAN_REPORT_1: require('./TESTPLAN_REPORT_1.json'),
    TESTPLAN_REPORT_2: require('./TESTPLAN_REPORT_2.json'),
    SIMPLE_REPORT: require('./SIMPLE_REPORT.json'),
    fakeReportAssertions: require('./fakeReportAssertions.json'),
    FakeInteractiveReport: require('./FakeInteractiveReport'),
  };
} else {
  module.exports = {};
}
