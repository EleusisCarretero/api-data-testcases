const { exec } = require('child_process');
const path = require('path');

const scriptExeter = {
  executeBash(bashName) {
    const mongoScript = path.join(__dirname, `${bashName}.sh`);
    exec(`bash ${mongoScript}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error ejecutando script: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`⚠️ STDERR: ${stderr}`);
      }
      console.log(`📜 STDOUT:\n${stdout}`);
    })
  }
};

module.exports = scriptExeter;
