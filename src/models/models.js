import mongoose from "mongoose";


const Schema = mongoose.Schema;

export const testReportSchema = new Schema ({
    frameworkName: {
        type:String,
        required:'Entere the framework name'
    },
    suiteName: {
        type:String,
        required: 'Enter a test suite name'
    },
    tags: {
        type:Array
    },
    reportResults:{
        status:{
            type:String,
            required: 'Enter the results status',
            enum: ['PASSED', 'FAILED'],
            default:'FAILED'
        },
        totalExecuted:{
            type:Number,
            required: 'Enter the total of test cases executed'
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
            required: 'Enter the start time of execution'
        },
        endTime:{
            type:Date,
            required: 'Enter the ed time of execution'
        },
        duration:Number
    },
    enviroment:{
        browser:String,
        branch:String,
        commit:String
    }
})

export const usersSchema = new Schema({
    username: {
        type:String,
        required: "Enter the username"
    },
    password: {
        type:String,
        required: 'Enter the password'
    },
    email:{
        type:String,
        required: 'Enter the email'
    },
    role:{
        type: String,
        default: 'user'
    }
})
