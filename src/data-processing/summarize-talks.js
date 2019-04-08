'use strict';

const fs = require('fs');
const path = require('path');
const existsSync = require('../lib/file').existsSync;

function readdir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err);
      resolve(files.map(file => path.join(dir, file)));
    });
  });
}

async function walk(dir) {
  const filePaths = await readdir(dir);
  const res = [];
  for (const filePath of filePaths) {
    if (fs.statSync(filePath).isFile()) {
      res.push(filePath);
    } else {
      Array.prototype.push.apply(res, await walk(filePath));
    }
  }
  return res;
}

async function getTalkData(dir) {
  const files = await walk(dir);
  const talksData = files
    .filter(file => /.*\.json$/.test(file))
    .map(file => JSON.parse(fs.readFileSync(file, 'utf8'))
      .turns
      .map(talk => talk.utterance)
    );
  return talksData;
}

async function summarizeJSONs(dir, filepath) {
  const talksData = await getTalkData(dir);
  const talksQA = [];
  talksData.forEach((talks, index) => {
    for (let i = 0; i < Math.floor(talks.length / 2); i++) {
      talksQA.push({
        id: `${index}-${i}`,
        question: talks[2 * i],
        answer: talks[2 * i + 1]
      });
    }
  });
  fs.writeFileSync(filepath, JSON.stringify(talksQA, null, 2));
}

function main() {
  const targetDir = './data/dbdc2';
  const outputFile = './data/talks.json';
  if (!(existsSync(targetDir))) {
    console.log(`Dir "${targetDir}" was not found.`);
  } else if (existsSync(outputFile)) {
    console.log(`File "${outputFile}" already exists.`);
  } else {
    summarizeJSONs(targetDir, outputFile);
  }
}

main();
