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

    async getAllTestReports(req, res){
        try{
            // filtering
            const {status, tag, suiteName, start, end} = req.query;
            const filter = {};
            if (status) filter['reportResults.status'] = status;
            if (tag) filter.tags = tag;
            if (suiteName) filter.suiteName = suiteName;
            if (start || end){
                filter['executionTime.startTime'] = {};
                if (start) filter['execution.startTime'].$gte = new Date(start);
                if (end) filter['execution.startTime'].$lte = new Date(end);
            }
            console.dir(filter,{ depth: null, colors:true});
            const reportsFound = await this.testReport.find(filter).sort({createdAt:-1});
            res.status(statusCodes.reqSuccessfull.ok).json(reportsFound);
        }catch(error){
            console.error(`Error trying to get all the test reports`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    // /testReport:_id quieres
    async getTestReportByID(req, res) {
        try{
            const reportFoundById = await this.testReport.findById(req.params._id);
            if(!reportFoundById){
                return res.status(statusCodes.clientError.notFound).json({message: `_id: ${req.params._id}  not found`});
            }
            res.status(statusCodes.reqSuccessfull.ok).json(reportFoundById);
        }catch(error){
            console.error(`Error trying to get test Report by ID`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }
    /**
     * Delete testReport by ID
     * @param {*} req - missing
     * @param {*} res - missong
     */
    async deleteTestReportByID(req, res){
        try{
            const deleted = await this.testReport.findByIdAndDelete(req.params._id);
            if(!deleted){
                return res.status(statusCodes.clientError.notFound).json({message: `_id: ${req.params._id} not found`})
            }
            res.status(statusCodes.reqSuccessfull.noContent).json({"message": `${req.params._id} successfully deleteded`});
        }catch(error){
            console.error(`Error trying to deletind test report ${error}`)
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    /**
     * Update a testReport based by ID
     * @param {*} req  - missing
     * @param {*} res - missing
     * @returns 
     */
    async updateTestReportByID(req, res){
        try{
            const updated = await this.testReport.findByIdAndUpdate({_id: req.params._id}, req.body, {new:true});
            if(!updated){
                return res.status(statusCodes.clientError.notFound).json({message: `_id: ${req.params._id} not found`})
            }
            res.status(statusCodes.reqSuccessfull.noContent).json({message:`_id ${req.params._id} succesfully updated`, updated});
        }catch(error){
             console.error(`Error trying to updating test report ${error}`)
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    
}