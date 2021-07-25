const axios = require('axios');


// DMM.com からキーワード検索する CLI スクリプト
// ================================================================================

// テキスト入力を受け付ける : https://qiita.com/suin/items/f18a7dd291d1e1319f44
const readText = () => {
  process.stdin.resume();
  return new Promise(resolve => process.stdin.once('data', resolve)).finally(() => process.stdin.pause()).then(text => text.toString().trim());
};

// FANZA を検索対象とする場合の特別キーワード定義
const fanzaFlag = '-FANZA';

// 検索キーワードをスペースで分割し空値を除外する
const getInputKeywords = keyword => keyword.split(' ').filter(text => text);

// 検索キーワードが特別キーワードのみかどうかをチェックする
const isFanzaFlagOnly = inputKeywords => inputKeywords.length === 1 && inputKeywords[0] === fanzaFlag;

(async () => {
  console.log('DMM API キーワード検索 CLI');
  try {
    // DMM API ID
    let dmmApiId = process.env.DMM_API_ID;
    if(!dmmApiId) {
      console.log('\n環境変数 DMM_API_ID が未指定でした。DMM API ID を入力してください :');
      do {
        process.stdout.write('> ');
        dmmApiId = await readText();
        if(!dmmApiId) console.log('未入力です。DMM API ID を入力してください :');
      }
      while(!dmmApiId);
    }
    
    // DMM アフィリエイト ID
    let dmmAffiliateId = process.env.DMM_AFFILIATE_ID;
    if(!dmmAffiliateId) {
      console.log('\n環境変数 DMM_AFFILIATE_ID が未指定でした。DMM アフィリエイト ID を入力してください :');
      do {
        process.stdout.write('> ');
        dmmAffiliateId = await readText();
        if(!dmmAffiliateId) console.log('未入力です。DMM アフィリエイト ID を入力してください :');
      }
      while(!dmmAffiliateId);
    }
    
    console.log('');
    console.log(`DMM API ID            : ${dmmApiId}`);
    console.log(`DMM アフィリエイト ID : ${dmmAffiliateId}`);
    
    // 検索キーワード
    let keyword = process.argv[2];  // プログラム実行時の第1引数があればそれを検索キーワードとする
    if(keyword && isFanzaFlagOnly(getInputKeywords(keyword))) keyword = '';  // 引数指定値が特別キーワードのみの場合は未入力扱いに直す
    if(!keyword) {
      console.log('\n検索キーワードを入力してください :');
      do {
        process.stdout.write('> ');
        keyword = await readText();
        if(!keyword || isFanzaFlagOnly(getInputKeywords(keyword))) {
          console.log('未入力です。検索キーワードを入力してください :');
          keyword = '';
        }
      }
      while(!keyword);
    }
    
    // 検索キーワードを調整する
    let isDmmCom = true;
    const inputKeywords = getInputKeywords(keyword);
    if(inputKeywords[0] === fanzaFlag) {
      isDmmCom = false;
      inputKeywords.shift();  // 先頭の要素を削除する
      keyword = inputKeywords.join(' ');
    }
    
    console.log(`\n検索キーワード : ${keyword}`);
    if(!isDmmCom) console.log('検索対象サイト : FANZA');
    
    // DMM.com 商品検索 API Version 3.0 をコールする : https://affiliate.dmm.com/api/v3/itemlist.html
    const response = await axios.get('https://api.dmm.com/affiliate/v3/ItemList', {
      params: {
        api_id      : dmmApiId,                        // 必須
        affiliate_id: dmmAffiliateId,                  // 必須
        site        : isDmmCom ? 'DMM.com' : 'FANZA',  // 必須
        hits        : 3,                               // 取得件数 (初期値 20)
        keyword     : keyword
      }
    });
    if(!response.data.result.items.length) return console.warn('\n検索条件に一致する商品は見つかりませんでした');
    
    console.log('\n検索結果 :');
    console.log(JSON.stringify(response.data.result.items, null, '  '));
    console.log(`\n取得 ${response.data.result.result_count} 件 / 全 ${response.data.result.total_count} 件`);
  }
  catch(error) {
    console.error(`\nError : [${error.response.status}] ${error.response.statusText}`);
  }
})();
