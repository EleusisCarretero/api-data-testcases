import mongoose from "mongoose";


const Schema = mongoose.Schema;

export const testReportSchema = new Schema ({
    frameworkName: {
        type:String,
        requiere:'Entere the framework name'
    },
    suiteName: {
        type:String,
        require: 'Enter a test suite name'
    },
    tags: {
        type:Array
    },
    reportResults:{
        status:{
            type:String,
            require: 'Enter the results status',
            enum: ['PASSED', 'FAILED'],
            default:'FAILED'
        },
        totalExecuted:{
            type:Number,
            require: 'Enter the total of test cases executed'
        },
        totalPassed:{
            type:Number
        },
        totalFailed: {
            type:Number
        },
        reportLink:{ 
            type:String
        },
        failedTestCases:[{
            name: String,
            errorMsg: String
        }]
    },
    retry: {
        type: Boolean,
        default: false
    },
    executionTime: {
        startTime:{
            type: Date,
            require: 'Enter the start time of execution'
        },
        endTime:{
            type:Date,
            require: 'Enter the ed time of execution'
        },
        duration:Number
    },
    enviroment:{
        browser:String,
        branch:String,
        commit:String
    }
})