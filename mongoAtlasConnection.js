const mongoose = require('mongoose');
require('dotenv').config();

const USER = process.env.ATLAS_USER;
const PASSWORD = process.env.PASSWORD;
const CLUSTER = process.env.CLUSTER;
const ATLAS_DB = process.env.ATLAS_DB;
const URI = `mongodb+srv://${USER}:${PASSWORD}@${CLUSTER}.mongodb.net/${ATLAS_DB}`
const connectMongoAtlas = async () => {
    try{
        await mongoose.connect(URI);
    }catch(error){
        console.error(`Unable to connect to ATLAS DB: ${error}`);
    }
}

module.exports = connectMongoAtlas;