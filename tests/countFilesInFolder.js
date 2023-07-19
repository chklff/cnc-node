const fs = require('fs');
const path = require('path');

const directoryPath = '/root/make-account/scenarios'

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  
  let fileCount = 0;
  files.forEach((file) => {
    if (fs.lstatSync(path.join(directoryPath, file)).isFile()) {
      fileCount++;
    }
  });
  console.log(`Number of files: ${fileCount}`);
});
