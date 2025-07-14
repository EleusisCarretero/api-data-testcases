import {testReportManager} from '../controllers/controllers';

const testrepo = new testReportManager();

const routes = (app) => {
    app.route('/testReport')
    .get((req, res) => testrepo.getAllTestReports(req, res))
    .post((req, res) => testrepo.createNewTestReport(req, res))
    .delete((req,res) => testrepo.deleteAllReports(req, res));

    app.route('/testReport/:_id')
    .get((req, res) => testrepo.getTestReportByID(req, res))
    .put((req, res) => testrepo.updateTestReportByID(req,res))
    .delete((req, res) => testrepo.deleteTestReportByID(req,res));

    app.route('/testReport/:_id/summary')
    .get((req, res) => testrepo.getTestReportSummarByID(req, res));

    app.route('/testReport/:_id/retry')
    .put((req, res) => testrepo.retryTestReportByID(req, res));


    app.route('/testReport/stats/global')
    .get((req, res) => testrepo.getStatsGlobal(req, res));

    app.route('/testReport/stats/byTags')
    .get((req, res) => testrepo.getStatsTags(req,res));

    app.route('/testReport/stats/byTags/:tag')
    .get((req, res) => testrepo.getStatsTagsByTag(req, res));

    
}
export default routes