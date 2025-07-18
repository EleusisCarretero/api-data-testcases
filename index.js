import express from 'express';
import bodyParser from 'body-parser'
import routes from './src/routes/routes.js';

const connectMongoAtlas = require('./mongoAtlasConnection.js');
const localDBConnection = require('./localConnection.js');
const scriptExeter = require('./executer.js')

/**
 * Reading input variables
 */
const args = require('minimist')(process.argv.slice(2));
const app = express();
const PORT = 3000 || args.port;
const ATLASDB = false || args.atlasdb;
/**
 * Executing scriot no inicilize mongodb server
 */
scriptExeter.executeBash('start_mongo');

/**
 * Execute mongodb data base, local or atlas server
 */
if(!ATLASDB){
  localDBConnection();
}
else{
  connectMongoAtlas();
}

/**
 * Run app 
 */
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// serving static files
app.use(express.static('public'))

routes(app);

app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT}`)
);