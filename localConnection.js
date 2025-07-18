const mongoose = require('mongoose');
require('dotenv').config();
const DB = process.env.DB;
const LOCAL_PORT = process.env.LOCAL_PORT;


const localDBConnection = async() => {
    try{
        mongoose.Promise = global.Promise;
        mongoose.connect(`mongodb://localhost:${LOCAL_PORT}/${DB}`,{
        useNewUrlParser:true,
        });
    }catch(error){
        console.error(`Unabel to make connection with local daba base ${databaseName}`)
    }
}

module.export = localDBConnection;