import express from 'express';
import bodyParser from 'body-parser'
import routes from './src/routes/routes.js';

const { exec } = require('child_process');
const mongoose = require('mongoose');
const path = require('path');
const connectMongoAtlas = require('./mongoAtlasConnection.js');
 


// Ruta absoluta o relativa del script
const mongoScript = path.join(__dirname, 'start_mongo.sh');

// Ejecuta el script
exec(`bash ${mongoScript}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error ejecutando script: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`STDERR: ${stderr}`);
  }

  console.log(`STDOUT:\n${stdout}`);
});

const args = require('minimist')(process.argv.slice(2));
const app = express();
const PORT = 3000 || args.port;
const ATLASDB = false || args.atlasdb;

if(!ATLASDB){
  //mongoose connection
  console.log("----------- Making connection with LOCAL DB ----------------");
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost:27017/CRMdb',{
  useNewUrlParser:true,
  });
}
else{
  console.log("------------- Making connection with ATLASDB -----------------");
  connectMongoAtlas();
}


// bodyparser setup
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// serving static files
app.use(express.static('public'))


routes(app);

app.get('/', (req, res) =>
    res.send(`Node and express server is running on port ${PORT}`)
);

app.get('/regreet', (req, res) =>
    res.send(`Saludos cordiales ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT}`)
);