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

    app.route('/testReport/stats/global')
    .get((req, res) => testrepo.getStatsGlobal(req, res));
    
}
export default routes