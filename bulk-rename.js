const fs   = require('fs');


// リネーム後のファイル名リストから一括リネームする
// - ファイル名リストは `MY-ID Title` といった行になっていること
// - `MY-ID` を含むファイルを見付けたらその部分を `MY-ID Title` にリネームする
// ================================================================================


// ユーザ指定変数
// --------------------------------------------------------------------------------

const targetDirectoryPath    = '/PATH/TO/DIR';  // リネームしたいファイルが配下にあるディレクトリのフルパス
const afterFileNamesFilePath = './search.txt';  // リネーム後のファイル名を記載したテキストファイルのファイルパス
const logFileName            = 'rename';        // ログファイル名


// 処理
// --------------------------------------------------------------------------------

let log = '';  // ログ文字列

console.log('Start');

// 指定ディレクトリパス配下のファイルのフルパスを再帰的に取得する
const listFilePaths = targetDirectoryPath => fs.readdirSync(targetDirectoryPath, { withFileTypes: true }).flatMap(dirent => {
  const name = `${targetDirectoryPath}/${dirent.name}`;
  return dirent.isFile() ? [name] : listFilePaths(name);
});
const filePaths = listFilePaths(targetDirectoryPath);

// リネーム後のファイル名リストを読み込み不要な行を除外する
const afterFileNamesText = fs.readFileSync(afterFileNamesFilePath, 'utf-8');
const afterFileNames = afterFileNamesText.split('\n').filter(line => line && !line.includes('(名前なし)') && !line.includes('(検索結果なし)'));

afterFileNames.forEach(afterFileName => {
  const id = afterFileName.split(' ')[0];  // リネーム後ファイル名の先頭は ID
  const targetFilePath  = filePaths.find(filePath => filePath.includes(id));  // ID 部分が合致するファイルのフルパスを取得する
  const renamedFilePath = targetFilePath.replace(id, afterFileName);  // ID 部分を差し替えたフルパスを作る
  
  try {
    fs.renameSync(targetFilePath, renamedFilePath);
    
    console.log(`[${targetFilePath}] → [${renamedFilePath}]`);
    log += `[${targetFilePath}] → [${renamedFilePath}]\n`;
  }
  catch(error) {
    console.error(`[ERROR] [${targetFilePath}] → [${renamedFilePath}]\n`, error);
    log += `  [ERROR] [${targetFilePath}] → [${renamedFilePath}] ${error.toString()}\n`;
  }
});

fs.writeFileSync(`./${logFileName}.txt`, log, 'utf-8');

console.log('Finished');
