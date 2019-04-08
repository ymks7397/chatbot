'use strict';

const Mecab = require('mecab-lite');

const mecab = new Mecab();
mecab.ENCODING = 'UTF-8';
const DEFAULT_POS = ['名詞', '形容詞', '動詞', '感動詞', '副詞', 'フィラー', '連体詞'];

function zen2han(text) {
  return text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, str => String.fromCharCode(str.charCodeAt(0) - 0xFEE0));
}

function text2terms(text, pos = DEFAULT_POS) {
  let parsedData = mecab.parseSync(zen2han(text));
  parsedData = parsedData
    .slice(0, parsedData.length - 1)
    .filter(data => pos.includes(data[1]));
  const terms = parsedData
    .map(data => {
      const term = data[7] === '*' ? data[0] : data[7]; // 原形が利用できるものは原形を使う
      const phonetic = data[1] === '名詞' ? data[8] : ''; // 名詞は読み仮名情報を含める
      return `${term}::${phonetic}`;
    });
  return terms;
}
module.exports.text2terms = text2terms;
