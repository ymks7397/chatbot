# chatbot

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ymks7397/chatbot/blob/master/LICENSE)

本レポジトリは[技術書典６](https://techbookfest.org/event/tbf06)向けに公開している雑談ボットのコードです。  
Slack上で雑談ボットを動かすことができます。

## Installation

インストールの前に、[Node.js](https://nodejs.org/ja/download/)(v8.11.4以降)と[MeCab](http://taku910.github.io/mecab/#download)(v0.996以降)をインストールする必要があります。

本レポジトリをcloneし、npmパッケージをインストールします。

```bash
$ git clone https://github.com/ymks7397/chatbot.git
$ cd chatbot
$ npm install
```

## Usage

**Step1:** 必要なデータをダウンロードします。  
`data/`配下に`dbdc2/`と`wordnet/`が作成され、[対話破綻検出チャレンジ2](https://sites.google.com/site/dialoguebreakdowndetection2/)のデータと[日本語WordNet](http://compling.hss.ntu.edu.sg/wnja/)のDBがダウンロードされます。
```bash
$ ./bin/download-data.sh
```

**Step2:** 対話破綻検出チャレンジ2のデータを扱いやすい形式に変換します。  
`data/`配下に`talks.json`が作成されます。
```bash
$ node src/data-processing/summarize-talks.js
```

**Option:** 必要とあらば`data/talks.json`を編集して会話データを追加します。
```bash
$ vi data/talks.json
```

**Step3:** 検索用のデータを作成します。  
`data/`配下に`search-data.json`が作成されます。
```bash
$ node src/data-processing/analyze-talks.js
```

**Step4:** 環境変数`token`にSlackの[Bots](https://slack.com/apps/A0F7YS25R-bots)用のAPIトークンを設定して、起動コマンドを実行します。
```bash
$ export token=xoxb-xxxx-xxxx-xxxx
$ node ./bin/startup.js
```

**Step5:** 後はSlack上で楽しくボットと会話するだけです。

## Licence
このソフトウェアはMITライセンスの下でリリースされています。
詳細は[LICENSE](https://github.com/ymks7397/chatbot/blob/master/LICENSE)を参照してください。  
依存ライブラリや利用しているデータについては、
それぞれのライセンスを参照ください。

## References

1. [MeCab: Yet Another Part-of-Speech and Morphological Analyzer](http://taku910.github.io/mecab/)
1. 竜一郎東中, 孝太郎船越, 通将稲葉, 由紀荒瀬, 唯子角森. 対話破綻検出チャレンジ(2) (第7 回対話システムシンポ
ジウム). 言語・音声理解と対話処理研究会, Vol. 78, pp. 64–69, oct 2016.
1. [Japanese Wordnet (v1.1)](http://compling.hss.ntu.edu.sg/wnja/index.en.html). © 2009-2011 NICT, 2012-2015 Francis Bond and 2016-2017 Francis Bond, Takayuki Kuribayashi.
