import {testReportManager} from '../controllers/controllers';

const testrepo = new testReportManager();

const routes = (app) => {
    app.route('/testReport')
    .get((req, res) => testrepo.getAllTestReports(req, res))
    .post((req, res) => testrepo.createNewTestReport(req, res));

    app.route('/testReport/:_id')
    .get((req, res) => testrepo.getTestReportByID(req, res));
    
}
export default routes