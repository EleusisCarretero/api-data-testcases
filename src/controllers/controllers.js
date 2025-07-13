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
    /**
     * 
     * @param {*} rep 
     * @param {*} res 
     */
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
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getAllTestReports(req, res){
        try{
            // filtering
            let {status, tag, suiteName, start, end, limit} = req.query;
            const filter = {};
            limit = 0 || limit;
            if (status) filter['reportResults.status'] = status;
            if (tag) filter.tags = tag;
            if (suiteName) filter.suiteName = suiteName;
            if (start || end){
                filter['executionTime.startTime'] = {};
                if (start) filter['execution.startTime'].$gte = new Date(start);
                if (end) filter['execution.startTime'].$lte = new Date(end);
            }

            console.dir(filter,{ depth: null, colors:true});
            console.log(`Actual limit of result: ${limit}`);
            const reportsFound = await this.testReport.find(filter).limit(limit).sort({createdAt:-1});
            if(reportsFound.length === 0){
                return res.status(statusCodes.reqSuccessfull.ok).json({data:reportsFound, message:"No reports found with that filter"});
            }
            res.status(statusCodes.reqSuccessfull.ok).json(reportsFound);
        }catch(error){
            console.error(`Error trying to get all the test reports`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async deleteAllReports(req, res){
        try{
            await this.testReport.deleteMany({});
            res.status(statusCodes.reqSuccessfull.ok).json({message: "All the reports has been deleted"});
        }catch(error){
            console.error("Unable to delete all the testReports");
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }
    // /testReport:_id quieres
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
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
            console.debug(`Test report id to updated: ${req.params._id} and actual body to updated ${req.body}`);
            console.dir(req.body,{ depth: null, colors:true});
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
    // /stats/global

    async getStatsGlobal(req, res){
        try{
            let {limit} = req.query;
            limit = -1 || limit;
            const statsFound = await this.testReport.aggregate([
                {$group: {_id: "$reportResults.status" , count: {$sum:1}, ids: {$push:"$_id"}}},
                {$project: {status: "$_id", _id:0, count:1}}]);
            res.status(statusCodes.reqSuccessfull.ok).json(statsFound);
        }catch(error){
            console.error(`Error trying to the total run`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    
}