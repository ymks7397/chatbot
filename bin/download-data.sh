#!/bin/bash

DIR="$(cd "$(dirname $0)"/.. && pwd)"

# download wordnet db
mkdir "${DIR}/data/wordnet"
cd "${DIR}/data/wordnet"

curl -O "http://compling.hss.ntu.edu.sg/wnja/data/1.1/wnjpn.db.gz"
gzip -d wnjpn.db.gz

# download dbdc2 data
mkdir "${DIR}/data/dbdc2"
cd "${DIR}/data/dbdc2"

curl -L "https://sites.google.com/site/dialoguebreakdowndetection2/downloads/DBDC2_dev.zip?attredirects=0&d=1" \
  -o DBDC2_dev.zip
unzip DBDC2_dev.zip

curl -L "https://sites.google.com/site/dialoguebreakdowndetection2/downloads/DBDC2_ref.zip?attredirects=0&d=1" \
  -o DBDC2_ref.zip
unzip DBDC2_ref.zip
