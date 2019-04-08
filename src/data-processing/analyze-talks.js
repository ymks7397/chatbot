'use strict';

const fs = require('fs');
const nlp = require('../lib/nlp');
const existsSync = require('../lib/file').existsSync;

function showProgress(count, total) {
  console.log(`${(count / total * 100).toFixed(0)}%: ${count}/${total}`);
}

function analyzeTalks(talks) {
  const docs = talks.map((talk, index) => {
    if (index % Math.floor(talks.length / 100) === 0) {
      showProgress(index, talks.length);
    }
    const terms = nlp.text2terms(talk.question);
    const tf = {};
    terms.forEach(term => {
      if (!(term in tf)) {
        tf[term] = 0;
      }
      tf[term]++;
    });
    return {
      question: talk.question,
      answer: talk.answer,
      tf,
      terms,
      size: terms.length
    };
  });
  showProgress(talks.length, talks.length);
  return docs;
}

function calcDF(docs) {
  const df = {};
  docs.forEach(doc => {
    Object.keys(doc.tf).forEach(term => {
      if (!(term in df)) {
        df[term] = 0;
      }
      df[term]++;
    });
  });
  return df;
}

function _calcIDFMain(df, size) {
  return Math.max(Math.log((size - df + 0.5) / (df + 0.5)), 0.001);
}

function calcIDF(df, size) {
  const idf = {
    '*': _calcIDFMain(0, size)
  };
  Object.keys(df).forEach(term => {
    idf[term] = _calcIDFMain(df[term], size);
  });
  return idf;
}

function main() {
  const outputFile = './data/search-data.json';
  if (existsSync(outputFile)) {
    console.log(`File "${outputFile}" already exists.`);
  } else {
    const talks = JSON.parse(fs.readFileSync('./data/talks.json', 'utf8'));
    const docs = analyzeTalks(talks);
    const df = calcDF(docs);
    const idf = calcIDF(df, docs.length);
    const avgdl = docs
      .map(doc => doc.terms.length)
      .reduce((pre, crr) => pre + crr) / docs.length;
    const dict = {
      docs,
      df,
      idf,
      avgdl,
      size: docs.length
    };
    fs.writeFileSync(outputFile, JSON.stringify(dict, null, 2));
  }
}

main();
