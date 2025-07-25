import { testReportManager } from "../controllers";
const { statusCodes } = require("../codes");
const { ObjectId } = require("mongodb");

/**
 * Globals
 */

// 1. create a global instance of the class we can to mock
const unitTestManager = new testReportManager();
const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
};
/**
 * createNewTestReport UnitTest
 */
describe('Creating new test report Module: createNewTestReport', () => {
    let req; 
    beforeEach(() => {
        console.log("Creating common const variables");
        req = {
            body: {
                frameworkName: "Selenium-java-automation",
                suiteName: "Nightly regression",
                tags: ["smoke", "log in", "products", "sanity"],
                reportResults: {
                    status:'PASSED',
                    totalExecuted: 10,
                    totalPassed: 10,
                    totalFailed: 0,
                    reportLink: "https://report_n1.xml",
                    failedTestCases: null
                },
                retry: false,
                executionTime: {
                    startTime: "2025-08-09",
                    endTime: "2025-08-09",
                    duration: 70000
                },
                enviroment:{
                    browser: "Chrome",
                    branch: "main",
                    commit: "b5b4bce"
                }
            }
        }
    });
    test('Test createNewTestReport: Positive response', async() => {        
        //mocking
        const saveMock = jest.fn().mockResolvedValue(req.body);
        unitTestManager.testReport = jest.fn(() => ({
            save: saveMock
        }));
        // calling function under test
        await unitTestManager.createNewTestReport(req,res);
        // Making assertion
        expect(unitTestManager.testReport).toHaveBeenCalledWith(req.body);
        expect(saveMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(statusCodes.reqSuccessfull.created);
        expect(res.json).toHaveBeenCalledWith(req.body)
    });

    test('Test createNewTestReport: throwing error', async() => {
        const msgError = "expectedResponse is not defined";
        // 3. Mock the value of the function we're Testing
        const saveMock = jest.fn(() => {{throw new Error(msgError)}});
        unitTestManager.testReport = jest.fn(() => ({
            save: saveMock
        }));
        // Execution function under test
        await unitTestManager.createNewTestReport(req,res);
        // Making assertions
        expect(() => expectedResponse()).toThrow();
        expect(() => expectedResponse()).toThrow(Error);
        expect(() => expectedResponse()).toThrow(msgError);
        expect(res.json).not.toHaveBeenCalledWith(req.body);
        expect(res.json).toHaveBeenCalledWith({"error":msgError});
        expect(res.status).toHaveBeenCalledWith(statusCodes.serverProblem.internalError);
    });

    test('Test createNewTestReport: missing requiered parameters', async() =>{
        // Defining req with missing requiere field
        const msgError = "expectedResponse is not defined";
        const excludedField ='frameworkName';
        const expectedErrorMsg = `testReport validation failed: ${excludedField}: Entere the framework name`;
        const reqMissingParam = {body:{}};
        for(let key in req){
            for(k in req[key]){
                if(k!= excludedField) {
                    reqMissingParam[key][k] = req.body[k];
                }
            }
        }
        //mocking
        const saveMock = jest.fn(() => {{throw new Error(expectedErrorMsg)}});
        unitTestManager.testReport = jest.fn(() => ({
            save: saveMock
        }));
        // Calling function under test
        await unitTestManager.createNewTestReport(reqMissingParam, res);
        // Making assertions
        expect(() => expectedResponse()).toThrow();
        expect(() => expectedResponse()).toThrow(msgError);
        expect(res.json).not.toHaveBeenCalledWith(req.body);
        expect(res.json).toHaveBeenCalledWith({"error":expectedErrorMsg});
        expect(res.status).toHaveBeenCalledWith(statusCodes.serverProblem.internalError);

    });

    test('Test createNewTestReport: Missing not requiered field', async() => {
        const reqMissingParam = {body:{}};
        const excludedField ='tags';
        for(let key in req){
            for(k in req[key]){
                if(k!= excludedField) {
                    reqMissingParam[key][k] = req.body[k];
                }
            }
        }
        //mocking
        const saveMock = jest.fn().mockResolvedValue(reqMissingParam.body);
        unitTestManager.testReport = jest.fn(() => ({
            save: saveMock
        }));
        // calling function under test
        await unitTestManager.createNewTestReport(reqMissingParam,res);
        // Making assertion
        expect(unitTestManager.testReport).toHaveBeenCalledWith(reqMissingParam.body);
        expect(saveMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(statusCodes.reqSuccessfull.created);
        expect(res.json).toHaveBeenCalledWith(reqMissingParam.body)
    });
});

describe('Deleting all test reports from BD Module:deleteAllReports', () => {
    let req;
    beforeEach(() => {
        console.log("Creating common const variables");
        req = {
            body: {
                frameworkName: "Selenium-java-automation",
                suiteName: "Nightly regression",
                tags: ["smoke", "log in", "products", "sanity"],
                reportResults: {
                    status:'PASSED',
                    totalExecuted: 10,
                    totalPassed: 10,
                    totalFailed: 0,
                    reportLink: "https://report_n1.xml",
                    failedTestCases: null
                },
                retry: false,
                executionTime: {
                    startTime: "2025-08-09",
                    endTime: "2025-08-09",
                    duration: 70000
                },
                enviroment:{
                    browser: "Chrome",
                    branch: "main",
                    commit: "b5b4bce"
                }
            }
        }
    });
    test('Test seleteAllReports: correclty delating', async() => {
        const expectedSuccessMsg = "All the reports has been deleted";
        const all = {}
        unitTestManager.testReport = {
            deleteMany: jest.fn(() => all)
        }
        await unitTestManager.deleteAllReports(req, res);
        // making assertions
        expect(res.json).toHaveBeenCalledWith({message: expectedSuccessMsg});
        expect(res.status).toHaveBeenCalledWith(statusCodes.reqSuccessfull.ok);
    });
    test('Test seleteAllReports: throw error trying to delating', async() => {
        const expectedErrorMsg = "expectedResponse is not defined";
        unitTestManager.testReport = {
            deleteMany: jest.fn(() => {throw new Error(expectedErrorMsg)})
        }
        await unitTestManager.deleteAllReports(req, res);
        // making assertions
        expect(() => expectedResponse()).toThrow();
        expect(() => expectedResponse()).toThrow(expectedErrorMsg);
        expect(res.json).toHaveBeenCalledWith({error: expectedErrorMsg});
        expect(res.status).toHaveBeenCalledWith(statusCodes.serverProblem.internalError);
    });
});

describe('Getting test report by ID Module: getTestReportByID', () => {
    test('Test getTestReportByID: Positive response', async () => {
        // 2 mock the parameters needed for the function
        const expectedResponse = {_id:'123', name: 'test report'};
        const req = {params: {_id: '123'}};
        // 3. Mock the value of the function we're Testing
        unitTestManager.testReport = {
            findById: jest.fn(() => expectedResponse)
        }
        // Calling method to be evaludated
        await unitTestManager.getTestReportByID(req, res);
        // making assertions
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
        expect(res.status).toHaveBeenCalledWith(statusCodes.reqSuccessfull.ok);
    });

    test('Test getTestReportByID: ID not found', async()=>{
        // 2 mock the parameters needed for the function
        const expectedResponse = null;
        const req = {params: {_id: '123'}};
        const expectedJsonValue = {message: `_id: ${req.params._id}  not found`};
        // 3. Mock the value of the function we're Testing
        unitTestManager.testReport = {
            findById: jest.fn(() => expectedResponse)
        }
        await unitTestManager.getTestReportByID(req, res);
        // Making assertions
        expect(res.json).toHaveBeenCalledWith(expectedJsonValue);
        expect(res.status).toHaveBeenCalledWith(statusCodes.clientError.notFound);
    });

    test('Test getTestReportByID: throwsing error', async() => {
        // 2 mock the parameters needed for the function
        const msgError = "expectedResponse is not defined";
        const notExpectedResponse = {_id:'123', name: 'test report'};
        const req = {params: {_id: '123'}};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        // 3. Mock the value of the function we're Testing
        unitTestManager.testReport = {
            findById: jest.fn(() => {throw new Error(msgError)})
        }
        await unitTestManager.getTestReportByID(req, res);
        // Making assertions
        expect(() => expectedResponse()).toThrow();
        expect(() => expectedResponse()).toThrow(Error);
        expect(() => expectedResponse()).toThrow(msgError);
        expect(res.json).not.toHaveBeenCalledWith(notExpectedResponse);
        expect(res.json).toHaveBeenCalledWith({"error":msgError});
        expect(res.status).toHaveBeenCalledWith(statusCodes.serverProblem.internalError);
    });
});

describe('Validation of get summary by ID module', () =>{
    test('Test getTestReportSummarByID: valid ID', async()=>{
        const req = {
            params: {
                _id: 123456789
            }
        }
        const expectedReportFoundById = {
            _id:new ObjectId(req.params._id),
            suiteName:"Login",
            status: "FAILED",
            report: "https://myreport.xml",
            failed: 5,
            browser: "Chrome",
            branch: "master"
        }
        // mocking
        unitTestManager.testReport = {
            aggregate: jest.fn(() => expectedReportFoundById)
        };
        // calling function
        await unitTestManager.getTestReportSummarByID(req, res);
        //Making assertions
        expect(res.json).toHaveBeenCalledWith(expectedReportFoundById);
        expect(res.status).toHaveBeenCalledWith(statusCodes.reqSuccessfull.ok);
    });

    test('Test getTestReportSummarByID: throw error', async() => {
        const req = {
            params: {
                _id: 123456789
            }
        }
        const msgError = "expectedResponse is not defined";
        // mocking
        unitTestManager.testReport = {
            aggregate: jest.fn(() => {throw new Error(msgError)})
        };
        // calling function
        await unitTestManager.getTestReportSummarByID(req, res);
        // Making assertion
        expect(() => expectedResponse()).toThrow();
        expect(() => expectedResponse()).toThrow(Error);
        expect(() => expectedResponse()).toThrow(msgError);
        expect(res.json).toHaveBeenCalledWith({"error":msgError});
        expect(res.status).toHaveBeenCalledWith(statusCodes.serverProblem.internalError);
    });

    test('Test getTestReportSummarByID: ID not found', async() => {
        const req = {
            params: {
                _id: 123456789
            }
        }
        const expectedReportFoundById = false;
        // mocking
        unitTestManager.testReport = {
            aggregate: jest.fn(() => expectedReportFoundById)
        };
        // calling function
        await unitTestManager.getTestReportSummarByID(req, res);
        //Making assertions
        expect(res.json).toHaveBeenCalledWith({message: `_id: ${req.params._id}  not found`});
        expect(res.status).toHaveBeenCalledWith(statusCodes.clientError.notFound);
    });
});