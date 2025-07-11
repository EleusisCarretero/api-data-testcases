import mongoose from "mongoose";
import {testReportSchema} from "../models/models";
import req from "express/lib/request";
import { statusCodes } from "./codes";


export class testReportManager {
    testReport;
    constructor(){
        this.testReport = mongoose.model('testReport', testReportSchema);
    }
    // /testReport quieries
    async createNewTestReport(rep, res) {
        try{
            let newTestReport = new this.testReport(rep.body);
            const savedTestReport = await newTestReport.save();
            res.status(statusCodes.reqSuccessfull.created).json(savedTestReport);
        }catch(error){
            console.error(`Error trying to add new test report ${error}`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    // /testReport:_id quieres

    async getTestReportByID(rep, res) {
        try{
            console.log(`Actual body contenct: ${req.body}`);
            const reportFoundById = await this.testReport.findById(rep.params.testReportId);
            res.status(statusCodes.reqSuccessfull.ok).json(reportFoundById);
        }catch(error){
            console.error(`Error trying to get test Report by ID`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    
}