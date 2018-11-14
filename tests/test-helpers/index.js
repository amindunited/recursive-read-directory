/* istanbul ignore file */
const fs = require('fs');
const path = require('path');

const mkdirPromise = (dirPath) => {
  const promise = new Promise((resolve, reject) => {
    if (!fs.existsSync(dirPath)) {

      fs.mkdir(dirPath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    } else {
      resolve();
    }

  });
  return promise;
};

const writeFilePromise = (path, content) => {
  const promise = new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if(err) {
        return reject(err);
      }
      resolve();
    });
  });
  return promise;
};

const removeFilePromise = (filePath) => {
  const promise = new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(path.resolve(filePath), (err) => {
        if (err) {
         return reject(err);
        }
        resolve();
      });
    } else {
      // If the file doesn't exist...we don't need to delete it
      resolve();
    }
  });
  return promise;
}

const removeDirectoryPromise = (dirPath) => {
  const promise = new Promise((resolve, reject) => {
    fs.rmdir(dirPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
  return promise;
}

module.exports = {
  mkdirPromise,
  removeDirectoryPromise,
  writeFilePromise,
  removeFilePromise
}
