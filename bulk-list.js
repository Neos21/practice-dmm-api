const fs   = require('fs');
const path = require('path');


// 指定ディレクトリパス配下のファイル名をテキストファイルに出力する
// ================================================================================


// ユーザ指定変数
// --------------------------------------------------------------------------------

const targetDirectoryPath = '/PATH/TO/DIR';  // ファイル名を取得したいディレクトリのフルパス
const outputFileName      = 'list';          // 変換したファイル名リストのファイル名


// 処理
// --------------------------------------------------------------------------------

console.log('Start');

// 指定ディレクトリパス配下のファイルのフルパスを再帰的に取得する
const listFilePaths = targetDirectoryPath => fs.readdirSync(targetDirectoryPath, { withFileTypes: true }).flatMap(dirent => {
  const name = `${targetDirectoryPath}/${dirent.name}`;
  return dirent.isFile() ? [name] : listFilePaths(name);
});
const filePaths = listFilePaths(targetDirectoryPath);

// パス・拡張子を削除しファイル名のみにする
const rawFileNames = filePaths.map(filePath => path.parse(filePath).name);

// ファイル名を調整・一部ファイルを除外する : (お好みで) 記号を削除する・スペースを含むファイルを除外する
const filteredFileNames = rawFileNames.map(fileName => fileName.replace(' ■', '')).filter(fileName => !fileName.includes(' '));

// 配列を複数行テキストに変換する
const result = filteredFileNames.sort().reduce((prev, current) => `${prev}${current}\n`, '');

console.log(`[${targetDirectoryPath}]\n${result}`);
fs.writeFileSync(`./${outputFileName}.txt`, result, 'utf-8');

console.log('Finished');
