const fs    = require('fs');
const axios = require('axios');


// キーワード一覧のテキストファイルを読み込んで順に検索し
// 結果を整形してテキストファイルに出力する
// ================================================================================


// ユーザ指定変数
// --------------------------------------------------------------------------------

const dmmApiId       = 'CHANGE-THIS';  // DMM API ID
const dmmAffiliateId = 'CHANGE-THIS';  // DMM アフィリエイト ID
const isDmmCom       = true;           // 検索対象サイトを Dmm.com (true) とするか FANZA (false) とするか

const inputFilePath  = './bulk-list.txt';  // 検索キーワードを記載した複数行テキストのファイルパス
const outputFileName = 'bulk-search';      // 結果ファイル名 (およびログファイルの接頭辞)


// 処理
// --------------------------------------------------------------------------------

let output      = '';  // 検索キーワードの後ろに名前をスペース区切りで付与した複数行テキストとする
let outputDebug = '';  // ↑と合わせて作品名を付与したデバッグ用の複数行テキストとする

// キーワード検索する
const search = async keyword => {
  // https://affiliate.dmm.com/api/v3/itemlist.html
  const response = await axios.get('https://api.dmm.com/affiliate/v3/ItemList', {
    params: {
      api_id      : dmmApiId,        // 必須
      affiliate_id: dmmAffiliateId,  // 必須
      site        : isDmmCom ? 'DMM.com' : 'FANZA',
      hits        : 1,               // 取得件数 (初期値 20)
      keyword     : keyword
    }
  });
  
  if(!response.data.result.items.length) {
    const fileName = `${keyword} (検索結果なし)`;
    const debug    = `  [${keyword}] (検索結果なし)`;
    console.log(fileName);
    console.log(debug);
    output      += fileName + '\n';
    outputDebug += debug    + '\n';
    return;
  }
  
  response.data.result.items.forEach(item => {
    let fileName = keyword;
    let debug    = `  [${keyword}] [${item.content_id}]`;
    
    // あっ… (察し)
    const names = item.iteminfo?.actress?.reduce((prevNames, actress) => `${prevNames} ${actress.name}`, '') ?? ' (名前なし)';
    fileName += `${names}`;
    debug    += `${names} - ${item.title}`;
    
    console.log(fileName);
    console.log(debug);
    output      += fileName + '\n';
    outputDebug += debug    + '\n';
  });
};

(async () => {
  console.log('Start');
  
  try {
    const idsText = fs.readFileSync(inputFilePath, 'utf-8');
    const ids = idsText.split('\n').filter(id => id);  // 空行を除外する
    for(let id of ids) await search(id);
  }
  catch(error) {
    console.error('ERROR :\n', error, '\nERROR');
  }
  finally {
    // 結果・ログをファイル出力する
    fs.writeFileSync(`./${outputFileName}.txt`      , output     , 'utf-8');
    fs.writeFileSync(`./${outputFileName}-debug.txt`, outputDebug, 'utf-8');
  }
  
  console.log('Finished');
})();
