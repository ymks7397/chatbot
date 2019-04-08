'use strict';

const sqlite3 = require('sqlite3').verbose();

function execute(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

async function showTables() {
  const db = new sqlite3.Database('./data/wordnet/wnjpn.db');
  const rows = await execute(db, 'SELECT name FROM sqlite_master WHERE type="table";', []);
  db.close();
  rows.forEach(row => console.log(row));
}
module.exports.showTables = showTables;

async function getSynonyms(term) {
  const db = new sqlite3.Database('./data/wordnet/wnjpn.db');
  let rows = await execute(db, `
    SELECT synset FROM word
      INNER JOIN sense ON word.wordid == sense.wordid
      WHERE lemma = ?;`,
    [term]);
  const synsets = rows.map(row => row.synset);

  const synonymSet = {};
  for (const synset of synsets) {
    rows = await execute(db, `
      SELECT lemma FROM word
        INNER JOIN sense ON word.wordid == sense.wordid
        WHERE synset = ?;`,
      [synset]);
    rows.forEach(row => {
      if (row.lemma !== term) {
        synonymSet[row.lemma] = null;
      }
    });
  }
  db.close();

  return Object.keys(synonymSet);
}
module.exports.getSynonyms = getSynonyms;
