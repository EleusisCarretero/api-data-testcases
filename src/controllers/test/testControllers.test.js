import { json } from "body-parser";
import { testReportManager } from "../controllers";

 // 1. create a global instance of the class we can to mock
    const unitTestManager = new testReportManager();

test('Test getTestReportByID: Positive response', async () => {
    // 2 mock the parameters needed for the function
    const expectedResponse = {_id:'123', name: 'test report'};
    const req = {params: {_id: '123'}};
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    // 3. Mock the value of the function we're Testing
     unitTestManager.testReport = {
        findById: jest.fn(() => expectedResponse)
    }
    // Calling method to be evaludated
    await unitTestManager.getTestReportByID(req, res);
    // making assertions
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
    expect(res.status).toHaveBeenCalledWith(200);
});

test('Test getTestReportByID: ID not found', async()=>{
    // 2 mock the parameters needed for the function
    const expectedResponse = null;
    const req = {params: {_id: '123'}};
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };
    const expectedJsonValue = {message: `_id: ${req.params._id}  not found`};
    // 3. Mock the value of the function we're Testing
     unitTestManager.testReport = {
        findById: jest.fn(() => expectedResponse)
    }
    await unitTestManager.getTestReportByID(req, res);
    // Making assertions
    expect(res.json).not.toHaveBeenCalledWith(expectedResponse);
    expect(res.json).toHaveBeenCalledWith(expectedJsonValue);
    expect(res.status).toHaveBeenCalledWith(404);
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
    expect(res.status).toHaveBeenCalledWith(500);
});