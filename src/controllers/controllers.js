import mongoose from "mongoose";
import {testReportSchema, usersSchema} from "../models/models";
import req from "express/lib/request";
import { statusCodes } from "./codes";
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongodb");

const  TestReport = mongoose.model('testReport', testReportSchema);
const Users = mongoose.model('users', usersSchema);

export class testReportManager {
    constructor(){
        this.testReport = TestReport;  // Test report collection
        this.users = Users; // user collections (authentication and security)
    }
    /** 
     * Create a new testReport document which should contains the reuired fields from
     * testReportSchema. This data should come inside req.body
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
    async createNewTestReport(rep, res) {
        try{
            let newTestReport = new this.testReport(rep.body);
            const savedTestReport = await newTestReport.save();
            res.status(statusCodes.reqSuccessfull.created).json(savedTestReport);
        }catch(error){
            console.log(`Error trying to add new test report ${error}`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    /**
     * Retruns all the available testReports documents. If some filters are added in the query
     * it can filter based on status, suitName, start and end, or limit the response. this should
     * come in req.query.
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
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
     * Deltes all available testReport documents
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
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

    /**
     * Returns one single testReport document based on ID. The id should come in the req.params
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
    async getTestReportByID(req, res) {
        try{
            const id = req.params._id;
            console.debug(`Actual value of ${id}`);
            const reportFoundById = await this.testReport.findById(id);
            console.dir(reportFoundById,{ depth: null, colors:true});
            if(!reportFoundById){
                this._isIDFound(res, id);
            }
            res.status(statusCodes.reqSuccessfull.ok).json(reportFoundById);
        }catch(error){
            console.log(`Error trying to get test Report by ID`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    /**
     * It returns a summared version of the testReport document. The id should come in the req.params
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
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
            if(!reportFoundById){
                this._isIDFound(res, id);
            }
            res.status(statusCodes.reqSuccessfull.ok).json(reportFoundById);
        }catch(error){
            console.log(`Error trying to get test Report by ID`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    /**
     * Internal common method to retruns that id has not been found, used in:
     * getTestReportByID and getTestReportSummarByID
     * @param {*} rep : Reques object. 
     * @param {*} id : id that was given but not found.
     * @returns 
     */
    _isIDFound(res, id){
        return res
        .status(statusCodes.clientError.notFound)
        .json({message: `_id: ${id}  not found`});
    }

    /**
     * Deletes the specific test report document based on the id.
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
    async deleteTestReportByID(req, res){
        try{
            const deleted = await this.testReport.findByIdAndDelete(req.params._id);
            if(!deleted){
                this._isIDFound(res, id);
            }
            res.status(statusCodes.reqSuccessfull.noContent).json({"message": `${req.params._id} successfully deleteded`});
        }catch(error){
            console.error(`Error trying to deletind test report ${error}`)
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    /**
     * Enables or disble the retry fields in the testReport docuemtn given based on the ID
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
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
     * Update the testReport document based on ID.
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
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

    /**
     * Gives global stats of the testReport docuemts, like total, passed, failed
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
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

    /**
     * Gives stats of the testreport docuemts based on tags
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
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

    /**
     * Gives stats of the testreport docuemts based on a specific tag
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
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
        }catch(error){
            console.log(`Error trying to the total run`);
            res.status(statusCodes.serverProblem.internalError).json({error:error.message});
        }
    }

    /**
     * Generates a Token if the username and password are correclty given and valid
     * @param {*} rep : Reques object. Represent the HTTP query from client to server.
     * It contains info like .params, .query, .body, .cookies, .ip, .path.
     * @param {*} res : Response object. Represents the HTTP answare. It gives the status code
     * redirect, add headers from the response.
     */
    async getToken (req, res){
        const {username, password} = req.body;
        const isValidUSer = await this.users.findOne({username});
        if(!isValidUSer || isValidUSer.password !== password){
            return res.status(statusCodes.clientError.unauthorized).json({message: "Invalid user name or wrong password"});
        }
        const payload = {userId: isValidUSer._id, username:isValidUSer.usarname};
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '5h'});
        res.status(statusCodes.reqSuccessfull.ok).json({token});
    }
}
