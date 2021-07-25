# Practice DMM API

DMM.com の「商品検索 API Version 3.0」を試してみました。


## How To Use

```sh
# API 通信に Axios を使っているため必要
$ npm install
```

```sh
# DMM API ID と DMM アフィリエイト ID を環境変数で宣言し `npm start` 時に検索キーワードを入力します
$ export DMM_API_ID='【DMM API ID】'
$ export DMM_AFFILIATE_ID='【DMM アフィリエイト ID】'
$ npm start -- '【検索キーワード】'
```

```sh
# 直接 `npm start` してもプロンプトで入力できます
$ npm start

> practice-dmm-api@ start /PATH/TO/practice-dmm-api
> node ./index.js

DMM API キーワード検索 CLI

環境変数 DMM_API_ID が未指定でした。DMM API ID を入力してください :
> 【DMM API ID】

環境変数 DMM_AFFILIATE_ID が未指定でした。DMM アフィリエイト ID を入力してください :
> 【DMM アフィリエイト ID】

DMM API ID            : 【DMM API ID】
DMM アフィリエイト ID : 【DMM アフィリエイト ID】

検索キーワードを入力してください :
> 【検索キーワード】

検索キーワード : 【検索キーワード】

検索結果 :
[
  {
    ...  # 省略
  }
]

取得 3 件 / 全 1000 件
```

`index.js` の中に宣言してある「特別キーワード」を検索キーワードの先頭に付与すると、検索対象サイトを切り替えられます。興味のある大人の方々はコードを見てみてください。

---

- `bulk-list.js`
- `bulk-search.js`
- `bulk-rename.js`
    - DMM.com API からの情報を利用してローカルファイルを一括リネームするためのスクリプト片です


## Links

- [Neo's World](https://neos21.net/)
