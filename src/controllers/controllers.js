import mongoose from "mongoose";
import {testReportSchema} from "../models/models";
import req from "express/lib/request";
import { statusCodes } from "./codes";
const { ObjectId } = require("mongodb");



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
            console.log(`newTestReport value ${newTestReport}`);
            const savedTestReport = await newTestReport.save();
            console.log(`SaveTestReport value: ${savedTestReport}`);
            res.status(statusCodes.reqSuccessfull.created).json(savedTestReport);
        }catch(error){
            console.log(`Error trying to add new test report ${error}`);
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
            console.debug(`Actual value of ${req.params._id}`);
            const reportFoundById = await this.testReport.findById(req.params._id);
            console.dir(reportFoundById,{ depth: null, colors:true});
            if(!reportFoundById){
                return res.status(statusCodes.clientError.notFound).json({message: `_id: ${req.params._id}  not found`});
            }
            res.status(statusCodes.reqSuccessfull.ok).json(reportFoundById);
        }catch(error){
            console.log(`Error trying to get test Report by ID`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }
    async getTestReportSummarByID(req, res){
        try{
            const id = req.params._id;
            console.log(`Looking for ID ${id}`);
            const reportFoundById = await this.testReport.aggregate([
                {$match: {_id:new ObjectId(id)}},
                {$project:{ 
                    _id:1,
                    suiteName:1,
                    status: "$reportResults.status",
                    report: "$reportResults.reportLink",
                    failed: "$reportResults.totalExecuted",
                    browser: "$enviroment.browser",
                    branch: "$enviroment.branch"
                }}
            ]);
            console.log(reportFoundById);
            res.status(statusCodes.reqSuccessfull.ok).json(reportFoundById);
        }catch{error}{
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
    async retryTestReportByID(req, res) {
        try{
            const retry = req.query;
            const updated = await this.testReport.findByIdAndUpdate({_id: req.params._id}, retry, {new:true});
            if(!updated){
                return res.status(statusCodes.clientError.notFound).json({message: `_id: ${req.params._id} not found`})
            }
            res.status(statusCodes.reqSuccessfull.noContent).json({message:`_id ${req.params._id} succesfully updated`, updated});
        }catch(error){
            console.error(`Error trying to updating test report ${error}`)
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
            const statsFound = await this.testReport.aggregate([
                {$group: {_id: "$reportResults.status" , count: {$sum:1}, ids: {$push:"$_id"}}},
                {$project: {status: "$_id", _id:0, count:1, ids:1}}]);
        const processed = { TOTAL: { count: 0, ids: [] } };

        for (const { status, count, ids } of statsFound) {
            processed[status] = { count, ids };
            processed.TOTAL.count += count;
            processed.TOTAL.ids.push(...ids);
        }
            res.status(statusCodes.reqSuccessfull.ok).json(processed);
        }catch(error){
            console.error(`Error trying to the total run`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    // stats/byTag
    async getStatsTags(req, res){
        try{
            const statsFound = await this.testReport.aggregate([
                {$unwind: "$tags"},
                {$project: {tags:1, _id:1}}
            ]);
            console.dir(statsFound,{ depth: null, colors:true});
            let processed = {};
            for (const { tags, _id } of statsFound) {
                console.log(_id)
                if (processed[tags] == null){
                    processed[tags] = {count:1, ids:[_id]};
                }
                else{
                    processed[tags].count +=1;
                    processed[tags].ids.push(_id);
                }
            }
            res.status(statusCodes.reqSuccessfull.caching).json(processed);
        }catch(error){
            console.error(`Error trying to the total run`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    async getStatsTagsByTag(req, res){
        try{
            const tag = req.params.tag;
            const testRepostTagged = await this.testReport.aggregate([
                {$unwind:"$tags"},
                {$match: {tags:tag}},
                {$group: {_id: "$reportResults.status" , count: {$sum:1}, ids: {$push:"$_id"}}},
                {$project:{status: "$_id", _id:0, ids:1, count:1}},
                {$sort: {count:-1}}
            ]);
            console.log(testRepostTagged);
            const processed = { [tag]:{TOTAL: 0  }};
            for(const {count, ids, status} of testRepostTagged){
                processed[tag][status] = {count, ids};
                processed[tag].TOTAL += count;
            }
            res.status(statusCodes.reqSuccessfull.ok).json(processed);
        }catch{
            console.error(`Error trying to the total run`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }
}