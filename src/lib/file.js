'use strict';

const fs = require('fs');

function existsSync(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.log(error);
    }
    return false;
  }
}
module.exports.existsSync = existsSync;
