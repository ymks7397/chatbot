'use strict';

const fs = require('fs');
const nlp = require('./lib/nlp');
const wordnet = require('./lib/wordnet');

const K1 = 1.2;
const B = 0.75;
const NO_RESPONSE_CANDS = [
  '難しいですね',
  'そうですね...',
  'なるほど...',
  'すみません、よくわからないです。',
  'ふむふむ。',
  ':sunglasses:'
];

function calcBM25(doc, data, terms, k1 = K1, b = B) {
  const denom = k1 * (1 - b + b * doc.size / data.avgdl);
  return terms
    .map(term => {
      const idf = data.idf[term] || data.idf['*'];
      const freq = doc.tf[term] || 0;
      return idf * (freq * (k1 + 1)) / (freq + denom);
    })
    .reduce((pre, crr) => pre + crr);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getShuffledInts(max) {
  const array = Array.from(Array(max).keys());
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isKnownTerm(term, data) {
  if (data.df[term]) {
    return true;
  }
  return false;
}

async function getReplaceCandidate(terms, data) {
  const termIndices = getShuffledInts(terms.length);
  for (const i of termIndices) {
    if (isKnownTerm(terms[i], data)) {
      continue;
    }

    // 単語分割結果に読み仮名を含めているので除去
    const term = terms[i].slice(0, terms[i].lastIndexOf('::'));

    const synonyms = await wordnet.getSynonyms(term);
    const synonymIndices = getShuffledInts(synonyms.length);
    for (const j of synonymIndices) {
      const synonym = nlp.text2terms(synonyms[j]);

      // 単語分割される場合は関係のない語になっている可能性があるので除外
      if (synonym.length > 1) {
        continue;
      }

      if (isKnownTerm(synonym[0], data)) {
        return [i, synonym[0]];
      }
    }
  }
  return [null, null];
}

async function search(text, data, limit = 5) {
  const terms = nlp.text2terms(text);

  const [unknownTermIndex, knownTerm] = await getReplaceCandidate(terms, data);
  if (knownTerm) {
    console.log(`Replaced: ${terms[unknownTermIndex]} -> ${knownTerm}`);
    terms[unknownTermIndex] = knownTerm;
  }

  const cands = data.docs
    .map(doc => [doc, calcBM25(doc, data, terms)])
    .filter(data => data[1] > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  return cands;
}

async function main(text) {
  console.log(text);
  const targetData = JSON.parse(fs.readFileSync('./data/search-data.json', 'utf8'));

  const cands = await search(text, targetData);
  let message;
  if (cands.length > 0) {
    const res = cands.map(cand => cand[0])[getRandomInt(cands.length)];
    console.log(res);
    message = res.answer;
  } else {
    message = NO_RESPONSE_CANDS[getRandomInt(NO_RESPONSE_CANDS.length)];
  }
  console.log(message);
  return message;
}
module.exports.search = main;
